// Importing Model
import productModel from "../../models/productSchema.js";
import categoryModel from "../../models/categorySchema.js";


export async function offerGetType(type){
    try{
        if(type === "category"){
            const data = await categoryModel.find({},
                {
                    name: 1
                }
            )
            console.log(data)
            return data;
        }else if(type === 'products'){
            const data = await productModel.find({},
                {
                    name: 1
                }
            )
            console.log(data)
            return data;
        }

    }catch(err){
        console.log(`error while fetching type data: ${err.message}`);
        return false;
    }
}