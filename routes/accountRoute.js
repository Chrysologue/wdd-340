const express = require("express");
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const router = express.Router();

//Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post("/register", utilities.handleErrors(accountController.registerAccount))


module.exports = router;