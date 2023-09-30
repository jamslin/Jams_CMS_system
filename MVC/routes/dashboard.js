const express = require("express");
const router = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const CommonModel = require("../models/allData");

// Define the authentication middleware function
router.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
router.use(
  session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: true,
  })
);
const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    console.log("passed");
    // User is authenticated, continue to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    console.log("failed");
    res.redirect("/dashboard/login");
  }
};

// Use the authentication middleware for routes that require authentication
router.get("/", authenticateUser, async (req, res) => {
  // Render the dashboard page for authenticated users
  let data;
  try {
    data = await CommonModel.find();
  } catch {
    console.log("failed to get data");
  }

  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user,
    collection: data,
  });
});

router
  .route("/updateDB")
  .post(async (req, res) => {
    console.log(req.body);
    const responseData = { message: req.body };
    res.json(responseData);
  })
  .get(async (req, res) => {
    console.log(req.query.field);
    const responseData = { message: req.query.field };
    res.json(responseData);
  });

router
  .route("/login")
  .get((req, res) => {
    res.render("dashboard/login", { title: "Login", error: null });
  })
  .post(async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        console.log("1");
        return res.render("dashboard/login", {
          title: "Login",
          error: "Invalid username or password.",
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        console.log("2");
        return res.render("dashboard/login", {
          title: "Login",
          error: "Invalid username or password.",
        });
      }

      req.session.user = { id: user._id, username: user.username };
      console.log(user);
      res.redirect("/dashboard"); // Redirect to the authenticated user's dashboard
    } catch (error) {
      console.log("4");
      res.render("dashboard/login", {
        title: "Login",
        error: "Error logging in. Please try again.",
      });
    }
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("dashboard/register", { title: "register", error: null });
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      console.log(req.body);
      if (existingUser) {
        return res.render("dashboard/register", {
          title: "register",
          error: "Username or email already exists.",
        });
      }

      const newUser = new User({ username, email, password });
      await newUser.save();
      res.redirect("/dashboard/login");
    } catch (error) {
      res.render("dashboard/register", {
        title: "register",
        error: "Error registering user. Please try again.",
      });
    }
  });

router.route("/logout").get((req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    res.redirect("/dashboard/login");
  });
});

module.exports = router;
