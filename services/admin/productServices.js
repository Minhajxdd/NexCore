// Importing Core Modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importing extenal dependencies
import multer from "multer";

// Importing Schemas
import categoryModel from "../../models/categorySchema.js";
import productModel from "../../models/productSchema.js";

export async function getCategoryDetails() {
  try {
    const data = await categoryModel.find({}, `name _id`);
    return data;
  } catch (err) {
    console.log(
      `error while category details on getCategoryDetails on productServices ${err.message}`
    );
  }
}

// Multer
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/products/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: Storage });
// Multer

// Create Product
export async function createProduct(body, id, files) {
  const fileNames = files.map((val) => val.filename);

  const product = {
    name: body.name,
    description: body.description,
    category: id,
    images: fileNames,
    original_price: body.og_price,
    discounted_price: body.ds_price,
    stock: body.stock,
    category_name: body.category,
  };

  if (body.size) {
    product.size_field = body.size;
  }
  if (body.size_values) {
    const arr = body.size_values.split(",");
    if (arr.length !== 0) {
      product.size_options = arr;
    }
  }

  try {
    const newDocument = await productModel.create(product);

    await categoryModel.updateOne(
      { _id: id },
      {
        $push: {
          products_id: newDocument._id,
        },
      }
    );

    return newDocument;
  } catch (err) {
    console.log(
      `error while creating or updating category or product at createProduct at productServices ${err.message}`
    );
  }
}


export async function editProduct(data, files) {
  try {

    let fileNames;
    if(files) {
      fileNames = files.map((val) => val.filename);

      deleteImagesFromDatabase(data.productId); 
    }

    newCategoryName = null;

    if (data.oldCategoryId != data.categoryId) {
      if (data.oldCategoryId) {
        await categoryModel.findByIdAndUpdate(data.oldCategoryId, {
          $pull: { products_id: data.productId },
        });
      }

      var { name: newCategoryName } = await categoryModel.findByIdAndUpdate(
        data.categoryId,
        {
          $addToSet: { products_id: data.productId },
        }
      );
    }

    const updateOptions = {
      name: data.name,
      description: data.description,
      category: data.categoryId,
      original_price: data.og_price,
      discounted_price: data.ds_price,
      stock: data.stock,
    };

    if(fileNames) {
      updateOptions.images = fileNames;
    }

    if (newCategoryName) {
      updateOptions.category_name = newCategoryName;
    }

    const newData = await productModel.findByIdAndUpdate(
      data.productId,
      { $set: updateOptions },
      { new: true }
    );

    return newData;
  } catch (err) {
    console.log(`error while editing product : ${err.message}`);
    return null;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



async function deleteImagesFromDatabase(productId) {
  try {
    // Retrieve the document from MongoDB (modify query to suit your requirements)
    const document = await productModel.findById(productId, { images: 1, _id: 0 }).lean();

    if (document && document.images && document.images.length > 0) {
      const imageNames = document.images;

      imageNames.forEach(imageName => { 
        // Construct the file path (assuming files are in a 'uploads/products/' folder)
        const filePath = path.join(__dirname, '../../public/uploads/products', imageName);

        // Check if the file exists before attempting to delete it
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            // If file exists, delete it
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`Error deleting file: ${imageName}`, unlinkErr);
              } else {
                console.log(`Successfully deleted: ${imageName}`);
              }
            });
          } else {
            console.error(`File not found: ${imageName}`);
          }
        });
      });
    } else {
      console.log('No images to delete.');
    }
  } catch (err) {
    console.error('Error retrieving or deleting images:', err);
  }
}








export async function getProducts() {
  try {
    const data = await productModel.find();
    return data;
  } catch (err) {
    console.log(
      `error while fetching product detail's on productServices ${err.message}`
    );
  }
}




















export async function updateDeletedProduct(id) {
  try {
    const data = await productModel.findById(id);

    if (data) {
      data.isDeleted = !data.isDeleted;

      const updatedUser = await data.save();
    } else {
      console.log("Category not found");
    }
  } catch (error) {
    console.error(
      "Error updating isDeleted category on updateDeleted on categoryServices:",
      error.message
    );
  }
}

export async function updateProductStock(id, val) {
  const num = val;
  try {
    await productModel.findByIdAndUpdate(id, {
      $inc: {
        stock: num,
      },
    });
  } catch (err) {
    console.log(`error while incrementing product stock: ${err.message}`);
  }
}

export async function oneProductDetails(id) {
  try {
    const data = await productModel.findById(id);
    return data;
  } catch (err) {
    console.log(`error while fetching product using id: ${err.message}`);
  }
}

