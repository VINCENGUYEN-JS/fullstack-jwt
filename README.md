## Fullstack JWT (Node,GraphQL,React,TS)
* [React.js](https://reactjs.org/)
* [Apollo GraphQL](https://www.apollographql.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/)
* [MySQL](https://www.mysql.com/)
## About The Project
The Ultimate Guide to handling JWTs on frontend clients and server

## JWT Introduction
![image](https://user-images.githubusercontent.com/42936326/166942509-aa4fe809-3a63-4361-9b67-78348ecbc0ea.png)

## Normal workflow with basic token strategy for FE && BE
![image](https://user-images.githubusercontent.com/42936326/166943149-f1e95fc2-4483-4fec-961b-90494aaf1c62.png)

## What is AccessToken and RefreshToken
* AccessToken is used to protect routes on server and hide UI in front-end ( FE doesn't keep it only in app's memories so the hacker would have no way to steal it )
* RefreshToken is used to ask for accesstoken once user log-in , log-out , refresh page ( keep user consitency )


## FE flows
* User sends credential via login or register
* Get a pairs of token (access token && refresh token).Access token is stored in app memories , refresh token is stored in cookie
* Send requests to protected routes with access token if the access token is not expired
* FE has to calculate the access token to see if the token is expired and if so , send refresh token to http://localhost:4000/refresh_token ( ask for a new pair of AT & RT )
* Implement logout feature , delete refresh token if user log-out , and don't automatically ask for refresh token if the users already logged out

## BE flows
* Return to client if user has successfully login or register a pair of token ( AT in payload , and RT in cookie shape )
* Protected routes with AT
* Implement a API endpoint( refresh_token ) for client to return a pair of token (AT,RT) 
* Implement logout endpoint for clients (clear RT (cookies) for clients ) because its a cookie the only way to delete it is we have to do it by server response , and implement a tokenVersion attribute for our user data in DB , in-case user still keeps their cookie and ask for AT again 

## Acknowledgments
Inspired by https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
