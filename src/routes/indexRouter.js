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
indexRouter.get("/profile", indexController.profile);

indexRouter.post("/signup", indexController.createUser);
indexRouter.post("/login", indexController.loginUser);
indexRouter.post("/becomeMember", indexController.verifyMember);

module.exports = indexRouter;
