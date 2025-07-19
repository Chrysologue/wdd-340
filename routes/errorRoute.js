const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities");

// Route that intentionally throws a 500 error
router.get("/error-test", utilities.handleErrors(errorController.throwError));

module.exports = router;
