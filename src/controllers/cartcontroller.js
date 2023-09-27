import {Product} from '../models/productmodel.js';
import {Cart} from '../models/cartmodel.js'

export const addToCart = async (req, res) => {
    const { companyId, productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({companyId})
        const product = await Product.findOne({productId})

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
    
}

