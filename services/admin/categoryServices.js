

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

export async function updateDeleted(id){
    try {
        const data = await categoryModel.findById(id);
    
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

export async function editCategory(data){
    try{
        await categoryModel.findByIdAndUpdate(data.id ,{
            name: data.name,
            description: data.description
        })
    }catch(err){
        console.log(`Error while editing category on category editCategory on CategoryServices`, err.message);
    }
}