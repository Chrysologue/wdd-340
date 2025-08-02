const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("error", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver management view
 * ************************************ */

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  const firstName = res.locals.accountData.account_firstname;
  req.flash("notice", "You're logged in.");
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    firstName,
    accountData: res.locals.accountData,
  });
}

//Implementing logout route
function logout(req, res) {
  res.clearCookie("jwt");
  //req.flash("notice", "You have been logged out.")
  res.redirect("/");
}

//Rendering update account view
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  res.render("account/update-view", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}

/* *****************************
 * Process account update
 * *************************** */
async function processAccountUpdate(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Re-fetch the updated account
      const updatedAccount = await accountModel.getAccountById(account_id);
      delete updatedAccount.account_password; // Just to be safe

      // Re-sign the JWT with updated data
      const accessToken = jwt.sign(
        updatedAccount,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 3600 * 1000,
        }
      );

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      req.flash("notice", "Account information updated successfully.");
      res.redirect("/account/");
    } else {
      req.flash("error", "Update failed. Please try again.");
      res.redirect("/account/update-view");
    }
  } catch (error) {
    console.error("Update error:", error);
    req.flash("error", "Sorry, an error occurred: " + error.message);
    res.redirect("/account/update-view");
  }
}

/* *****************************
 * Process password update
 * *************************** */
async function processPasswordUpdate(req, res) {
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Password update failed.");
      res.redirect("/account/update-view");
    }
  } catch (error) {
    req.flash("notice", "Sorry, an error occurred: " + error.message);
    res.redirect("/account/update-view");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  logout,
  updateAccount,
  processAccountUpdate,
  processPasswordUpdate,
};
