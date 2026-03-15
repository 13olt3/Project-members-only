const { Router } = require("express");
const indexController = require("../controllers/indexController");

const links = [
  { href: "/", text: "Home" },
  { href: "/signup", text: "Sign-up" },
  { href: "/login", text: "Login" },
];

const indexRouter = Router();

indexRouter.get("/", indexController.indexPage);
indexRouter.get("/signup", indexController.signupPage);
indexRouter.get("/login", indexController.loginPage);
indexRouter.get("/logout", indexController.logout);

indexRouter.post("/signup", indexController.createUser);
indexRouter.post("/login", indexController.loginUser);

module.exports = indexRouter;
