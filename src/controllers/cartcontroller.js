import {Product} from '../models/productmodel.js';
import {Cart} from '../models/cartmodel.js'
import { addCart,options } from '../utils/cartvalidation.js';
import { Job } from '../models/jobmodel.js';

export const addToCart = async (req, res) => {
    const validate = addCart.validate(req.body, options)
        if (validate.error) {
            const message = validate.error.details.map((detail) => detail.message).join(',');
                return res.status(400).send({
                    status: 'fail',
                    message,
                })
          }
    const { companyId, productId, quantity, detail } = req.body;
    if(!quantity){
        const quantity = 1
    }
    try {
        const cart = await Cart.findOne({companyId})
        const product = await Product.findById(productId)
        console.log(cart)
        if(!product){
            res.status(404).send({message : "product not found"})
            return
        }
       
        const price = product.productPrice;
        const name = product.productName;
        
        if(cart){
            const productIndex = cart.products.findIndex((product)=> product.productId == productId)
            console.log(productIndex)
            if(productIndex > -1){
                let item = cart.products[productIndex]
                item.quantity += quantity
                item.detail = detail
                cart.bill = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price
                }, 0)        
                cart.products[productIndex] = item
                await cart.save()
                res.status(200).send(cart)
            }
            else{
                cart.products.push({productId, quantity, price, detail})
                console.log(cart.bill)
                cart.bill = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price
                }, 0)
                console.log(cart.bill)

                await cart.save()
                res.status(200).send(cart)
            }
        }      
        else{
            const newCart = await Cart.create({
                companyId,
                products: [{ productId, quantity, price, detail}],
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
       if(cart){
        console.log("not empty")
        console.log(cart)
        res.status(200).send(cart)
       }
       else{
        res.send(null)
        console.log("Nothing in the cart")
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

export const checkout = async (req, res) => {
    const { companyId } = req.body;  
    const cart = await Cart.findOne({companyId})
    try {
        cart.map(async (job) => {
            const newJob = await Job.create({
                companyId : cart.companyId,
                productId: job.productId,
                detail:job.detail 
            });
            return res.status(201).send(newJob)
        })
    } catch (error) {
        res.status(500).send("something went wrong")       
    } 
}