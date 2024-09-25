// Importing Model
import orderModel from "../../models/orderSchema.js";
import productModel from "../../models/productSchema.js";
import categoryModel from "../../models/categorySchema.js";
import offerModel from "../../models/offerSchema.js";

// Importing dependencies
import moment from "moment";

// Get dashboard details
export async function getDashboardData() {
  try {
    // Get Total Revenue
    const [data] = await orderModel.aggregate([
      {
        $facet: {
          revenue: [
            // Matching the orderStatus delivered fields
            { $match: { orderStatus: "delivered" } },
            // grouping all any field finding the total of everything
            { $group: { _id: null, totalSum: { $sum: "$totalPrice" } } },
          ],
          orders: [
            // grouping all finding the sum of total documents
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
          sales: [
            // Matching the orderStatus delivered documents
            { $match: { orderStatus: `delivered` } },
            // groping all finding the sum of all matched docuemnt
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    // finding the total count of products
    data.products = await productModel.aggregate([
      {
        $group: { _id: null, count: { $sum: 1 } },
      },
    ]);

    // filtering the data
    data.revenue = data.revenue[0].totalSum;
    data.orders = data.orders[0].count;
    data.sales = data.sales[0].count;
    data.products = data.products[0].count;

    return data;
  } catch (err) {
    console.log(`error while retreving data: ${err.message}`);
    return { revenue: 0, orders: 0, sales: 0, products: 0 };
  }
}
// Get dashboard details

export async function productChartData(filterBy) {
  try {
    const now = moment();

    let startDate;

    switch (filterBy) {
      case "today":
        startDate = now.startOf("day").toDate();
        break;
      case "weekly":
        startDate = now.subtract(1, "weeks").startOf("week").toDate();
        break;
      case "monthly":
        startDate = now.subtract(1, "months").startOf("month").toDate();
        break;
      case "yearly":
        startDate = now.subtract(1, "years").startOf("year").toDate();
        break;
      case "all-time":
        startDate = new Date(0);
        break;
      default:
        startDate = now.toDate();
    }

    const data = await orderModel.aggregate([
      {
        $match: {
          orderedAt: { $gte: startDate },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product_id",
          totalQuantitySold: { $sum: "$products.quantity" },
        },
      },
      {
        $sort: {
          totalQuantitySold: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 0,
          product_id: "$_id",
          productName: "$productDetails.name",
          quantity: "$totalQuantitySold",
        },
      },
    ]);

    return data;
  } catch (err) {
    console.log(`error while fetching `);
  }
}
