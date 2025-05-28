# K2 JSSP TypeScript Broker for Twilio SMS

Integrate Twilio SMS with your K2 low-code platform: send, retrieve, list, and delete SMS messages.

---

## Features

- **Send SMS:** Send SMS messages via Twilio.
- **Retrieve Status:** Get status and details of sent messages.
- **List Messages:** View and filter SMS messages.
- **Delete Messages:** Remove messages from your Twilio account.
- **Secure Authentication:** Uses Twilio Account SID and Auth Token.
- **K2 JSSP Compatible:** Deploy as a JavaScript Service Provider in K2.

---

## Requirements

- [Node.js](https://nodejs.org/) v22.5.1+
- [Twilio Account](https://www.twilio.com/try-twilio)
- K2 environment with JavaScript Service Provider support

---

## Deployment

Most users **do not need to build or modify the code** themselves.

### Option 1: Deploy by File

1. **Copy the built file**  
   The distributable file is already built for you:  
   - Use `dist/index.js` from this repository.
2. **(Optional) Rename**  
   You may rename `index.js` to something more descriptive, such as `twilio-sms-broker.jssp`:
   ```bash
   mv dist/index.js dist/twilio-sms-broker.jssp
   ```
3. **Upload in K2**  
   - Navigate to  
     `System > Management > SmartObjects > SmartObjects > JavaScript Service Provider`
   - Click **Create or Update from File** and select your `.jssp` file.

### Option 2: Deploy by URL

1. **Host** the built file (`dist/index.js`) at a public URL of your choice.
2. **Register in K2**  
   - Go to  
     `System > Management > SmartObjects > SmartObjects > JavaScript Service Provider`
   - Use **Create or Update from URL** and provide the direct link to your hosted file.

---

## Building the Broker (For Developers or Custom Builds)

If you need to build the broker yourself (for customization or contributing):

1. **Clone or fork this repository.**
2. **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    pnpm install
    ```
3. **Build the distributable file:**
    ```bash
    npm run build
    ```
    or
    ```bash
    pnpm run build
    ```
4. The output file will appear in the `dist` folder as `index.js`.

You can now follow the deployment instructions above using your built file.

---

## Configuration

After uploading or registering the broker file,  
**create a service instance** for the Twilio SMS Broker in your K2 environment.  
You can do this via:
- The K2 Management Site  
- Or the SmartObject Service Tester

You will be prompted for:
- **Twilio Account SID**
- **Twilio Auth Token**

These credentials are required for authenticating all API calls.

---

## Objects & Methods

### Message

| Property   | Type   | Description                                |
|------------|--------|--------------------------------------------|
| sid        | string | Twilio message SID                         |
| to         | string | Recipient phone number (E.164 format)      |
| from       | string | Sender phone number (E.164 format)         |
| body       | string | Message content                            |
| status     | string | Message delivery status                    |
| dateSent   | string | Date/time the message was sent             |

#### Methods

| Method      | Type   | Description                     | Inputs                      | Outputs                  |
|-------------|--------|---------------------------------|-----------------------------|--------------------------|
| send        | create | Send a new SMS message          | to, from, body              | sid, status, dateSent    |
| get         | read   | Retrieve details by message SID | sid                         | to, from, body, status   |
| list        | list   | List/filter SMS messages        | (optional) filters          | Array of Message objects |
| delete      | delete | Delete a message by SID         | sid                         | (success/failure)        |

---

## Usage

After deploying and configuring the service instance, you can:

- **Send SMS:** Use the “send” method, providing `to`, `from`, and `body`.
- **Get Message:** Retrieve status/details by Twilio SID.
- **List Messages:** View and filter SMS messages.
- **Delete Message:** Remove a message by SID.

**Note:** Phone numbers must be in E.164 format (e.g., `+1234567890`).

### Example Output (Send SMS)

~~~
{
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "sent",
  "dateSent": "2025-05-28T13:14:15Z"
}
~~~

---

## Development Notes

- **System Name:** `com.demo.twilio.sms`
- **Display Name:** `Twilio SMS Broker`
- **Description:** Integrates Twilio SMS with K2 for sending, retrieving, listing, and deleting SMS messages.

---

## License

MIT

---

## Credits

- [`twilio`](https://www.npmjs.com/package/twilio)
