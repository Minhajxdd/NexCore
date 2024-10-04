

// Importing Schemas
import userModel from '../../models/userSchema.js';
import otpModel  from '../../models/otpSchema.js';


export async function createUser(req){

    try{
        await userModel.create({
            email: req.email,
            full_name: req.fullname,
            phone_number: req.phone,
            password: req.password,
              
        })
    } catch(err){
        console.error(`Error while creating a user on createUser on usersServices ${err.message}`);
    }

    console.log(`User Created Successfully`);
}

export async function getUsers(page, limit, uname){
    try{
        const startIndex = (page - 1) * limit;
        const result = {};

        const regex = new RegExp(uname, 'i');
        const query = { full_name: { $regex: regex } };

        result.users = await userModel
        .find(query).select('-password')
        .skip(startIndex)
        .limit(limit)
        .lean();
  
        if (result.users.length === limit) {
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
    }catch(err){
        console.error(`Error while fething user data on getUsers on usersServices ${err.message}`);
    }
}

export async function axiosIdFetch(id){
    try{
        const data = await userModel.findById(id).select('-password');
        return data;
    }catch(err){
        console.error(`Error while fething user data on axiosIdFetch on usersServices ${err.message}`);
    }
}

export async function userEdit(body){
    
    const updateData = {
        email: body.email,
        full_name: body.fullname,
        phone_number: body.phone,
      };

    if (body.password) {
        updateData.password = body.password;
    }

    try{
         await userModel.updateOne(
            { _id: body.id }, 
            { $set: updateData}
          )

    }catch(err){
        console.error(`Error while editing user data on userEdit on userServices ${err.message}`);
    }
}

export async function updateIsBlocked(id){
    try {
        const user = await userModel.findById(id);
    
        if (user) {
          user.isBlocked = !user.isBlocked;

          const updatedUser = await user.save();
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error updating isBlocked user:", error);
      }
}