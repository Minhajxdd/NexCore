// Importing Models
import walletModel from '../../models/walletSchema.js';

export async function getWalletData(userId){
    try{
        const data = await walletModel.findOne({ user_id: userId});
        return data;
    }catch(err){
        console.log(`error while fetching wallet data: ${err.message}`);
    }
}