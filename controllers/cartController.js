import { ObjectId } from 'mongodb';

// Importing Models
import cartModel from '../models/cartSchema.js';
import userModel from '../models/userSchema.js'
import productModel from '../models/productSchems.js';




// Render Data to the cart page
export async function cartGet(req, res){
    const cartId = req.session.cartId;
    const cart = await cartModel.findById(cartId);
    
    
    if (!cart) {
        const products = null;
        // return res.status(404).json({status: 'failed', message: 'Cart not found'});
        return res.render('pages/user/cartPage' , {
            cart,
            products
        });
    }

    const products = await Promise.all(
        cart.items.map(async (val) => {
            return await productModel.findById(val.product_id);
        })
    ); 
    res.render('pages/user/cartPage' , {
        cart,
        products
    });
}
   






// Cart update api controller
export async function addCartProducts(req, res){
    const {id: productId, quantity: quantityString} = req.body;
    const quantity = quantityString !== undefined ? Number(quantityString) : undefined;
    const { userId } = req.session;

    if(!productId){
        return res.status(404).json({status: "failed", message: "productId not found"});
    }

    if (quantity && (typeof quantity !== 'number' || quantity <= 0)) {
        return res.status(400).json({ status: 'failed', message: 'Invalid quantity' });
    }
    
    if(!userId){
        return res.status(404).json({status: "failed", message: "userId not found"});
    }


    try{
        const productData = await productModel.findById(productId);
        const userData = await userModel.findById(userId);
        
        if(userData.cartId){
            const cartData = await cartModel.findById(userData.cartId);
      
            const itemIndex = cartData.items.findIndex(item => item.product_id.equals(productId));

            const price = quantity ? productData.discounted_price * quantity : productData.discounted_price;
            if (itemIndex !== -1) {

                cartData.items[itemIndex].quantity += quantity || 1;
                cartData.items[itemIndex].price += price;
              } else {
                cartData.items.push(
                    { 
                        product_id: productId, 
                        quantity: quantity || 1, 
                        price: price, 
                    });
              }

            cartData.totalPrice += price;
            
            await cartData.save();
            req.session.cartId = userData.cartId;
        }else{

            const price = quantity ? productData.discounted_price * quantity : productData.discounted_price;
            const cartData = await cartModel.create({
                user: userId,
                items:[
                    {
                        product_id: productId,
                        quantity: quantity || 1,
                        price: price,
                    }
                ],
                totalPrice: price,
    
            })
            await userModel.findByIdAndUpdate(
                userId,
                {cartId: cartData._id}
            )
            req.session.cartId = cartData._id;
        }

        return res.status(200).json({status:'success', message:'Successfull'});
    }catch(err){
        console.log(`Error on addCartProducts on cartcontroller ${err}`);
        return res.status(500).json({status:"failed", message:'Something went wrong', err : err.message});
    }
}  







export async function productQuantityInc(req, res){

    const cartId = req.session.cartId;
    const { id: productId, inputValue } = req.body;

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: "failed", message: "Cart not found" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: "failed", message: "Product not found" });
        }

        const updatedPrice = product.discounted_price * inputValue;


        const updateResult = await cartModel.findOneAndUpdate(
            { _id: cartId, 'items.product_id': productId },
            {
                $inc: { 'items.$.quantity': 1 }, 
                $set: { 'items.$.price': updatedPrice }
            },
            {
                new: true
            }
        );

        if (!updateResult) {
            return res.status(400).json({ status: "failed", message: "Quantity could not be increased" });
        }
        const totalPrice = await cartTotalUpdate(cartId);
        res.json({ status: "success", updatedPrice: updatedPrice, totalPrice: totalPrice });
    } catch (err) {
        console.log(`Error while increasing the quantity of cart: ${err}`);
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }

}








export async function productQuantityDec(req, res) {
    const cartId = req.session.cartId;
    const { id: productId, inputValue } = req.body;

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: "failed", message: "Cart not found" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: "failed", message: "Product not found" });
        }

        const updatedPrice = product.discounted_price * inputValue;


        const updateResult = await cartModel.findOneAndUpdate(
            { _id: cartId, 'items.product_id': productId },
            {
                $inc: { 'items.$[elem].quantity': -1 }, 
                $set: { 'items.$[elem].price': updatedPrice }
            },
            {
                arrayFilters: [{ 'elem.product_id': productId, 'elem.quantity': { $gt: 1 } }],
                new: true
            }
        );

        if (!updateResult) {
            return res.status(400).json({ status: "failed", message: "Quantity could not be decremented" });
        }
        const totalPrice = await cartTotalUpdate(cartId);
        
        res.json({ status: "success", updatedPrice: updatedPrice, totalPrice: totalPrice });
    } catch (err) {
        console.log(`Error while decrementing the quantity of cart: ${err}`);
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
}







async function cartTotalUpdate(cartId){
    try{
        const cart = await cartModel.findById(cartId);
    
        if(cart){
            const newTotalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

        cart.totalPrice = newTotalPrice;

        await cart.save();
        return newTotalPrice;
        } else {
            console.log('Cart not found');
            return res.status(404).json({status: 'failed', message: "Cart Not Found"});
        }   

    
    }catch(err){
        console.log(`Error while updating total price on cartController ${err.message}`);
        return res.status(500).json({status: "failed", message: "Internal server error"});
    }
    
}






export async function deleteCartProduct(req, res){
    const cartId = req.session.cartId;
    const productId = new ObjectId(req.body.productId);

    if(!cartId){
        return res.status(404).json({status: 'failed', message: 'cart id not found'});
    }

    if(!productId){
        return res.status(404).json({status: 'failed', message: 'product id not found'});
    }

    try{
        const cart = await cartModel.findById(
            cartId,
            {_id:0 , items: 1}
        )

        const SubPrice = cart.items.find(item => item.product_id.equals(productId)).price;
        
        const cartData =  await cartModel.findByIdAndUpdate(
            cartId,
            {
                $pull: { items: {product_id: productId}},
                $inc: {totalPrice: -SubPrice}
            },
            {new: true}
        );

        if(cartData.items.length === 0){
            return res.json({
                status: 'success', 
                message: 'product deleted successfully', 
                totalPrice: cartData.totalPrice, 
                emptyCart: true
            });
        } 

        return res.json({
            status: 'success', 
            message: 'product deleted successfully', 
            totalPrice: cartData.totalPrice,
            emptyCart: false
        });

    }catch(err){
        console.log(`Error which deleting cart products on cartController : ${err.message}`);
    }


}