import lodash from 'lodash';


// Importing Models
import productModel from '../models/productSchems.js';
import categoryModel from '../models/categorySchema.js';


export async function categoryGet(req, res){
    let categoryName = req.params.name;
    categoryName = categoryName.replace(/-/g, " ");
    let products = '';

    try{

        const categoryData = await categoryModel.findOne(
            { name: { $regex: categoryName, $options: 'i' } }
        )

        if(!categoryData){
            return res.redirect('/not-found');
        }

        products = await productModel.find({ _id: { $in: categoryData.products_id}}).limit(3);

        
    }catch(err){
        console.log(`Error while fetching data from db on categoryGet on categoryController ${err.message}`);
    }

    categoryName = lodash.capitalize(categoryName);

    res.render('pages/user/category',{
        TITLE: categoryName,
        products
    });
}




export async function categoryPagenation(req, res){
    
    let categoryName = req.params.name;
    categoryName = categoryName.replace(/-/g, " ");

    const categoryData = await categoryModel.findOne(
        { name: { $regex: categoryName, $options: 'i' } }
    )


    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {}

    
    results.results = await productModel.find({ _id: { $in: categoryData.products_id}}).skip(startIndex).limit(limit);

    if(endIndex < results.results.length){
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if(startIndex > 0 ){
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    res.json(results);
}
