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


// Build HTML for reviews list for a vehicle
Util.buildReviewsList = async function (reviews) {
  if (!reviews || reviews.length === 0) {
    return `<p class="noReview">No reviews yet. Be the first to review!</p>`;
  }

  let reviewList = `<section class="reviews-section"><h3>Customer Reviews</h3><ul class="reviews-list">`;

  reviews.forEach((review) => {
    const date = new Date(review.review_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    reviewList += `
      <li class="review-item">
        <div><strong>Rating:</strong> ${"⭐".repeat(review.review_rating)} (${review.review_rating}/5)</div>
        <div><strong>Comment:</strong> ${review.review_comment}</div>
        <div class="review-date"><em>Posted on ${date}</em></div>
      </li>
    `;
  });

  reviewList += "</ul></section>";
  return reviewList;
};

//  Build review submission form or login prompt
Util.buildReviewForm = async function (inv_id, loggedIn) {
  if (!loggedIn) {
    return `<p class="requiredLogin">Please <a href="/account/login">log in</a> to submit a review.</p>`;
  }

  return `
    <section class="review-form">
      <h3>Submit Your Review</h3>
      <form action="/reviews" method="POST">
        <input type="hidden" name="inv_id" value="${inv_id}">
        <label for="review_rating">Rating (1-5):</label>
        <select name="review_rating" id="review_rating" required>
          <option value="" disabled selected>Select rating</option>
          ${[1, 2, 3, 4, 5]
            .map((n) => `<option value="${n}">${n}</option>`)
            .join("")}
        </select><br>
        <label for="review_comment">Comment:</label><br>
        <textarea name="review_comment" id="review_comment" rows="4" required></textarea><br>
        <button type="submit">Submit Review</button>
      </form>
    </section>
  `;
};


module.exports = Util;
