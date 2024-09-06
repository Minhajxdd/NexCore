// Importing Services
import { addressIdRetreve, addressRetrevefromArray, deleteAddress, updateAddressFun } from '../services/user/profileAddressServices.js';
import { ordersDetails, getProductDetails } from '../services/user/profileOrdersServices.js';
 
// Importing Model
import addressModel from '../models/addressSchema.js';
import userModel from '../models/userSchema.js';


export function profileGet(req, res){
    res.render('pages/user/profile.ejs');
};


// Addresss

export async function addressGet(req, res){

    try{
        const addressId = await addressIdRetreve(req.session.userId);
        const addresses = await addressRetrevefromArray(addressId);
        res.render('pages/user/address', {
            addresses
        });

    } catch(err){
        console.log(`error while address get :${err.message}`);
    }

};


export async function deleteAddess(req, res){
    try{
        await deleteAddress(req.query.id)
        
        return res.json({
            status: 'success',
            message: 'successfully deleted'
        })

    }catch(err){
        console.log(`error while deleting address ${err.message}`);
        return res.json({
            status: 'failed',
            message: 'failed on deletion'
    })
    }
    
};


export async function updateAddress(req, res){
    const { formData, id } = req.body;
    
    const result = {}
    
    result.data = await updateAddressFun(formData, id);

    result.status = 'success';
    
    res.json(result);
}

// Address


// Orders

export async function ordersGet(req, res){
    const orders = await ordersDetails(req.session.userId);

    const productDetails = [];

    await Promise.all(orders.map(async (obj, indx) => {
        productDetails.push({});
        
        const products = await Promise.all(
            obj.products.map(async (innerObj) => {
                const temp = await getProductDetails(innerObj.product_id);
                return temp;
            })
        );
        productDetails[indx].products = products;
    }));


    res.render('pages/user/orders',{
        orders,
        productDetails
    });
}


export async function orderDetailsGet(req, res){
    res.render('pages/user/orderDetails');
}


// Orders