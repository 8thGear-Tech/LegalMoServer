import { Product } from "../models/productmodel.js";
import { Cart } from "../models/cartmodel.js";
import { Company } from "../models/companymodel.js";
import { Transaction } from "../models/transactionmodel.js";
import { addCart, options } from "../utils/cartvalidation.js";
import { Job } from "../models/jobmodel.js";
import { sendEmail } from "../utils/email.js";
import got from "got";

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
  const { productId, quantity, file, detail, fileName } = req.body;
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
        item.file = file;
        item.fileName = fileName;
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        cart.products[productIndex] = item;
        await cart.save();
        const populateCart = await cart.populate(
          "companyId products.productId"
        );
        res.status(200).send(populateCart);
      } else {
        cart.products.push({
          productId,
          quantity,
          price,
          file,
          fileName,
          detail,
        });
        console.log(cart);
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        const populateCart = await cart.populate(
          "companyId products.productId"
        );
        res.status(200).send(populateCart);
      }
    } else {
      if (quantity > 0) {
        const newCart = await Cart.create({
          companyId,
          products: [{ productId, quantity, price, file, fileName, detail }],
          bill: quantity * price,
        });
        const populateCart = await newCart.populate(
          "companyId products.productId"
        );
        res.status(200).send(populateCart);
      } else {
        const newCart = await Cart.create({
          companyId,
          products: [{ productId, price, file, fileName, detail }],
          bill: price,
        });
        const populateCart = await newCart.populate(
          "companyId products.productId"
        );
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
      "companyId products.productId"
    );
    console.log(cart.length);
    if (cart === null || cart.length == undefined || cart.length == 0) {
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

// export const checkout = async (req, res) => {
//   const company = await Company.findById(req.userId);
//   if (!company) {
//     res.status(404).send({ message: "Unauthorized!, You must be a company" });
//     return;
//   }
//   const companyId = req.userId;
//   const companyName = company.companyName;
//   console.log(companyName);

//   const cart = await Cart.findOne({ companyId }).populate("companyId products");
//   console.log(cart);
//   try {
//     if (cart === null) {
//       res.status(400).send("Nothing in your cart");
//       return;
//     }
//     if (cart.products) {
//       cart.products.forEach((product) => {
//         const jobs = new Job({
//           companyId: req.userId,
//           productId: product.productId,
//           companyDetail: product.detail,
//           companyFile: product.file,
//           adminDetail: "",
//           adminFile: "",
//           lawyerRequestedDetail: "",
//           companyFileName: product.fileName,
//           adminFileName: "",
//         });
//         jobs
//           .save()
//           .then(() => {
//             console.log("Job saved");
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       });
//       await Cart.deleteMany({ companyId });
//       const productIden = cart.products[0].productId.toHexString();
//       const product = await Product.findById(productIden);
//       const productNaming = product.productName;
//       console.log(product);
//       console.log(productNaming);
//       console.log(cart.bill);
//       // html: `<p>Hello ${companyName}</p>
//       await sendEmail({
//         email: company.officialEmail,
//         subject: "Purchase Completed",
//         message: `Purchase Completed`,
//         html: `<p>Hello</p>
//                 <p>Thank your for placing an order with LegalMO. We are pleased to confirm the receipt of your order </p>
//                 <p>Order details:</p>
//                 <p>Item(s): ${productNaming} </p>
//                 <p>Total Amount: ${cart.bill}}</p>
//                 <p>Your order is now being processed and will be completed between 10-14 working days. You will receive a notification once your order has been dropped on your dashboard.</p>
//                 <p>We appreciate the trust you have placed in us and aim to provide you with the highest quality of service. If you have any questions or need further assistance, please do not hesitate to contact our customer service team at info@legalmo.biz or 08094818884. Thank you for choosing LegalMO. We value your business and look forward to serving you again.</p>
//                 <p>Warm regards,</p>
//                 <p>LegalMO</p>
//                 <p></p>
//                 `,
//       });
//       return res.status(201).json("Checkout successful");
//     } else {
//       res.status(400).send("Nothing in your cart");
//     }
//   } catch (error) {
//     res.status(500).send("something went wrong");
//   }
// };

//current up

export const checkout = async (req, res) => {
  const company = await Company.findById(req.userId);
  if (!company) {
    res.status(404).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  const companyId = req.userId;
  const companyName = company.companyName;
  console.log(companyName);

  const cart = await Cart.findOne({ companyId }).populate("companyId products");
  console.log(cart);
  try {
    if (cart === null) {
      res.status(400).send("Nothing in your cart");
      return;
    }
    if (cart.products) {
      // ... (your existing code)

      // Step 1: Assemble payment details
      const paymentDetails = {
        tx_ref: "hooli-tx-1920bbtytty",
        amount: cart.bill.toString(), // Assuming cart.bill is the total amount
        currency: "NGN",
        redirect_url:
          "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
        meta: {
          consumer_id: 23,
          consumer_mac: "92a3-912ba-1192a",
        },
        customer: {
          email: "user@gmail.com",
          phonenumber: "080****4528",
          name: "Yemi Desola",
        },
        customizations: {
          title: "Pied Piper Payments",
          logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
        },
      };

      // Step 2: Get a payment link
      try {
        const response = await got
          .post("https://api.flutterwave.com/v3/payments", {
            headers: {
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            },
            json: paymentDetails,
          })
          .json();

        // Extract the payment link from the response
        const paymentLink = response.data.link;

        // Redirect the user to the payment link
        return res.redirect(paymentLink);
      } catch (err) {
        console.error(err.code);
        console.error(err.response.body);
        // Handle errors appropriately
        return res.status(500).send("Failed to initiate payment");
      }
    } else {
      return res.status(400).send("Nothing in your cart");
    }
  } catch (error) {
    return res.status(500).send("something went wrong");
  }
};
