<!-- # Saturn (node-first-push)

***docs: add Postman collection for manual testing.
the entirety of the postman folder was generated



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

Godwin Zugwai -->

# Todo API

A REST API for a to-do list built with **Node.js, Express 5, Prisma 7 and PostgreSQL**. Todos belong to users (one user has many todos).

Built as the Module 4 (Express server, in-memory) and Module 5 (PostgreSQL with Prisma) exercises.

## Features

- Full CRUD for todos: `GET`, `POST`, `PUT`, `DELETE`
- Users, with a 1:many relationship to todos
- One query returns a user together with all their todos
- Middleware that logs every request (timestamp, method, path)
- Input validation and clear JSON error responses

## Prerequisites

- Node.js 20 or later
- A running PostgreSQL database

## Setup

```bash
git clone https://github.com/godwinzugwai/node-first-push.git
cd node-first-push
npm install
```

Create your environment file and set your database URL:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/todo_db?schema=public"
PORT=3000
```

Create the tables, then start the server:

```bash
npx prisma migrate dev     # creates the users and todos tables
npm run dev                # or: npm start
```

The API is now running at `http://localhost:3000`.

## Endpoints

### Todos

| Method | Path         | Description                            | Body                                                     |
| ------ | ------------ | -------------------------------------- | -------------------------------------------------------- |
| GET    | `/todos`     | List all todos (`?userId=1` to filter) |                                                          |
| GET    | `/todos/:id` | Get one todo                           |                                                          |
| POST   | `/todos`     | Create a todo                          | `{ "title": "...", "completed"?: bool, "userId"?: int }` |
| PUT    | `/todos/:id` | Update `title` and/or `completed`      | `{ "title"?: "...", "completed"?: bool }`                |
| DELETE | `/todos/:id` | Delete a todo (returns `204`)          |                                                          |

### Users

| Method | Path               | Description                     | Body                                |
| ------ | ------------------ | ------------------------------- | ----------------------------------- |
| GET    | `/users`           | List all users                  |                                     |
| POST   | `/users`           | Create a user                   | `{ "name": "...", "email": "..." }` |
| GET    | `/users/:id/todos` | Get a user with all their todos |                                     |

### Example

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com"}'

curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Prisma","userId":1}'

curl http://localhost:3000/users/1/todos
```

```json
{
  "id": 1,
  "name": "Ada",
  "email": "ada@example.com",
  "createdAt": "2026-10-27T10:00:00.000Z",
  "todos": [
    {
      "id": 1,
      "title": "Learn Prisma",
      "completed": false,
      "createdAt": "2026-10-27T10:01:00.000Z",
      "userId": 1
    }
  ]
}
```

### Status codes

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| 200  | Success                                                   |
| 201  | Created                                                   |
| 204  | Deleted (no body)                                         |
| 400  | Invalid input (bad body, or id is not a positive integer) |
| 404  | Todo, user or route not found                             |
| 409  | A user with that email already exists                     |
| 500  | Unexpected server error                                   |

## Database

```
users                       todos
-----                       -----
id         SERIAL  PK       id          SERIAL   PK
name       TEXT             title       TEXT
email      TEXT    UNIQUE   completed   BOOLEAN  DEFAULT false
created_at TIMESTAMP        created_at  TIMESTAMP
                            user_id     INTEGER  FK -> users.id (nullable)
```

The schema lives in `prisma/schema.prisma`. After changing it, run `npx prisma migrate dev --name describe_change`.

## Testing

- **Postman:** import `postman/todo-api.postman_collection.json` and run the requests in order.
- **Automated tests:** `npm test` runs integration tests against the database in `DATABASE_URL`. The tests **delete all rows** in `users` and `todos`, so use a separate test database, never real data.

## Project structure

```
todo-api/
├── prisma/
│   ├── schema.prisma          # Data models
│   └── migrations/            # SQL migrations
├── prisma.config.js           # Prisma 7 config (reads DATABASE_URL)
├── src/
│   ├── server.js              # Starts the server, shuts down cleanly
│   ├── app.js                 # Express app, middleware, error handling
│   ├── db/prisma.js           # Shared Prisma client
│   ├── middleware/logger.middleware.js
│   ├── routes/                # URL -> controller mapping
│   ├── controllers/           # Validation and HTTP responses
│   ├── data/                  # Database queries (Prisma)
│   └── utils/validate.js
├── test/api.test.js
├── postman/
├── .env.example
└── package.json
```

## License

ISC
