# Rate Repository API

This is a GraphQL API for the Rate Repository application.

## 🚀 Getting started

1. Clone this repository and run `npm install` in the `rate-repository-api` folder.

2. Run `npm run build`. This will setup a sqlite database and run migrations.

3. (Optional) To populate the database with some seed data you can run `npm run seed:run`. **Note:** running this command will remove all existing data.

4. Rate Repository API uses the GitHub API, which has quite small rate limit (60 per requests per hour) for unauthorized requests. Therefore, we need to register it as an OAuth application to obtain client credentials. Register your OAuth application [here](https://github.com/settings/applications/new) by setting "Application name" as "Rate Repository API", "Homepage URL" as https://github.com/Kaltsoon/rate-repository-api and "Authorization callback URL" as http://localhost:5000. Now you should see your application [here](https://github.com/settings/developers) and by going to the application's page, see the "Client ID" and "Client Secret" values.

5. Rename the `.env.template` file in the `rate-repository-api` folder to `.env`. And replace `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` variable values with your newly registered OAuth application's credentials.

6. All done! Just run `npm start` to start the server. After the server has started you should be able to access the GraphQL playground at http://localhost:5000/graphql.

## 🔑 Authorization

To list all the registered users, you can run this query in the GraphQL playground:

```javascript
{
  users {
    edges {
      node {
        username
      }
    }
  }
}
```

You can retrieve an access token by performing the `authorize` mutation:

```javascript
mutation {
  authorize(credentials: { username: "kalle", password: "password" }) {
    accessToken
  }
}
```

All access tokens expires after **seven days**. If you performed the step 3. in the "Getting started" section, users "kalle", "elina" and "matti" all have tha password "password".

You can also register a new user by performing the `createUser` mutation:

```javascript
mutation {
  createUser(user: { username: "myusername", password: "mypassword" }) {
    id
    username
  }
}
```

### Authorize requests in the GraphQL playground

A handy way to authorize requests in the GraphQL playground is to retrieve an access token using the `authorize` mutation (see above for details) and then add the following in the "HTTP HEADERS" tab below the query editor:

```json
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

Replace the `<ACCESS_TOKEN>` part with your access token.

## 📖 Documentation

GraphQL playground offers a documentation on how to use the API. Start the server by running `npm start`, open the GraphQL playground at http://localhost:5000/graphql and click "DOCS".

## ❓ FAQ

- **How to reset the database?** If you are absolutely sure that you wan't to remove _all_ the existing data, just remove the `database.sqlite` file in the `rate-repository-api` folder and run `npm run build`.

- **Is this API production ready?** Almost, however current version of the API utilizes sqlite database, which is not quite suitable for production. Luckily, all database queries are performed with [Objection](https://vincit.github.io/objection.js/) ORM and changing the underlying database driver is just a matter of [configuration](http://knexjs.org/#Installation-client).
