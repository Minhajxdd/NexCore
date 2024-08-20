import multer from 'multer';

// Importing Schemas
import categoryModel from '../../models/categorySchema.js';


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
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

export const upload = multer({ storage: Storage });

