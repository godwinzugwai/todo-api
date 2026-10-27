# Saturn (node-first-push)

A minimal Node.js project that demonstrates loading environment variables from a `.env` file using [dotenv](https://github.com/motdotla/dotenv). It is a first push to GitHub, so it also serves as a clean starting point for a Node.js app.

## What it does

`index.js` loads variables from `.env` into `process.env` and prints the value of `API_KEY` to the console.

## Prerequisites

- [Node.js](https://nodejs.org/) v12 or later (required by dotenv)
- npm (comes with Node.js)
- Git

## Getting started

1. **Clone the repository**

   ```bash
   git clone https://github.com/godwinzugwai/node-first-push.git
   cd node-first-push
   ```

2. **Install dependencies**

   The `node_modules` folder is not stored in the repository (it is listed in `.gitignore`), so install the dependencies with:

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   API_KEY=your_api_key_here
   ```

   The `.env` file is ignored by Git, so your secrets are never pushed to GitHub. Use `.env.example` as a template.

4. **Run the project**

   ```bash
   node index.js
   ```

   You should see the value of `API_KEY` printed in the terminal.

## Project structure

```
node-first-push/
├── .env.example        # Template showing required variables (no real values)
├── .gitignore          # Excludes node_modules and .env from version control
├── index.js            # Entry point
├── package.json        # Project metadata and dependencies
└── package-lock.json   # Locked dependency versions
```

## Environment variables

| Variable  | Description                  | Required |
| --------- | ---------------------------- | -------- |
| `API_KEY` | API key read by `index.js`   | Yes      |

## Dependencies

| Package                                     | Version   | Purpose                                      |
| ------------------------------------------- | --------- | -------------------------------------------- |
| [dotenv](https://www.npmjs.com/package/dotenv) | ^17.3.1 | Loads variables from `.env` into `process.env` |

## Security notes

- Never commit your `.env` file or share real API keys.
- Avoid logging secrets in real projects. The current `console.log` of `API_KEY` is for demonstration only.

## Scripts

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `node index.js` | Runs the app                              |
| `npm test`      | Placeholder, no tests have been written yet |

## License

ISC

## Author

Godwin Zugwai
