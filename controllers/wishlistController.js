// Importing Models
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlistSchema.js";
import productModel from "../models/productSchema.js";
import mongoose from "mongoose";

export const wishListGet = async (req, res) => {
  const userId = req.session.userId || req.session.passport.user;

  let wishlist = null;
  let products = null;

  try {
    await (async function () {
      wishlist = await wishlistModel.findOne({ user_id: userId });
      if (!wishlist) {
        return;
      }

      products = await Promise.all(
        wishlist.products.map(async (val) => {
          return await getProductdetails(val);
        })
      );
    })();
  } catch (err) {
    console.log(`error while fetching data for wishListGet: ${err.message}`);
  }
  
  res.render("pages/user/wishlist", {
    products,
  });

  async function getProductdetails(id) {
    return await productModel.findOne(
      {
        _id: id,
        isDeleted: false,
      },
      {
        name: 1,
        images: 1,
        discounted_price: 1,
        images: 1,
        stock: 1,
      }
    );
  }
};

export const addtoWishlist = async (req, res) => {
  const productId = req.query.productId;
  const userId = req.session.userId || req.session.passport.user;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.json({
      status: "failed",
      message: "invalid object is sent",
    });
  }

  try {
    const data = await productModel.findById(productId);

    if (!data) {
      return res.json({
        status: "failed",
        message: "no product found",
      });
    }
  } catch (err) {
    console.log(`error while checking is valid object id : ${err.message}`);
  }

  try {
    const isWishlist = await wishlistModel.find({ user_id: userId });

    if (isWishlist.length === 0) {
      await wishlistModel.create({
        user_id: userId,
        products: [productId],
      });
    } else {
      const data = await wishlistModel.updateOne(
        {
          user_id: userId,
        },
        {
          $addToSet: {
            products: productId,
          },
          $set: {
            updated_at: new Date(),
          },
        }
      );
    }
  } catch (err) {
    console.log(`error on wishlist add or create : ${err.message}`);
  }
};


export async function wishlistRemove(req, res){
  const userId = req.session.userId || req.session.passport.user;
  const productId = req.query.id;

  try{

    await wishlistModel.updateOne(
      {
        user_id: userId
      },
      {
        $pull: {
          products: productId 
        }
      }
    )

  }catch(err){
    console.log(`error while removing item from wishlist : ${err.message}`);
  }

  return res.json({
    status: 'success'
  })

}