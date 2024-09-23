// Importing Model
import productModel from "../../models/productSchema.js";
import categoryModel from "../../models/categorySchema.js";

export async function offerGetType(type) {
  try {
    if (type === "Category") {
      const data = await categoryModel.find(
        {},
        {
          name: 1,
        }
      );

      return data;
    } else if (type === "Products") {
      const data = await productModel.find(
        {},
        {
          name: 1,
        }
      );

      return data;
    }
  } catch (err) {
    console.log(`error while fetching type data: ${err.message}`);
    return false;
  }
}
