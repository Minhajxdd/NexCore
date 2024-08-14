

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

export async function getUsers(){
    try{
        const data = await userModel.find().select('-password');
        return data;
    }catch(err){
        console.error(`Error while fething user data on getUsers on usersServices ${err.message}`);
    }
}