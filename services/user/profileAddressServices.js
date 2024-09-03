// Importing Model
import addressModel from '../../models/addressSchema.js';
import userModel from '../../models/userSchema.js';


export async function addressIdRetreve(userId){
    try{
        return await userModel.findById(userId, {address_id: 1, _id: 0});
    }catch(err){
        console.log(`Error while fetching data on addressIdRetreve: ${err.message}`);
    }
}

export async function addressRetrevefromArray(addressId){
    try{
        return await addressModel.find({
            _id: { $in: addressId.address_id },
            isDeleted: { $ne: true}
        })
    }catch(err){
        console.log(`error while fetching data aon addressRetrevefromArray: ${err.message}`);
    }
}

export async function deleteAddress(id){
    try{
        await addressModel.findByIdAndUpdate(
            id,
            {$set: {
                isDeleted: true
            }}
        )
        return 'success';
    }catch(err){
        console.log(`error while deteling data on deleteAddress: ${err.message}`);
        return 'failed';
    }
}