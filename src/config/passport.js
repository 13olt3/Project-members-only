const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

session({
  store: new pgSession({
    pool: pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
});

module.export = session;
