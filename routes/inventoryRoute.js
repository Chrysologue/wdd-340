// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by detail
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//Route to build management view
router.get("/", utilities.handleErrors(invController.showManagementView));

//Route to build add classification view
router.get("/classification", utilities.handleErrors(invController.buildAddClassificationView));

//Route to build add Inventory view
router.get("/inventory", utilities.handleErrors(invController.buildAddInventoryView));

router.post("/inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

//Process the adding of inventory
router.post("/classification",
    validate.classificationRules(),
    validate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to present editing inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditingInventoryView))

//Route to handle update post
router.post("/update/", utilities.handleErrors(invController.updateInventory))


//Route to render delete view

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventoryView))

router.post("/delete", utilities.handleErrors(invController.deleteInventory))


module.exports = router;
