// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESS_SECRET,
    // resave: true,
    // saveUninitialized: false,
    cookie: {
      // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // secure: process.env.NODE_ENV === "production",
      // httpOnly: true,
      maxAge: 60000, // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://127.0.0.1/lab-express-basic-auth",
    }),
  })
);

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// SESSIONS

module.exports = app;
