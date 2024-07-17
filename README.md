# likhalikhi

Welcome to likhalikhi! This is a blog application project currently under development.

## Contents

- [Tech Stack](#tech-stack)
- [Current Status](#current-status)
- [JWT Authentication](#jwt-authentication)
  - [What is JWT?](#what-is-jwt)
  - [How a JWT is Structured?](#how-a-jwt-is-structured)
  - [How to Securely Store JWT on the Client Side?](#how-to-securely-store-jwt-on-the-client-side)
  - [How to Invalidate a JWT Token](#how-to-invalidate-a-jwt-token)
  - [JWT vs Session](#jwt-vs-session)
  - [How JWT Works in likhalikhi](#how-jwt-works-in-likhalikhi)
  - [JWT Setup](#jwt-setup)
- [Database Models](#database-models)
  - [User Model](#user-model)
  - [Post Model](#post-model)

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js

<!-- ## Contributing

We welcome contributions to likhalikhi! If you're interested in contributing, please follow these steps:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request. -->

## Current Status

- Frontend UI in progress.
- JWT Authentication in progress.

## JWT Authentication

### What is JWT?

JSON Web Token (JWT) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It is commonly used for authentication and information exchange.

### How a JWT structured?

JSON Web Token (JWT) is a long string . which is divided by three parts [header.information.verifyable-singature]. It is a encoded string looks like

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

header, information, verifyable signature are separated by ' . '(dot)

### How do you securely store JWT in client side?

we can store `JWT` in local-storage, session, and cookies for client side. but in loca-storage is not safe because there could be `js` attack and `js` can easily access localStorage .
so we can keep JWT in our session or cookies. and also we can add expirery time for JWT.

### How can you invalidate a JWT token

we can invalidate a JWT token by adding expirary time. There is `refresh token` concept to handle the situation of _if jwt expired and you make a request in server_ .

### JWT vs Session

JWT (JSON Web Token) and sessions are both methods for handling user authentication, but they have some key differences in their design and usage:
**JWT process:**
|client|Server|database|
|------|------|-------|
|login (username , password)--->||
||validate user credential --->|
|||<--- credential valid|
||<---issue JWT token||
|API Request (with JWT token)---> |||
||Validation Token (Stateless) {`checking in Server`}||
|`Token Valid<---`|||
||`<---Fetch/Store Data--->`||
|`if Token Invalid`|||
||`<--invalid token response`||

**Session process:**
|client|Server|database|
|------|------|-------|
|login (username , password)--->||
||validate user credential --->|
|||<--- credential valid|
||<---set Session ID Cookie||
|API Request (with Session ID)---> |||
||validate Session ID (Stateful)--->||
|`Token Valid<---`|||
||`<---Fetch/Store Data--->`||
|`if Token Invalid`|||
||`<--invalid token response`||

**JWT:**
JWTs are stateless. Once a JWT is issued, the server does not need to store any session data. The JWT itself contains all the information needed for authentication and is verified using a secret key.A JWT contains all the user information needed for authentication (such as user ID, roles, expiration time) within the token itself. This data is encoded as a JSON object and then signed using a secret key or a public/private key pair.

**Session:**
Sessions are stateful. When a user logs in, the server creates a session and stores session data on the server (usually in memory, a database, or a distributed cache). The server sends a session identifier (session ID) to the client, typically stored in a cookie.All session data is stored on the server, and the session ID is used to retrieve the session data on subsequent requests.

Choosing between JWT and sessions depends on the specific requirements of your application, such as scalability, security, and the architecture of your system.

### How JWT Works in likhalikhi

1. **User Registration/Login:**

   - Users register or log in with their credentials.
   - Upon successful authentication, a JWT is generated and sent to the client.

2. **Token Storage:**

   - The client stores the JWT (typically in localStorage or cookies).

3. **Authenticated Requests:**
   - The client includes the JWT in the Authorization header for subsequent requests to protected endpoints.
   - The server validates the JWT and grants access if the token is valid.

### JWT Setup

1. **Dependencies:**

   - Install the necessary packages:
     ```sh
     npm install jsonwebtoken bcryptjs
     ```

2. **User Model:**
   - Create a User model to handle user data and authentication logic.
3. **Auth Middleware:**

   - Create middleware to protect routes and validate JWTs.

     ```js
     const jwt = require("jsonwebtoken");

     const verifyToken = (req, res, next) => {
       const token = req.header("Authorization").replace("Bearer ", "");

       if (!token) return res.status(401).send("Access Denied");

       try {
         const verified = jwt.verify(token, process.env.JWT_SECRET);
         req.user = verified;
         next();
       } catch (err) {
         res.status(400).send("Invalid Token");
       }
     };

     module.exports = verifyToken;
     ```

4. **Auth Routes:**

   - Set up routes for user registration and login.

5. **Environment Variables:**
   - Add a `.env` file with your JWT secret:
     ```
     JWT_SECRET=your_jwt_secret
     ```

## Database Models

As i am configure my database in `Mongodb` we need `mongoose` for create our models and more easily.

### User model

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      min: [3, "Username must be at least 3, got {VALUE}"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: String,
      required: [true, "Password is required"], //for custom message
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

### Post model

```js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
    },
    createdBy: {
      //who created this post
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
```

Feel free to explore the code and reach out if you have any questions or ideas!
