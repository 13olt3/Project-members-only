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
    .withMessage(`Email is ${errorMsg.emailErr}`),
  body("password").isLength({ min: 1 }),
  body("confirmPw")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

const validateMessage = [body("newMessage").trim()];

const verifyStatus = [
  body("question")
    .custom((value) => value === "2")
    .withMessage("Incorrect answer, try again if you want to become a member."),
];

async function indexPage(req, res) {
  const messages = await dbQuery.getAllMessages();

  res.render("index", {
    title: "Index Page",
    user: req.user,
    messages: messages,
  });
}

function signupPage(req, res) {
  res.render("signup", {
    title: "Signup Page",
  });
}

function loginPage(req, res) {
  res.render("login", {
    title: "Login Page",
  });
}

const createUser = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    const isAdmin = req.body.isAdmin === "on";

    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        title: "sign-up",

        errors: errors.array(),
      });
    }
    const { userEmail, firstName, lastName, password } = matchedData(req);

    dbQuery.createNewUser(userEmail, firstName, lastName, password, isAdmin);
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
    user: req.user,
    errors: errors,
  });
}

const verifyMember = [
  verifyStatus,
  (req, res) => {
    const errors = validationResult(req);
    if (errors.array().length === 0) {
      dbQuery.updateMemberStatus(req.user.id);
    }
    // console.log(req.user.id);
    req.session.errors = errors.array();
    //appending errors to session which can be accessed in the profile GET
    res.redirect("/profile");
  },
];

function newMessage(req, res) {
  res.render("createMessage", { title: "Create New Message" });
}

const createMessage = [
  validateMessage,
  (req, res) => {
    const { newMessage } = matchedData(req);
    const messageData = [req.user.id, newMessage, req.user.member_status];
    dbQuery.createNewMessage(messageData);
    res.redirect("/");
  },
];

async function getAllMessages(req, res) {
  const results = await dbQuery.getAllMessages();
}

async function deleteMessage(req, res) {
  await dbQuery.deleteMessage(req.params.id);
  res.redirect("/");
}

module.exports = {
  indexPage,
  signupPage,
  loginPage,
  createUser,
  loginUser,
  logout,
  profile,
  verifyMember,
  newMessage,
  createMessage,
  getAllMessages,
  deleteMessage,
};
