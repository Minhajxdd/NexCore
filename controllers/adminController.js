
// Importing Services functions
import { createUser, getUsers, axiosIdFetch, userEdit, updateIsBlocked } from '../services/admin/usersServices.js';
import { createCategory, getCategory, updateDeleted, editCategory, checkDuplicateCategory } from '../services/admin/categoryServices.js';
import { getCategoryDetails, createProduct, getProducts, 
    updateDeletedProduct, updateProductStock, oneProductDetails } from '../services/admin/productServices.js';
import { getAllOrders, getUsersData, updateOrderStatus } from '../services/admin/orderServices.js';


export const loginGet = (req, res) => {

    if(req.query){
        const err = Number(req.query.err); 
        switch(err){
            case 1:
               return res.render('pages/admin/admin_login', {alertMessage : "user name or password not found!!"});
        }
    }

    res.render('pages/admin/admin_login' , {alertMessage : ''});
}

export const loginPost = (req, res) => {
    const {uname, password } = req.body;
    if(uname === 'Admin' && password === 'admin123'){
        req.session.admin = uname;
        return res.redirect('/admin');
    }

    res.redirect('/admin/login?err=1');

}

export const homeGet = (req, res) => {
    res.render(`pages/admin/dashboard`); 
}


 
// Admin User Dashboard Controllers
export const usersGet = async (req, res) => {
    const users = await getUsers();

    res.render(`pages/admin/user`, {
        users
        });
}

export const usersPost = async (req, res) => {
    await createUser(req.body);
    res.redirect('/admin/users');
}

export const edituser = async (req, res) => {
    const data = await axiosIdFetch(req.query.id);
    res.json(data)
}

export const editPost = async(req, res) => {
    await userEdit(req.body)
    res.redirect('/admin/users')
}

export const editBlocked = async (req, res) => {
    updateIsBlocked(req.body.id)
    res.json({
        status: "success",
        message: "updated successfully"
    })
}
// Admin User Dashboard Controllers



// Admin Categories Dashboard Controllers
export async function categoriesGet (req, res){
    const data = await getCategory();
    res.render('pages/admin/categories' , {data});
}

export async function addCategoryPost(req, res){

    if(await checkDuplicateCategory(req.body.name)){

        await createCategory(req.body);
        const data = await getCategory();
        return res.json({data});
    }

    return res.json(
        {
        data:{
        status: 'failed',
        message: 'something went wrong',
        dupe: 'Duplicate Name Found'
    }})
}

export async function deleteCategory(req, res){
    await updateDeleted(req.query.id);
    res.json({
        status: "success",
        message: "successfully updated"
    });
}

export async function editCategoryPost(req, res){
    if(await checkDuplicateCategory(req.body.name)){
        const data = await editCategory(req.body);
        return res.json(data);
    }

    return res.json(
        {
        data:{
        status: 'failed',
        message: 'something went wrong',
        dupe: 'Duplicate Name Found'
    }})
}

// Admin Categories Dashboard Controllers


// Admin Product Dashboard Controllers
export async function productsGet(req, res){
    const categories = await getCategoryDetails();
    const products  = await getProducts();

    res.render(`pages/admin/product`, {
        categories,
        products
    });
}

export async function addProducts(req, res){
    const productData = await createProduct(req.body, req.query.cat_id, req.files);
    
    const result = {}
    result.product_details = productData;
    result.status = 'Success';
    
    res.json(result);
}

export async function deleteProducts(req, res){
    await updateDeletedProduct(req.query.id);
    res.json({status: "success"});
}

export async function updateStock(req, res){
    const { action, id } = req.query;
    if(action == 'add'){
        updateProductStock(id, 1)
        return res.json({
            status: 'success',
            message: 'stock incremented successfully'
        });
    };

    updateProductStock(id, -1)
    return res.json({
        status: 'success',
        message: 'stock decremented successfully'
    })


}

export async function getProductDetails(req, res){
    const productData = await oneProductDetails(req.query.id);
    res.json(productData);
}

// Admin Product Dashboard Controllers


// Admin Orders Dashboard Controllers
export const ordersGet = async (req, res) => {
    const userId = req.session.userId || req.session.passport.user;

    const orders = await getAllOrders(userId);

    const users = await Promise.all(
        orders.map(async (order) => {
            return await getUsersData(order.user_id);
        })
    );

    res.render(`pages/admin/orders`,{
        orders,
        users
    });
}

export async function orderUpdateStatus(req, res){

    if(updateOrderStatus(req.body.id, req.body.status)){
        return res.json({
            status: 'succes',
            message: "status updated successfully"
        })
    }
    return res.json({
        status: 'failed',
        message: 'error while updating successfully'
    })
}


// Admin Orders Dashboard Controllers


export const couponsGet = (req, res) => {
    res.render(`pages/admin/coupons`);
}

export const salesReportGet = (req, res) => {
    res.render(`pages/admin/s-report`);
}






function authenticate(req, res, next){
    if(req.session.admin){
        return next();
    }
    res.redirect('/admin/login');
}

export default authenticate;