// Importing Models
import productModel from "../../models/productSchema.js";
import offerModel from '../../models/offerSchema.js';


export async function getProducts(catId) {
  try {
    const products = await productModel.find().limit(6);
    return products;
  } catch (err) {
    console.log(
      `error while fetching data getProducts on homeServices ${err.message}`
    );
  }
}

export async function getProductDetails(id) {
  try {
    const product = await productModel.findById(id);
    return product;
  } catch (err) {
    console.log(
      `error while fetching product data at homeServices ${err.message}`
    );
  }
}

// Check for product offers
export async function checkOffers(productId, categoryId) {
  try {
      const [data] = await offerModel
        .find(
          {
            $or: [
              {
                offer_type: "Products",
                offer_available: { $in: productId },
                isDeleted: false,
              },
              {
                offer_type: "Category",
                offer_available: { $in: categoryId },
                isDeleted: false,
              },
            ],
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

        return data;
   
  } catch (err) {
    console.log(`error while fetching offers : ${err.message}`);
  }
}
// Check for product offers