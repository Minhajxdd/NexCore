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
        couponCode: 1,
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

export async function getAllCoupons() {
  try {
    return await couponModel.find();
  } catch (err) {
    console.log(`error while fetching all coupon data : ${err.message}`);
  }
}

export async function editCoupon(data) {
  try {
    await couponModel.findByIdAndUpdate(data.couponId, {
      $set: {
        couponCode: data.cpCode,
        discountPrice: data.dscPrice,
        minimumPrice: data.minPrice,
        expirationDate: data.expDate,
        limit: data.limit,
        updatedAt: Date.now(),
      },
    });

    return true;
  } catch (err) {
    return false;
    console.log(`error while editing coupon : ${err.message}`);
  }
}

export async function deleteCoupon(id) {
  try {
    const coupon = await couponModel.findById(id);

    if (coupon) {
      coupon.isDeleted = !coupon.isDeleted;
      const data = await coupon.save();

    } else {
      return res.json({
        status: 'failed',
        message: 'coupon not found'
      })
    }

  } catch (err) {
    return res.json({
      status: 'failed',
      message: `something went wrong: ${err.message}`
    })
    console.log(`error while deleting a coupon: ${err.message}`);
  }
}
