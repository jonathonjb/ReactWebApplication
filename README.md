# React + Express webpage

I created this webpage with the goal of gaining a better understanding of React, React Redux, the Express server, and how they all work together.

## Running the application: 

In the package.json file, you can see that there are several different scripts you can use to build and run the project. 

### Running the application in production

To run the application in production, you'll need to create a static react page, which the node server will fetch whenever a user tries to access the page. In order to do that, you'll need to run the `npm run build` command from the terminal. This command will create a completely static page in the *build* directory. 

Once the static pages have been built, you can call the `npm run server` command to start up the server on port 3001. If you're running this on your machine, you'll be able to access this page at *http://localhost:3001/*.

### During development:

During development, you don't want to re-build the entire react web application every time you make a change. So instead of calling build, you can simply call the `npm run dev` command. This will run the *start* and the *server* scripts in package.json simultaneously. 

You'll still be able to view the static web application on PORT: 3001, but you'll also be able to view the non-static react application on PORT: 3000, at *http://localhost:3000/*. The web application will run a bit differently if you do it this way. Instead of having the server on port 3001 fetch the web pages requested by the client, the react server at PORT 3000 will create these pages. Whenever the web application needs to communicate with the server, it will communicate with the proxy server, which is defined on package.json to be at PORT 3001, where the server is. 

## Home Page

You can see what the page looks like below.

![Home](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/Home.png)

## Signing-In / Logging-In

Because I wanted to gain some experience with the passport.js authentication libary, I added these log-in, sign-in pages. These will establish a persistent login session, which means, as long the server is running, the user will stay logged in until they log out of the page.

![Sign-In](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/SignIn.png)

![Logging-In](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/LogIn.png)

## Chat-Page

![Chat page](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/ChatPage.png)

## Chess engine

Because I'm too obsessed with creating the perfect chess engine, I've created yet another engine here (My 4th one of the year)

![Chess Engine](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/ChessStart.png)

![Chess middlegame](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/ChessMiddle.png)

## Polls

![Polls](https://github.com/jonathonjb/ReactWebApplication/blob/master/readmeImages/Polls.png)
