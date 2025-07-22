const express = require("express");
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const router = express.Router();

router.get("/login", utilities.handleErrors(accountController.buildLogin));



module.exports = router;