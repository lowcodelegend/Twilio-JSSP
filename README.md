\# Fortune Cookie Broker

A lightweight K2 SmartObject broker that returns random fortune cookie messages, complete with a slug and timestamp—powered by npm modules!

---

\## Features

\- Returns a random fortune cookie message.  
\- Each fortune is provided with:  
  \- **Slug:** A URL-friendly version of the fortune.  
  \- **Date:** The exact date and time when the fortune was fetched.  
\- Powered by community npm modules: [\`fortune-cookie\`](https://www.npmjs.com/package/fortune-cookie), [\`slugify\`](https://www.npmjs.com/package/slugify), and [\`dayjs\`](https://www.npmjs.com/package/dayjs).

---

\## Installation

1. Clone or copy this repository into your K2 App.  
2. Ensure the required npm dependencies are available:  
    \```
    npm install fortune-cookie slugify dayjs
    \```
3. Deploy your JSSP as usual.

---

\## Objects \& Methods

\### Fortune

\| Property \| Type   \| Description                  \|
\|----------\|--------\|------------------------------\|
\| fortune  \| string \| The fortune cookie message.   \|
\| slug     \| string \| URL-friendly slug of fortune. \|
\| date     \| string \| Date and time generated.      \|

\#### Methods

\| Method \| Type \| Description           \| Inputs \| Outputs              \|
\|--------\|------\|-----------------------\|--------\|----------------------\|
\| get    \| read \| Returns a new fortune \| none   \| fortune, slug, date  \|

---

\## Usage

Call the **Fortune** object and use the \`get\` method to retrieve a fresh fortune cookie message, its slug, and the timestamp.

\### Example Output

\```
{
  "fortune": "You will have a pleasant surprise.",
  "slug": "you-will-have-a-pleasant-surprise",
  "date": "2025-05-28 13:14:15"
}
\```

---

\## Development Notes

\- **System Name:** \`com.demo.fortunecookie\`  
\- **Display Name:** \`Fortune Cookie Broker\`  
\- **Description:** Returns random fortune cookies with extra metadata, powered by npm modules!

---

\## License

MIT

---

\## Credits

\- [\`fortune-cookie\`](https://www.npmjs.com/package/fortune-cookie)  
\- [\`slugify\`](https://www.npmjs.com/package/slugify)  
\- [\`dayjs\`](https://www.npmjs.com/package/dayjs)
