// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities")
const classValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by detail
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//Route to build management view
router.get("/", utilities.handleErrors(invController.showManagementView));

//Route to build add classification view
router.get("/classification", utilities.handleErrors(invController.buildAddClassificationView));

//Process the adding of inventory
router.post("/classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification))


module.exports = router;
