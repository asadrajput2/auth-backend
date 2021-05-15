This is a simple app built to demonstrate the use of token-based authentication. It is built using NodeJS and Express

# Tech used and their purpose

1. Node (for backend)
2. Express (for building the APIs)
3. Postgres as the database
4. JWT for tokens
5. Redis for storing all active tokens.

Since JWTs are stateless, we do not have any control over them and they cannot be revoked naturally. This presents a problem for some scenarios e.g. when we want to log the user out from all devices and make sure that the active tokens cannot be used again. This is why we need to store the active tokens. In this implementation, we are storing the tokens in Redis and revoking them whenever we need. The downside to this, though, is that we need to check whether the token exists in out cache or not for every request. Storing tokens in redis cache allows us to do this while also keeping the quering speeds fast.

It has the following auth features:

1. log in
2. signup
3. signup/login with GitHub
4. change password
5. log out
6. view posts
7. add posts

The user can now log in from multiple devices and log out from one device only without affecting other devices. When password is changed, user gets logged out from all the devices.

To demonstrate the auth system I have created a post viewing and publishing system. All posts can be viewed publically but to add a post the user needs to be authenticated (either with email signup/login or with GitHub).

# If you want to run this repo on your system

1. Clone the repo
   `git clone <the repo url in the address bar>`
2. Install all the dependencies
   `npm i`
3. Set up the environment variables needed
   `.example-env` file contains the name for all the required keys
4. Run this command:
   `npm run watch:dev`
   This will transpile all the code and place in `src` folder and then start a server at port `8080`. For localhost it will be accessible at `http://localhost:8080`
