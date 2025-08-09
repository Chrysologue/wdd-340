const pool = require("../database/index")

// Insert a new review into the database
async function insertReview(inv_id, account_id, review_rating, review_comment) {
  try {
    const sql = `
      INSERT INTO public.reviews (
        inv_id, account_id, review_rating, review_comment
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(sql, [
      inv_id,
      account_id,
      review_rating,
      review_comment,
    ]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Get all reviews for a specific vehicle, including reviewer names
async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id,
             r.review_rating,
             r.review_comment,
             r.review_date,
             a.account_firstname,
             a.account_lastname
      FROM public.reviews r
      JOIN public.account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC;
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  insertReview,
  getReviewsByVehicleId,
};
