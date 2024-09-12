// Importing Model
import couponModel from "../../models/couponSchema.js";

export async function checkDupeCoupon(name) {
  try {
    const nameValidate = await couponModel.findOne(
      {
        couponCode: name,
      },
      {
        _id: 0,
        couponCode: 1
      }
    );

    if (!nameValidate) return true;

    if (nameValidate.couponCode === name) return false;

    return true;

  } catch (err) {
    console.log(
      `error while checking duplicate name on checkDupeCoupon : ${err.message}`
    );
  }
}

export async function createCoupon(data) {
  try {
    await couponModel.create({
      couponCode: data.cpCode,
      discountPrice: data.dscPrice,
      minimumPrice: data.minPrice,
      expirationDate: data.expDate,
      limit: data.limit,
    });
  } catch (err) {
    console.log(
      `error while creating a new coupon on createCoupon : ${err.message}`
    );
  }
}


export async function getAllCoupons(){
    try{    
        return await couponModel.find();

    }catch(err){
        console.log(`error while fetching all coupon data : ${err.message}`);
    }
}