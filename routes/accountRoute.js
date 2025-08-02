const express = require("express");
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const router = express.Router();

//Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));


//router.post("/register", utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


//New default route for account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

//Process logout
router.get("/logout", utilities.handleErrors(accountController.logout))


//Route to deliver update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.updateAccount))


// Update Account Info
router.post("/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  accountController.processAccountUpdate
)

// Update Password
router.post("/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  accountController.processPasswordUpdate
)


module.exports = router;