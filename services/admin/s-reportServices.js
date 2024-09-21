// Importing Model
import orderModel from "../../models/orderSchema.js";

// Importing Modules
import moment from "moment";

// Filter orders based on the type (daily, weekly, monthly, yearly, custom, or all)
export const sreportFilter = async (
  filterType,
  customStartDate,
  customEndDate
) => {
  let filter = {};

  // Get today's date and time
  const today = moment().startOf("day");

  switch (filterType) {
    case "daily":
      // Get orders from the start of today to the end of today
      filter = {
        orderedAt: {
          $gte: today.toDate(),
          $lt: moment(today).endOf("day").toDate(),
        },
      };
      break;

    case "weekly":
      // Get orders from the start of the week (Sunday) to now
      filter = {
        orderedAt: {
          $gte: moment().startOf("week").toDate(),
          $lt: moment().endOf("week").toDate(),
        },
      };
      break;

    case "monthly":
      // Get orders from the start of the month to now
      filter = {
        orderedAt: {
          $gte: moment().startOf("month").toDate(),
          $lt: moment().endOf("month").toDate(),
        },
      };
      break;

    case "yearly":
      // Get orders from the start of the year to now
      filter = {
        orderedAt: {
          $gte: moment().startOf("year").toDate(),
          $lt: moment().endOf("year").toDate(),
        },
      };
      break;

    case "custom":
      if (!customStartDate || !customEndDate) {
        throw new Error("Custom date range requires both start and end dates");
      }
      // Convert custom dates to Date objects
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      filter = {
        orderedAt: {
          $gte: moment(startDate).startOf("day").toDate(),
          $lt: moment(endDate).endOf("day").toDate(),
        },
      };
      break;

    case "all":
      // No filter is applied for "all"
      filter = {};
      break;

    default:
      throw new Error("Invalid filter type");
  }

  // Query the database with the filter
  try {
    filter.orderStatus  = 'delivered';

    const orders = await orderModel.find(filter, {
        returnRequest: 0,
        user_id: 0,
        products: 0,
        addressId: 0,
        orderStatus: 0,
    });
    return orders;
  } catch (error) {
    console.error("Error filtering orders:", error);
    throw error;
  }
};
