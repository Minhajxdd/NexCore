import cartModel from '../models/cartSchema.js';
import userModel from '../models/userSchema.js'
import productModel from '../models/productSchems.js';

export async function addCartProductsQuick(req, res){
    const {id: productId} = req.body;
    const { userId } = req.session;
    try{
        const productData = await productModel.findById(productId);
        const userData = await userModel.findById(req.session.userId);
        
        if(userData.cartId){
            const cartData = await cartModel.findById(userData.cartId);
      
            const itemIndex = cartData.items.findIndex(item => item.product_id.equals(productId));

            if (itemIndex !== -1) {

                cartData.items[itemIndex].quantity += 1;
                cartData.items[itemIndex].price += productData.discounted_price;
              } else {
                cartData.items.push(
                    { 
                        product_id: productId, 
                        quantity: 1, 
                        price: productData.discounted_price 
                    });
              }

            cartData.totalPrice += productData.discounted_price;
            
            await cartData.save();
        }else{

            const cartData = await cartModel.create({
                user: userId,
                items:[
                    {
                        product_id: productId,
                        quantity: 1,
                        price: productData.discounted_price
                    }
                ],
                totalPrice: productData.discounted_price,
    
            })
            await userModel.findByIdAndUpdate(
                userId,
                {cartId: cartData._id}
            )
        }

        return res.status(200).json({status:'success', message:'Successfull'});
    }catch(err){
        console.log(`Error on addCartProducts on cartcontroller ${err.message}`);
        return res.status(500).json({status:"failed", message:'Something went wrong'});
    }
}  