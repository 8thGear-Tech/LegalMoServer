import {Product} from '../models/productmodel.js';
import {Cart} from '../models/cartmodel.js'
import { addCart,options } from '../utils/cartvalidation.js';


export const addToCart = async (req, res) => {
    const validate = addCart.validate(req.body, options)
        if (validate.error) {
            const message = validate.error.details.map((detail) => detail.message).join(',');
                return res.status(400).send({
                    status: 'fail',
                    message,
                })
          }
    const { companyId, productId, quantity } = req.body;
    try {
        const cart = await Cart.findById({companyId})
        const product = await Product.findById({productId})

        if(!product){
            res.status(404).send({message : "product not found"})
            return
        }

        const price = productPrice;
        const name = productName;
        
        if(cart){
            const productIndex = cart.products.findIndex((product)=> product.productId == productId)

            if(productIndex > -1){
                let item = cart.products[productIndex]
                item.quantity += quantity

                cart.bill = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price
                }, 0)

                cart.products[productIndex] = item
                await cart.save()
                res.status(200).send(cart)
            }
            else{
                cart.product.push({productId, name, quantity, price})
                cart.bill = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price
                }, 0)

                await cart.save()
                res.status(200).send(cart)
            }
        }
        else{
            const newCart = await Cart.create({
                companyId,
                items: [{ productId, name, quantity, price}],
                bill : quantity * price ,
            });
            return res.status(201).send(newCart)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("something went wrong") 
    }


}

export const getCart = async (req, res) => {
    const { companyId } = req.body;
    try {
        const cart = await Cart.findOne({companyId})
       if(cart && cart.items.lenght > 0){
        res.status(200).send(cart)
       }
       else{
        res.send(null)
       }
    } catch (error) {
        res.status(500).send("something went wrong")
    }
}

export const deleteCart = async (req, res) => {
    const companyId  = req.body;
    const productId = req.params.id
    try {
        const cart = await Cart.findOne({companyId})

        const productIndex = cart.products.findIndex((product)=> product.productId == productId)
        if(productIndex > -1){
            let product = cart.products[productIndex]
            cart.bill -= product.quantity * product.price
            if(cart.bill < 0){
                cart.bill = 0
            }
            cart.products.splice(productIndex, 1)
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price
            }, 0)
            cart = await cart.save()
        }
        else{
            res.status(404).send("Product not found")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("something went wrong")
    }
}

export const clearCart = async (req, res) => {
    const { companyId } = req.body;

    try {
        await Cart.deleteMany({companyId})
        res.status(200).json({message: 'Cart cleared successfully'})
    } catch (error) {
        console.error(error)
        res.status(500).send("something went wrong")
    }
}