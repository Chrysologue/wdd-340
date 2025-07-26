const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/************************** 
 * Render each detail of car in inventory
****************************/
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryById(inv_id);
  const vehicle = await utilities.buildDetailView(data)
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    vehicle,
  });
}

/************************** 
 * Deliver management view
****************************/
invCont.showManagementView  = async function(req, res, next)
{
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    nav,
    title: "Vehicle Management",
  })
}

/************************** 
 * Deliver Add Classifictaion view
****************************/
invCont.buildAddClassificationView = async function(req, res, next)
{
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    nav,
    title: "Add Classification",
    errors: null,
  })
}

/* ****************************************
*  Adding the classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body
  const addResult = await invModel.addNewClassification(classification_name)
  if(addResult){
    req.flash("notice", "The new car classification was successfully added")
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      error: null,
    })
  }
  else {
    req.flash("error", "The new car classification could'nt be added")
    let nav = await utilities.getNav()
    res.status(501).render("inventory/add-classification", {
      nav,
      title: "Add Classification",
      error: null,
    })
  }
}

module.exports = invCont