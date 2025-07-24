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


module.exports = router;