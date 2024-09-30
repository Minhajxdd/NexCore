// Importing Model
import addressModel from "../../models/addressSchema.js";
import userModel from "../../models/userSchema.js";


export async function getAddressDetails(userId) {
  try {
    return await addressModel.find({
     user_id: userId,
    //  isDeleted: false
    });
  } catch (err) {
    console.log(
      `error while fetching data aon getAddressDetails: ${err.message}`
    );
  }
}

export async function deleteAddress(id) {
  try {
    await addressModel.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });
    return "success";
  } catch (err) {
    console.log(`error while deteling data on deleteAddress: ${err.message}`);
    return "failed";
  }
}

export async function updateAddressFun(data, id) {
  try {
    const val = await addressModel.findByIdAndUpdate(
      id,
      {
        $set: {
          first_name: data.firstName,
          last_name: data.lastName,
          company: data.company,
          street: data.street,
          land_mark: data.land_mark,
          zipcode: data.zipcode,
          city_town: data.city_town,
          state: data.state,
          phone_no: data.phone_no,
          email: data.email,
        },
      },
      { new: true }
    );

    return val;
  } catch (err) {
    console.log(`error while updating address : ${err.message}`);
  }
}

export async function addAddressFun(data, userId) {
  try {
//    console.log(data);
    const addressdata = await addressModel.create(
      {
        
        user_id: userId,
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.company,
        street: data.street,
        land_mark: data.land_mark,
        zipcode: data.zipcode,
        city_town: data.city_town,
        state: data.state,
        phone_no: data.phone_no,
        email: data.email,
    
      }
    );
    
    return addressdata;
  } catch (err) {
    console.log(`error while creating new address : ${err.message}`);
    return false;
  }
}
