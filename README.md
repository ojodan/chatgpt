# LINE Course Registration Example

This repository contains a simple example of how to implement a course registration API that could be used with a LINE bot or LIFF application.

## Running the Server

There are no external dependencies. Simply run:

```bash
node server/index.js
```

The API will listen on port `3000` by default.

## Available Endpoints

- `GET /api/courses` – List all courses.
- `POST /api/courses/:id/register` – Register for a course. Send your LINE user ID in the `X-User-Id` header.
- `GET /api/members/me/registrations` – View the registrations for the current user (identified by `X-User-Id`).

This server uses Node's built-in `http` module and keeps data in memory for demonstration purposes.
