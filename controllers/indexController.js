const { body, validationResult, matchedData } = require("express-validator");
const dbQuery = require("../db/queries");
const errorMsg = require("../public/error");

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${errorMsg.alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${errorMsg.lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${errorMsg.alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${errorMsg.lengthErr}`),
  body("userEmail")
    .trim()
    .isEmail()
    .withMessage(`Email is: ${errorMsg.emailErr}`),
];

const links = [
  { href: "/", text: "Home" },
  { href: "/signup", text: "Sign-up" },
  { href: "/login", text: "Login" },
];

function indexPage(req, res) {
  res.render("index", {
    title: "Index Page",
    links: links,
  });
}

function signupPage(req, res) {
  res.render("signup", {
    title: "Signup Page",
    links: links,
  });
}

function loginPage(req, res) {
  res.render("login", {
    title: "Login Page",
    links: links,
  });
}
function createNewUser(req, res) {
  const userData = {
    userEmail: req.body.userEmail,
    password: req.body.password,
    confirmPw: req.body.confirmPw,
  };
}

const createUser = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        title: "sign-up",
        links: links,
        errors: errors.array(),
      });
    }
    const { firstName, lastName } = matchedData(req);
    console.log({ firstName, lastName });
    res.redirect("/");
  },
];

module.exports = {
  indexPage,
  signupPage,
  loginPage,
  createNewUser,
  createUser,
};
