
// Importing Services functions
import { createUser, getUsers, axiosIdFetch, userEdit, updateIsBlocked } from '../services/admin/usersServices.js';
import { createCategory, getCategory, updateDeleted, editCategory } from '../services/admin/categoryServices.js';
import { getCategoryDetails, createProduct, getProducts, updateDeletedProduct } from '../services/admin/productServices.js';

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
        return res.json({
            status: "success",
            message: "Admin verified successfully"
        })
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
    await createCategory(req.body);
    const data = await getCategory();
    res.json({data});
}

export async function deleteCategory(req, res){
    await updateDeleted(req.query.id);
    res.json({
        status: "success",
        message: "successfully updated"
    });
}

export async function editCategoryPost(req, res){
    await editCategory(req.body);
    res.json({
        status: "success"
    })
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
    await createProduct(req.body, req.query.cat_id, req.files);
    res.json({status: 'Success'});
}

export async function deleteProducts(req, res){
    await updateDeletedProduct(req.query.id);
    res.json({status: "success"});
}

// Admin Product Dashboard Controllers


export const ordersGet = (req, res) => {
    res.render(`pages/admin/orders`);
}

export const couponsGet = (req, res) => {
    res.render(`pages/admin/coupons`);
}

export const salesReportGet = (req, res) => {
    res.render(`pages/admin/s-report`);
}