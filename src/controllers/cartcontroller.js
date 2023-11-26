import { Product } from "../models/productmodel.js";
import { Cart } from "../models/cartmodel.js";
import { Company } from "../models/companymodel.js";
import { addCart, options } from "../utils/cartvalidation.js";
import { Job } from "../models/jobmodel.js";
import { sendEmail } from "../utils/email.js";

export const addToCart = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
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
  const companyId = req.userId;
  const { productId, quantity, file, detail } = req.body;
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
        // console.log(item)
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
        const populateCart = await cart.populate("companyId products");
        res.status(200).send(populateCart);
      } else {
        cart.products.push({ productId, quantity, price, file, detail });
        console.log(cart);
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        const populateCart = await cart.populate("companyId products");
        res.status(200).send(populateCart);
      }
    } else {
      if (quantity > 0) {
        const newCart = await Cart.create({
          companyId,
          products: [{ productId, quantity, price, file, detail }],
          bill: quantity * price,
        });
        const populateCart = await newCart.populate("companyId products");
        res.status(200).send(populateCart);
      } else {
        const newCart = await Cart.create({
          companyId,
          products: [{ productId, price, file, detail }],
          bill: price,
        });
        const populateCart = await newCart.populate("companyId products");
        res.status(200).send(populateCart);
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
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  try {
    const cart = await Cart.find({ companyId: req.userId }).populate(
      "companyId products"
    );
    if (cart === null || cart.length == undefined) {
      res
        .status(400)
        .send("Nothing in the Cart, Pls add some products to your cart");
      return;
    }
    res.status(200).json(cart);
    return;
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteCart = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  const productId = req.params.id;
  const companyId = req.userId;
  try {
    console.log("Cart finding");
    let cart = await Cart.findOne({ companyId });
    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }
    let products = cart.products;
    console.log(products);
    const productIndex = products.findIndex((product) => {
      console.log(product.productId.toHexString());
      console.log(productId);
      return product.productId.toHexString() == productId;
    });
    console.log(productIndex);
    if (productIndex > -1) {
      let product = cart.products[productIndex];
      console.log(product);
      cart.bill -= product.quantity * product.price;
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.products.splice(productIndex, 1);
      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();
      res.status(200).send(cart);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const clearCart = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  const companyId = req.userId;
  try {
    await Cart.deleteMany({ companyId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("something went wrong");
  }
};

export const checkout = async (req, res) => {
  const company = await Company.findById(req.userId);
  if (!company) {
    res.status(404).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  const companyId = req.userId;
  const cart = await Cart.findOne({ companyId });
  console.log(cart.products);
  try {
    if (cart.products) {
      cart.products.forEach((product) => {
        const jobs = new Job({
          companyId: req.userId,
          productId: product.productId,
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
      await sendEmail({
        email: company.officialEmail,
        subject: "Purchase Completed",
        message: `Purchase Completed`,
        html: `<p>Hello ${company.companyName}</p> 
                <p>Thank your for placing an order with LegalMO. We are pleased to confirm the receipt of your order </p>
                <p>Order details:</p>
                <p>Item(s):  </p>
                <p>Total Amount:</p>
                <p>Estimated Delivery Date:</p>
                <p>Your order is now being processed and will be completed between 10-14 working days. You will receive a notification once your order has been dropped on your dashboard.</p>
                <p>We appreciate the trust you have placed in us and aim to provide you with the highest quality of service. If you have any questions or need further assistance, please do not hesitate to contact our customer service team at bukola@legalmo.biz or 08137686118. Thank you for choosing LegalMO. We value your business and look forward to serving you again.</p>
                <p>Warm regards,</p>
                <p>LegalMO</p>
                <p>[Company contact details]</p>
                <p></p>
                `,
      });
      return res.status(201).json("Checkout successful");
    } else {
      res.status(400).send("Nothing in your cart");
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};
