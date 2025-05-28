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

## Getting Started

### 1. Install Dependencies

```bash
npm install
```
or
```bash
pnpm install
```

### 2. Build the Broker

```bash
npm run build
```
or
```bash
pnpm run build
```

The built JavaScript will be in `dist/index.js`.

---

## Deployment

### Option 1: Deploy by File

1. **Rename** the built file to `.jssp`  
   Example:  
   ```bash
   mv dist/index.js dist/twilio-sms-broker.jssp
   ```

2. **Upload in K2:**  
   - Go to  
     `System > Management > SmartObjects > SmartObjects > JavaScript Service Provider`
   - Use **Create or Update from File** and select your `.jssp` file.

### Option 2: Deploy by URL

1. **Host** the built file (`dist/index.js`) at a public URL.
2. **Register in K2:**  
   - Use **Create or Update from URL** and provide the file's direct link.

---

## Configuration

When you create the service instance in K2, you’ll be prompted for:
- **Twilio Account SID**
- **Twilio Auth Token**

These are used for authenticating all API calls.

---

## Usage

After deploying, you can:
- **Send SMS:** Use the “Send Message” method, providing `to`, `from`, and `body`.
- **Get Message:** Retrieve status/details by Twilio SID.
- **List Messages:** View and filter SMS messages.
- **Delete Message:** Remove a message by SID.

Phone numbers must be in E.164 format (e.g., `+1234567890`).

