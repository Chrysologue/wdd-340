const utilities = require("../utilities/index");
const { body, validationResult } = require("express-validator");

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Classification name is required")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contains only letters"),
  ];
};

const checkClassificationData = async function (req, res, next) {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      errors,
      nav,
      classification_name,
    });
    return;
  }
  next();
};

//Sanitizing and validating inventory
const inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .matches(/^[A-Za-z0-9\s\-]{3,}$/)
      .withMessage(
        "Make must be at least 3 characters (letters, numbers, spaces, hyphens)."
      ),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .matches(/^[A-Za-z0-9\s\-]{3,}$/)
      .withMessage(
        "Model must be at least 3 characters (letters, numbers, spaces, hyphens)."
      ),
    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Valid year required."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
    body("inv_image").trim().notEmpty().withMessage("Image path required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Valid price required."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Valid mileage required."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ];
};

const checkInventoryData = async function (req, res, next) {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList(
    req.body.classification_id
  );

  if (!errors.isEmpty()) {
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationSelect,
      errors,
      ...req.body,
    });
    return;
  }
  next();
};

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
};
