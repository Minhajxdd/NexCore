// Importing Model
import productModel from "../../models/productSchema.js";
import categoryModel from "../../models/categorySchema.js";
import offerModel from "../../models/offerSchema.js";

export async function offerGetType(type) {
  try {
    if (type === "Category") {
      const data = await categoryModel.find(
        {},
        {
          name: 1,
        }
      );

      return data;
    } else if (type === "Products") {
      const data = await productModel.find(
        {},
        {
          name: 1,
        }
      );

      return data;
    }
  } catch (err) {
    console.log(`error while fetching type data: ${err.message}`);
    return false;
  }
}

export async function existCouponName(title){
  try{
    const check = await offerModel.exists({ offer_title: title});

    return check;

  }catch(err){
    console.log(`error while checkign duplicate offer: ${err.message}`);
  }
}


export async function createOffer(data){
  try{

    const offer = {
      offer_title: data.title,
      offer_type: data.offer_type,
      offer_available: data.values,
      discount_percentage: data.discount_percentage,
      exp_date: new Date(data.expiry_date),
    }

    const offerData = await offerModel.create(offer);

    return offerData;
  }catch(err){
    console.log(`error while creating offer: ${err.message}`);
    return false;
  }
}


export async function getOffers(){
  try{
    const data = offerModel.find();
    return data;

  }catch(err){
    console.log(`error while fetching all offere details: ${err.message}`);
  }
}



export async function updateOfferStatus(id){
  try{

    await offerModel.findByIdAndUpdate(
      id,
      [{ $set: { isDeleted: { $not: "$isDeleted" } } }]
    );


  }catch(err){
    console.log(`error while updating status of offer: ${err.message}`);
  }
}
