# ReUsed e-Store API

This was developed to be used as a backend API for an e-commerce store that allows users to buy and sell second-hand items.

**!!! Project was discontinued after developing the API in favor of building something I could use personally which would be more exciting !!!**

## Table of Contents

- [Description](#Description)
- [How to set up locally](#How-to-set-up-locally)
- [Built with](#Built-with)

## Description

This was designed to be an API for an e-commerce store. Sustainability is important to me, so I was motivated by the idea of building a platform that users could use to buy and sell second hand items.

This is something that facebook marketplace and craigslist already do, but this was a learning experience.

## How to set up locally

```bash
git clone git@github.com:mdesanker/reused-api.git
cd reused-api
npm install
npm start
```

Running this API locally will require you to create a .env file in the root directory with the following variables:

```bash
PORT={{server port}}
DB_URI={{MongoDB URI}}
JWT_KEY={{JWT key}}
```

To run router tests, modify path in `test` script with desired fileName:

```json
"test": "NODE_ENV=test jest ./routes/__tests__/product.test.ts --testTimeout=10000 --detectOpenHandles --forceExit",
```

```bash
npm test
```

## Built with

- NodeJS
- ExpressJS
- JWT Authentication
- MongoDB/Mongoose
- supertest
- TypeScript
