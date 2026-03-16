const { body, validationResult, matchedData } = require("express-validator");
const dbQuery = require("../db/queries");
const errorMsg = require("../public/error");
const passport = require("passport");

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
  body("password").isLength({ min: 1 }),
  body("confirmPw")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

const verifyStatus = [
  body("question")
    .custom((value) => value === "2")
    .withMessage("Incorrect answer, try again if you want to become a member."),
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
    user: req.user,
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
    const { userEmail, firstName, lastName, password } = matchedData(req);

    dbQuery.createNewUser(userEmail, firstName, lastName, password);
    res.redirect("/");
  },
];

const loginUser2 = [
  (res, req, next) =>
    passport.authenticate("local", {
      failureRedirect: "/",
      failureMessage: true,
    })(req, res, next),
];

const loginUser = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

function profile(req, res) {
  const errors = req.session.errors || [];
  req.session.errors = null;
  res.render("profile", {
    title: "Profile Page",
    links: [{ href: "/", text: "Home" }],
    user: req.user,
    errors: errors,
  });
}

const verifyMember = [
  verifyStatus,
  (req, res) => {
    const errors = validationResult(req);
    if (errors.array().length !== 0) {
      console.log("errors exist");
      console.log(errors);
    } else {
      console.log("no errors");
    }
    req.session.errors = errors.array();
    //appending errors to session which can be accessed in the profile GET
    res.redirect("/profile");
  },
];
module.exports = {
  indexPage,
  signupPage,
  loginPage,
  createNewUser,
  createUser,
  loginUser,
  logout,
  profile,
  verifyMember,
};
