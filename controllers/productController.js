// Importing models
import reviewModel from "../models/reviewsSchema.js";
import productModel from "../models/productSchema.js";
import userModel from "../models/userSchema.js";

// Router to add or edit review
export async function reviewApi(req, res) {
  req.body.comment = req.body.review.trim();
  delete req.body.review;

  const userId = req.session.userId || req.session.passport.user;

  if (await addOrUpdateReview(userId, req.body)) {
    return res.json({
      status: `Success`,
      message: `successfully inserted review`,
    });
  } else {
    return res.json({
      status: "Failed",
      message: `Failed the create or edit a review`,
    });
  }
}
// Router to add or edit review

// Function to create or edit review
const addOrUpdateReview = async (userId, data) => {
  try {
    const { full_name: userName } = await userModel
      .findOne({ _id: userId }, { full_name: 1, _id: 0 })
      .lean();

    if (!userName) {
      return false;
    }

    const review = await reviewModel
      .findOne({
        product_id: data.productId,
        "reviews.user_id": userId,
      })
      .lean();

    if (review) {
      await reviewModel.updateOne(
        { product_id: data.productId, "reviews.user_id": userId },
        {
          $set: {
            "reviews.$.rating": data.rating,
            "reviews.$.comment": data.comment,
            "reviews.$.updated_at": new Date(),
          },
        }
      );
    } else {
      await reviewModel.updateOne(
        { product_id: data.productId },
        {
          $addToSet: {
            reviews: {
              user_id: userId,
              username: userName,
              rating: data.rating,
              comment: data.comment,
              created_at: new Date(),
            },
          },
        },
        {
          upsert: true,
        }
      );
    }
    return true;
  } catch (error) {
    console.error("Error adding/updating review:", error.message);
    return false;
  }
};
// Function to create or edit review

// Get revew filter api
export async function reviewFilterApi(req, res) {
  try {
    if (!req.query.productId) {
      return res.json({
        status: "Failed",
        message: "No product id found",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = {
      product_id: req.query.productId,
    };

    const result = {};

    result.data = await reviewModel
      .find(query)
      .sort({ 'reviews.created_at': 1 })
      .select({ reviews: { $slice: [startIndex, limit] } })

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    if (result.data.length === limit) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    result.status = "Success";
    res.json({ result });
  } catch (err) {
    console.log(`error while fetching and filtering reivew: ${err.message}`);
    res.json({
      status: "Failed",
      message: "A Error Occured!!",
    });
  }
}
// Get revew filter api

export async function getReviewForm(req, res) {
  const userId = req.session.userId || req.session.passport.user;

  if (!req.body.productId) {
    return res.json({
      status: "Failed",
      message: "no product id found",
    });
  }

  try {
    const result = await reviewModel.findOne(
      { product_id: req.body.productId, "reviews.user_id": userId },
      { "reviews.$": 1 }
    );

    if (result) {
      return res.json({
        status: `Success`,
        message: "Successfully fetched data",
        result,
      });
    }

    return res.json({
      status: "Failed",
      message: `not data found!`,
    });
  } catch (err) {
    console.log(`error while fecthin use reivew: ${err.message}`);
    return res.json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
}

export async function deleteReview(req, res) {
  const userId = req.session.userId || req.session.passport.user;

  if (!req.body.productId) {
    return res.json({
      status: "Failed",
      message: "no product id found",
    });
  }

  try {

    await reviewModel.updateOne(
      { product_id: req.body.productId },
      { $pull: { reviews: { user_id: userId } } }
      
    )

    return res.json({
      status: 'Success',
      message: 'successfully deleete review'
    })
  } catch (err) {
    console.log(`error while deleting review: ${err.message}`);
    return res.json({
      status: "Failed",
      message: "something went wrong",
    });
  }
}
