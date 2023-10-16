import { Product } from "../models/productmodel.js";
import { Cart } from "../models/cartmodel.js";
import { addCart, options } from "../utils/cartvalidation.js";
import { Job } from "../models/jobmodel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export const addToCart = async (req, res) => {
  const validate = addCart.validate(req.body, options);
  if (validate.error) {
    const message = validate.error.details
      .map((detail) => detail.message)
      .join(",");
    return res.status(400).send({
      status: "fail",
      message,
    });
  }
  console.log(req.body);
  const { companyId, productId, quantity, detail } = req.body;
  if (!quantity) {
    let quantity = 1;
  }
  try {
    const cart = await Cart.findOne({ companyId });
    console.log(cart);
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send({ message: "product not found" });
      return;
    }

    const price = product.productPrice;
    const name = product.productName;

    if (cart) {
      const productIndex = cart.products.findIndex(
        (product) => product.productId == productId
      );
      console.log(productIndex);
      if (productIndex > -1) {
        let item = cart.products[productIndex];
        if (!quantity) {
          let quantity = 1;
        }
        console.log(item);
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          item.quantity = item.quantity + 1;
        }
        // item.quantity += quantity
        item.detail = detail;
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        cart.products[productIndex] = item;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.products.push({ productId, quantity, price, detail });
        console.log(cart);
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      if (quantity > 0) {
        const newCart = await Cart.create({
          companyId,
          products: [{ productId, quantity, price, detail }],
          bill: quantity * price,
        });
        return res.status(201).send(newCart);
      } else {
        const newCart = await Cart.create({
          companyId,
          products: [{ productId, price, detail }],
          bill: price,
        });
        return res.status(201).send(newCart);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const getAllCart = async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  // const companyId  = req.body.companyId;
  const params = req.params.id;
  console.log(req.params.id);
  const cart = await Cart.find({ companyId: params });
  // const cart = await Cart.findById(req.params.id);
  try {
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.send(null);
      console.log("Nothing in the cart");
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

export const deleteCart = async (req, res) => {
  const { companyId, productId } = req.body;
  console.log(productId);
  try {
    console.log("Cart findig");
    const cart = await Cart.find({ companyId: companyId });
    const products = cart[0].products;
    const objectIdToFind = new ObjectId(productId);
    console.log(products, objectIdToFind);
    // const productIndex = products.findIndex((product)=> {
    //     console.log( product.productId)
    //     JSON.stringify(product.productId) == JSON.stringify(objectIdToFind)
    // })
    const productIndex = products.findIndex((product) =>
      product.equals(productId)
    );
    console.log(productIndex);
    if (productIndex > -1) {
      let product = cart.products[productIndex];
      cart.bill -= product.quantity * product.price;
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.products.splice(productIndex, 1);
      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log("jdjjdjd");
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const clearCart = async (req, res) => {
  const { companyId } = req.body;

  try {
    await Cart.deleteMany({ companyId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("something went wrong");
  }
};

export const checkout = async (req, res) => {
  const { companyId } = req.body;
  const cart = await Cart.findOne({ companyId });
  console.log(cart.products);

  try {
    if (cart.products) {
      cart.products.forEach((job) => {
        const jobs = new Job({
          companyId: cart.companyId,
          productId: job.productId,
          detail: job.detail,
        });
        jobs
          .save()
          .then(() => {
            console.log(saved);
          })
          .catch((err) => {
            console.log(err);
          });
      });
      await Cart.deleteMany({ companyId });
      return res.status(201).json("Added to cart successfully");

      // cart.products.map(async (job) => {
      //     console.log(job)
      //     const newJob = await Job.create({
      //         companyId : cart.companyId,
      //         productId: job.productId,
      //         detail:job.detail
      //     });
      //     return res.status(201).send(newJob)
      // })
    } else {
      res.status(400).send("Nothing in your cart");
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};
