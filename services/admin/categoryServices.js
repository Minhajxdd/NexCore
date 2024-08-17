

// Importing Schemas
import categoryModel from '../../models/categorySchema.js';


export async function createCategory(body){

    try{
        await categoryModel.create({
            name: body.name,
            description: body.description,  
        })
    }catch(err){
        console.error(`Error while creating a category on createCategory on categoryServices ${err.message}`);
    }
     console.log(`Category created succesfully`)
}


export async function getCategory(){
    try{
        const data = await categoryModel.find();
        return data;
    }catch(err){
        console.log(`error while fetching all the category data on getCategory on categoryServices ${err.message}`);
        return false
    }
}