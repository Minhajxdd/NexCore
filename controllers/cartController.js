import cartModel from '../models/cartSchema.js';
import userModel from '../models/userSchema.js'
import productModel from '../models/productSchems.js';


// Cart update api controller
export async function addCartProductsQuick(req, res){
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
        }

        return res.status(200).json({status:'success', message:'Successfull'});
    }catch(err){
        console.log(`Error on addCartProducts on cartcontroller ${err}`);
        return res.status(500).json({status:"failed", message:'Something went wrong', err : err.message});
    }
}  

// Render Data to the cart page
export async function cartGet(req, res){

    const { cartId } = await userModel.findById(req.session.userId, {_id: 0 , cartId: 1});
    const [ cart ] = await cartModel.find(cartId);
    
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
   
