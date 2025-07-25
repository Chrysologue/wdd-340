const invModel = require("../models/inventory-model");
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


module.exports = Util;
