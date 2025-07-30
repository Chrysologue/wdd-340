const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/**************************
 * Render each detail of car in inventory
 ****************************/
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryById(inv_id);
  const vehicle = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    vehicle,
  });
};

/**************************
 * Deliver management view
 ****************************/
invCont.showManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    nav,
    classificationSelect,
    title: "Vehicle Management",
  });
};

/**************************
 * Deliver Add Classifictaion view
 ****************************/
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    nav,
    title: "Add Classification",
    errors: null,
  });
};

/* ****************************************
 *  Adding the classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addResult = await invModel.addNewClassification(classification_name);
  if (addResult) {
    req.flash("notice", "The new car classification was successfully added");
    let nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      error: null,
    });
  } else {
    req.flash("error", "The new car classification could'nt be added");
    let nav = await utilities.getNav();
    res.status(501).render("inventory/add-classification", {
      nav,
      title: "Add Classification",
      error: null,
    });
  }
};

/**************************
 * Deliver Add inventory view
 ****************************/

invCont.buildAddInventoryView = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationSelect,
    errors: null,
  });
};

invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList(
    parseInt(req.body.classification_id)
  );

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const addResult = await invModel.addNewVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  );

  if (addResult) {
    req.flash("notice", "New vehicle successfully added.");
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      error: null,
    })
  } else {
    req.flash("error", "Failed to add vehicle.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationSelect,
      errors: null,
      ...req.body, // sticky form values
    });
  }
};


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont;
