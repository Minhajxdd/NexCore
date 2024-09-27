// Importing Models
import productModel from "../models/productSchema.js";
import categoryModel from "../models/categorySchema.js";
import offerModel from "../models/offerSchema.js";

export async function searchGet(req, res) {
  const searchQuery = req.query.search;

  try {
    const categories = await categoryModel.find({}, { name: 1 });

    res.render("pages/user/search", {
      categories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "failed",
      message: "An error occurred during the search.",
    });
  }
}

export async function searchApi(req, res) {
  const searchQuery = req.query.search;

  const categories = req.body.categories;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  const lowToHigh = req.query.LtH || null;
  const minPrice = parseFloat(req.query.minp) || null;
  const maxPrice = parseFloat(req.query.maxp) || null;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const query = {
    $and: [
      { isDeleted: { $ne: true } },
      {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { category_name: { $regex: searchQuery, $options: "i" } },
        ],
      },
    ],
  };

  if (categories && categories.length > 0) {
    query.$and.push({ category_name: { $in: categories } });
  }

  if (minPrice !== null && maxPrice !== null) {
    query.discounted_price = { $gte: minPrice, $lte: maxPrice };
  }

  const sortOptions =
    lowToHigh == 1
      ? { discounted_price: 1 }
      : lowToHigh == 2
      ? { discounted_price: -1 }
      : {};

  const results = {};

  try {
    results.results = await productModel
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sortOptions)
      .lean();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred during the search.",
    });
  }

  if (results.results.length === limit) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  for (const result of results.results) {
    const [data] = await offerModel.find(
      {
        '$or': [
          {
            offer_type: 'Products',
            offer_available: { $in: result._id },
            isDeleted: false
          },
          {
            offer_type: 'Category',
            offer_available: { $in: result.category },
            isDeleted: false
          }
        ]
      },
      {
        exp_date: 0,
        isDeleted: 0,
        createdAt: 0,
        updatedAt: 0,
        offer_available: 0,
        offer_type: 0,
      }
    )
    .sort({ discount_percentage: -1 })
    .limit(1);
    
    if (data) {
      result.offer = data;
    }
  }
  
  results.status = "success";
  res.json({ result: results });

}
