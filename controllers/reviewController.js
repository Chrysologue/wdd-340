const reviewModel = require("../models/reviewModel");

async function addReview(req, res, next) {
  try {
    const { inv_id, review_rating, review_comment } = req.body;
    const account_id = res.locals.accountData.account_id;

    if (!account_id) {
      req.flash("notice", "You must be logged in to post a review.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    await reviewModel.insertReview(inv_id, account_id, review_rating, review_comment);

    req.flash("notice", "Review submitted successfully.");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

module.exports = { addReview };
