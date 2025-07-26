const utilities = require("../utilities/index");
const {body, validationResult} = require("express-validator");


const classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Classification name is required")
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification name must contains only letters")
    ]
}

const checkClassificationData = async function (req, res, next){
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            title: "Add Classification",
            errors,
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = {classificationRules, checkClassificationData}