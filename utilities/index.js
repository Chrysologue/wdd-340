const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `
        <li>
            <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>
        </li>
    `;
    // list += "<li>";
    // list +=
    //   '<a href="/inv/type/' +
    //   row.classification_id +
    //   '" title="See our inventory of ' +
    //   row.classification_name +
    //   ' vehicles">' +
    //   row.classification_name +
    //   "</a>";
    // list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/*
 ****************************************
 *Build vehicle details view
 ***************************************/

Util.buildDetailView = async function (vehicle) {
  let detail ="";

  if (!vehicle) {
    detail += `<p class="notice">Vehicle details not found.</p>`;
  } else {
    detail += `
    <section class="vehicle-detail">
    <div class="specific-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="full-detail">
        <h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>
        <ul>
          <li><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</li>
           <li><strong>Description:</strong> ${vehicle.inv_description}</li>
          <li><strong>Color:</strong> ${vehicle.inv_color}</li>
          <li><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</li>
        </ul>
      </div>
    </div>
  </section>`;
  }
  return detail;
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = `
    <select name="classification_id" id="classificationList" required>
      <option value="" selected disabled>Choose a Classification</option>
      ${data.rows.map(row => `
        <option value="${row.classification_id}"${classification_id != null && row.classification_id == classification_id ? " selected" : ""}>
          ${row.classification_name}
        </option>`).join('')}
    </select>
  `;
  return classificationList;
};


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.firstName = accountData.account_firstname
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  res.locals.loggedin = 0
  next()
 }
}


/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 /******************************************************************* */
 /* ****************************************
 *  Check if user has proper permissions
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData

  if (!accountData) {
    req.flash("notice", "You must be logged in to access that page.")
    return res.redirect("/account/login")
  }

  if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
    next()
  } else {
    req.flash("notice", "You do not have permission to access that page.")
    return res.redirect("/account/login")
  }
}


module.exports = Util;
