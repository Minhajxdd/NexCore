import multer from 'multer';

// Importing Schemas
import categoryModel from '../../models/categorySchema.js';
import productModel from '../../models/productSchems.js';

export async function getCategoryDetails(){
    try{
        const data = await categoryModel.find({}, `name _id`);
        return data;
 
    }catch(err){
        console.log(`error while category details on getCategoryDetails on productServices ${err.message}`);
    }
}



// Multer
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/products/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

export const upload = multer({ storage: Storage });
// Multer 

// Create Product
export async function createProduct(body, id, files){
    const fileNames =  files.map((val) => val.filename);

    const product = {
        name: body.name,
        description: body.description,
        category: id,
        images: fileNames,
        original_price: body.og_price,
        discounted_price: body.ds_price,
        stock: body.stock,
        category_name: body.category
    }

    if(body.size){
        product.size_field = body.size;
    }
    if(body.size_values){
        const arr = body.size_values.split(',');
            if(arr.length !== 0){
                product.size_options = arr;
            }
    }


    try{
        const newDocument = await productModel.create(product);

        await categoryModel.updateOne(
            {_id: id},
            {$push: {
                products_id : newDocument._id
            }}
        )    

    }catch(err){
        console.log(`error while creating or updating category or product at createProduct at productServices ${err.message}`);
    }

}


export async function getProducts(){
    try{
        const data = await productModel.find();
        return data;
    }catch(err){
        console.log(`error while fetching product detail's on productServices ${err.message}`);
    }
}

export async function updateDeletedProduct(id){
    try {
        const data = await productModel.findById(id);
    
        if (data) {
          data.isDeleted = !data.isDeleted;

          const updatedUser = await data.save();
        } else {
          console.log("Category not found");
        }
      } catch (error) {
        console.error("Error updating isDeleted category on updateDeleted on categoryServices:", error.message);
      }
}