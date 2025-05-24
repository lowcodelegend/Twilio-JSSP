import "@k2oss/k2-broker-core";

/**
 * Twilio SMS Broker - Sends, retrieves, lists, and deletes SMS messages.
 */

metadata = {
  systemName: "com.yourcompany.twilio.sms",
  displayName: "Twilio SMS Broker",
  description: "Integrates with Twilio to send, fetch, list, and delete SMS messages.",
  configuration: {
    accountSid: {
      displayName: "Twilio Account SID",
      type: "string",
      required: true
    },
    authToken: {
      displayName: "Twilio Auth Token",
      required: true,
      type: "string"
    }
  }
};


ondescribe = async function ({ configuration }): Promise<void> {
  postSchema({
    objects: {
      message: {
        displayName: "Message",
        description: "Represents an SMS message in Twilio.",
        properties: {
          sid: { displayName: "Message SID", type: "string" },
          to: { displayName: "To", type: "string" },
          from: { displayName: "From", type: "string" },
          body: { displayName: "Body", type: "string" },
          status: { displayName: "Status", type: "string" },
          dateSent: { displayName: "Date Sent", type: "string" },
          errorCode: { displayName: "Error Code", type: "string" },
        },
        methods: {
          send: {
            displayName: "Send Message",
            type: "create",
            inputs: ["to", "from", "body"],
            outputs: ["sid", "status", "dateSent", "errorCode"],
          },
          get: {
            displayName: "Get Message",
            type: "read",
            inputs: ["sid"],
            outputs: [
              "sid",
              "to",
              "from",
              "body",
              "status",
              "dateSent",
              "errorCode",
            ],
          },
          list: {
            displayName: "List Messages",
            type: "list",
            parameters: {
              to: { displayName: "To", type: "string" },
              from: { displayName: "From", type: "string" },
              dateSent: { displayName: "Date Sent", type: "string" },
            },
            outputs: [
              "sid",
              "to",
              "from",
              "body",
              "status",
              "dateSent",
              "errorCode",
            ],
          },
          delete: {
            displayName: "Delete Message",
            type: "delete",
            inputs: ["sid"],
            outputs: [],
          },
        },
      },
    },
  });
};

onexecute = async function ({
  objectName,
  methodName,
  parameters,
  properties,
  configuration,
  schema,
}): Promise<void> {
  switch (objectName) {
    case "message":
      await onexecuteMessage(methodName, properties, parameters, configuration);
      break;
    default:
      throw new Error("The object '" + objectName + "' is not supported.");
  }
};

async function onexecuteMessage(
  methodName: string,
  properties: SingleRecord,
  parameters: SingleRecord,
  configuration: SingleRecord
): Promise<void> {
  switch (methodName) {
    case "send":
      await onexecuteMessageSend(properties, configuration);
      break;
    case "get":
      await onexecuteMessageGet(properties, configuration);
      break;
    case "list":
      await onexecuteMessageList(parameters, configuration);
      break;
    case "delete":
      await onexecuteMessageDelete(properties, configuration);
      break;
    default:
      throw new Error("The method '" + methodName + "' is not supported.");
  }
}

function getTwilioApiBaseUrl(accountSid: string) {
  return "https://api.twilio.com/2010-04-01/Accounts/" + encodeURIComponent(accountSid);
}

// Helper: Creates an XHR with Twilio Auth
function createTwilioXHR(method: string, url: string, configuration: SingleRecord): XMLHttpRequest {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  // Basic Auth (Base64 encoding)
  const username = configuration["accountSid"];
  const password = configuration["authToken"];
  const credentials = base64Encode(username + ":" + password);
  xhr.setRequestHeader("Authorization", "Basic " + credentials);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  return xhr;
}

// --- SEND MESSAGE ---
async function onexecuteMessageSend(properties: SingleRecord, configuration: SingleRecord): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const url = getTwilioApiBaseUrl(configuration["accountSid"].toString()) + "/Messages.json";
    const xhr = createTwilioXHR("POST", url, configuration);

    const params = [
      "To=" + encodeURIComponent(properties["to"].toString()),
      "From=" + encodeURIComponent(properties["from"].toString()),
      "Body=" + encodeURIComponent(properties["body"].toString())
    ].join("&");

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        if (xhr.status < 200 || xhr.status >= 300)
          throw new Error("Twilio send failed: " + xhr.status + " - " + xhr.responseText);

        const obj = JSON.parse(xhr.responseText);
        postResult({
          sid: obj.sid,
          status: obj.status,
          dateSent: obj.date_sent || "",
          errorCode: obj.error_code ? String(obj.error_code) : ""
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    };

    xhr.send(params);
  });
}

// --- GET MESSAGE ---
async function onexecuteMessageGet(properties: SingleRecord, configuration: SingleRecord): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!properties["sid"]) throw new Error("sid is required.");
    const url = getTwilioApiBaseUrl(configuration["accountSid"].toString()) + "/Messages/" + encodeURIComponent(properties["sid"].toString()) + ".json";
    const xhr = createTwilioXHR("GET", url, configuration);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        if (xhr.status < 200 || xhr.status >= 300)
          throw new Error("Twilio get failed: " + xhr.status + " - " + xhr.responseText);

        const obj = JSON.parse(xhr.responseText);
        postResult({
          sid: obj.sid,
          to: obj.to,
          from: obj.from,
          body: obj.body,
          status: obj.status,
          dateSent: obj.date_sent || "",
          errorCode: obj.error_code ? String(obj.error_code) : ""
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    };

    xhr.send();
  });
}

// --- LIST MESSAGES ---
async function onexecuteMessageList(parameters: SingleRecord, configuration: SingleRecord): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let url = getTwilioApiBaseUrl(configuration["accountSid"].toString()) + "/Messages.json";
    const params = [];
    if (parameters["to"]) params.push("To=" + encodeURIComponent(parameters["to"].toString()));
    if (parameters["from"]) params.push("From=" + encodeURIComponent(parameters["from"].toString()));
    if (parameters["dateSent"]) params.push("DateSent=" + encodeURIComponent(parameters["dateSent"].toString()));
    if (params.length > 0) url += "?" + params.join("&");

    const xhr = createTwilioXHR("GET", url, configuration);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        if (xhr.status < 200 || xhr.status >= 300)
          throw new Error("Twilio list failed: " + xhr.status + " - " + xhr.responseText);

        const obj = JSON.parse(xhr.responseText);
        if (!obj.messages || !Array.isArray(obj.messages)) {
          throw new Error("Unexpected Twilio response: " + xhr.responseText);
        }
        for (const msg of obj.messages) {
          postResult({
            sid: msg.sid,
            to: msg.to,
            from: msg.from,
            body: msg.body,
            status: msg.status,
            dateSent: msg.date_sent || "",
            errorCode: msg.error_code ? String(msg.error_code) : ""
          });
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    };

    xhr.send();
  });
}

// --- DELETE MESSAGE ---
async function onexecuteMessageDelete(properties: SingleRecord, configuration: SingleRecord): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!properties["sid"]) throw new Error("sid is required.");
    const url = getTwilioApiBaseUrl(configuration["accountSid"].toString()) + "/Messages/" + encodeURIComponent(properties["sid"].toString()) + ".json";
    const xhr = createTwilioXHR("DELETE", url, configuration);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        // Twilio returns 204 No Content for success
        if (xhr.status === 204) {
          resolve();
        } else if (xhr.status < 200 || xhr.status >= 300) {
          throw new Error("Twilio delete failed: " + xhr.status + " - " + xhr.responseText);
        } else {
          // If Twilio ever returns a body, can parse here.
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    };

    xhr.send();
  });
}

  function base64Encode(str) {
  if (typeof Buffer !== "undefined") return Buffer.from(str, "utf-8").toString("base64");
  if (typeof btoa !== "undefined") return btoa(str);
  // Fallback: Pure JS (covers almost any JS runtime)
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let encoded = '', c1, c2, c3, e1, e2, e3, e4, i = 0;
  while (i < str.length) {
    c1 = str.charCodeAt(i++);
    c2 = str.charCodeAt(i++);
    c3 = str.charCodeAt(i++);
    e1 = c1 >> 2;
    e2 = ((c1 & 3) << 4) | (c2 >> 4);
    e3 = ((c2 & 15) << 2) | (c3 >> 6);
    e4 = c3 & 63;
    if (isNaN(c2)) e3 = e4 = 64;
    else if (isNaN(c3)) e4 = 64;
    encoded += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + chars.charAt(e4);
  }
  return encoded;
}