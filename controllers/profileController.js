// Importing Services
import { addressIdRetreve, addressRetrevefromArray, deleteAddress } from '../services/user/profileAddressServices.js';


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
    console.log(req.body);
}

// Address