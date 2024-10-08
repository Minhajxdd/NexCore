// Importing Models
import userModel from "../../models/userSchema.js";

export async function updateProfileDetails(type, value, userId) {
  if (type === "name") {
    try {
      await userModel.findByIdAndUpdate(userId, {
        $set: {
          full_name: value,
        },
      });
      return true;
    } catch (err) {
      return false;
      console.log(err);
    }
  } else if (type === "number") {
    try {
      await userModel.findByIdAndUpdate(userId, {
        $set: {
          phone_number: value,
        },
      });
      return true;
    } catch (err) {
      return false;
      console.log(err);
    }
  }
}


export async function getuserData(userId) {
    try{
        const data = await userModel
        .findById(userId,{email:1,full_name:1,phone_number:1,_id:0})
        .lean();
        return data;

    }catch(err){
        console.log(err);
    }
}