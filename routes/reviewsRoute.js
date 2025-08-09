const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const reviewController = require("../controllers/reviewController");


router.post("/", utilities.checkJWTToken, utilities.handleErrors(reviewController.addReview));

module.exports = router;
