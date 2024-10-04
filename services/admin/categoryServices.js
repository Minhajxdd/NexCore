// Importing Schemas
import categoryModel from "../../models/categorySchema.js";

export async function createCategory(body) {
  try {
    await categoryModel.create({
      name: body.name,
      description: body.description,
    });
  } catch (err) {
    console.error(
      `Error while creating a category on createCategory on categoryServices ${err.message}`
    );
  }
}

export async function getCategory(page, limit) {
  try {
    const startIndex = (page - 1) * limit;
    const result = {};

    result.data = await categoryModel
      .find(
        {},
        {
          name: 1,
          description: 1,
          isDeleted: 1,
        }
      )
      .skip(startIndex)
      .limit(limit)
      .lean();

    if (result.data.length === limit) {
      result.next = {
        page: Number(page) + 1,
        limit: limit,
      };
    } else {
      result.next = {
        page: page,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    } else {
      result.previous = {
        page: 1,
        limit: limit,
      };
    }

    return result;
  } catch (err) {
    console.log(
      `error while fetching all the category data on getCategory on categoryServices ${err.message}`
    );
    return false;
  }
}

export async function updateDeleted(id) {
  try {
    const data = await categoryModel.findById(id);

    if (data) {
      data.isDeleted = !data.isDeleted;

      const updatedUser = await data.save();
    } else {
      console.log("Category not found");
    }
  } catch (error) {
    console.error(
      "Error updating isDeleted category on updateDeleted on categoryServices:",
      error.message
    );
  }
}

export async function editCategory(data) {
  try {
    const value = await categoryModel.findByIdAndUpdate(
      data.id,
      {
        name: data.name,
        description: data.description,
      },
      { new: true }
    );

    value.success = "success";

    return value;
  } catch (err) {
    console.log(
      `Error while editing category on category editCategory on CategoryServices`,
      err.message
    );
  }
}

export async function checkDuplicateCategory(name) {
  try {
    const data = await categoryModel.find({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return data.length === 0;
  } catch (err) {
    console.log(`error while checking duplicate categories: ${err.message}`);
  }
}
