import lodash from 'lodash';


// Importing Models
import productModel from '../models/productSchema.js';
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

        
    }catch(err){
        console.log(`Error while fetching data from db on categoryGet on categoryController ${err.message}`);
    }

    categoryName = lodash.capitalize(categoryName);

    res.render('pages/user/category',{
        TITLE: categoryName,
    });
}




export async function categoryFilter(req, res){
    
    let categoryName = req.params.name;
    categoryName = categoryName.replace(/-/g, " ");
    const lowToHigh = req.query.LtH || null;
    const minPrice = parseFloat(req.query.minp) || null;
    const maxPrice = parseFloat(req.query.maxp) || null;
    

    const categoryData = await categoryModel.findOne(
        { name: { $regex: categoryName, $options: 'i' } }
    )


    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {}

    const query = { _id: { $in: categoryData.products_id } };

    if (minPrice !== null && maxPrice !== null) {
        query.discounted_price = { $gte: minPrice, $lte: maxPrice };
    }


    const sortOptions = lowToHigh == 1 ? { discounted_price: 1 } :
                        lowToHigh == 2 ? { discounted_price: -1} :
                        {};

    try{
        results.results = await productModel
        .find(query)
        .skip(startIndex)
        .limit(limit)
        .sort(sortOptions)
        .lean();
    }catch(err){
        console.log(`Error while category filter or pagination ${err.message}`);
        return res.status(500).json({
            status: "failed",
            message: "An error occurred during the search.",
          });
    }



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
