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

// export const checkout = async (req, res) => {
//   try {
//     const company = await Company.findById(req.userId);
//     if (!company) {
//       return res
//         .status(404)
//         .send({ message: "Unauthorized!, You must be a company" });
//     }

//     const companyId = req.userId;
//     const cart = await Cart.findOne({ companyId }).populate(
//       "companyId products"
//     );

//     if (cart === null || !cart.products || cart.products.length === 0) {
//       return res.status(400).send("Nothing in your cart");
//     }

//     // Iterate through cart products and save as jobs
//     const jobsPromises = cart.products.map(async (product) => {
//       const newJob = new Job({
//         companyId: req.userId,
//         productId: product.productId,
//         companyDetail: product.detail,
//         companyFile: product.file,
//         adminDetail: "",
//         adminFile: "",
//         lawyerRequestedDetail: "",
//         companyFileName: product.fileName,
//         adminFileName: "",
//       });

//       await newJob.save();
//       console.log("Job saved");
//     });

//     // Wait for all jobs to be saved before proceeding
//     await Promise.all(jobsPromises);

//     // Clear the cart after saving jobs
//     await Cart.deleteMany({ companyId });

//     const productIden = cart.products[0].productId.toHexString();
//     const product = await Product.findById(productIden);
//     const productNaming = product.productName;

//     function generateUniqueTransactionReference() {
//       // Get current timestamp in milliseconds
//       const timestamp = new Date().getTime();

//       // Generate a random string (you can use a library for this for better randomness)
//       const randomString =
//         Math.random().toString(36).substring(2, 15) +
//         Math.random().toString(36).substring(2, 15);

//       // Combine timestamp and random string to create a unique reference
//       const uniqueReference = `txn-${timestamp}-${randomString}`;

//       return uniqueReference;
//     }

//     // Example usage
//     const uniqueTransactionReference = generateUniqueTransactionReference();
//     console.log(uniqueTransactionReference);

//     // Initiate Flutterwave payment
//     const response = await got
//       .post("https://api.flutterwave.com/v3/payments", {
//         headers: {
//           Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//         },
//         json: {
//           tx_ref: generateUniqueTransactionReference(),
//           amount: cart.bill,
//           currency: "NGN",
//           redirect_url: "https://www.legalmo.biz/",
//           // redirect_url: "YOUR_REDIRECT_URL",
//           meta: {
//             consumer_id: req.userId,
//             consumer_mac: "92a3-912ba-1192a",
//           },
//           customer: {
//             email: company.officialEmail,
//             phoneNumber: company.phoneNumber, // Update with the actual phone number
//             name: company.name, // Update with the actual name
//           },
//           // customizations: {
//           //   title: "Pied Piper Payments",
//           //   logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
//           // },
//         },
//       })
//       .json();

//     console.log(response);

//     // Redirect the user to the payment link
//     // window.location.href = response.data.link;

//     // Save the Flutterwave transaction details in your database
//     const transactionDetails = new Transaction({
//       ref: response.tx_ref,
//       amount: cart.bill,
//       currency: "NGN", // Update with the actual currency
//       status: "pending", // You may set an initial status based on your needs
//     });
//     await transactionDetails.save();
//     return res
//       .status(201)
//       .json({ status: "success", paymentLink: response.data.link });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//     // return res.status(500).send("Failed to initiate payment");
//   }
// };

// const secretHash = process.env.FLW_SECRET_HASH; // Set your secret hash

// // Webhook Handling (with secret hash implementation)
// export const flutterwaveWebhook = async (req, res) => {
//   // app.post('/flutterwave-webhook', (req, res) => {
//   try {
//     // Check for the signature if a secret hash is specified
//     const signature = req.headers["verif-hash"];
//     if (secretHash && (!signature || signature !== secretHash)) {
//       // Invalid signature; discard the request
//       console.error("Invalid signature. Discarding request.");
//       return res.status(401).end();
//     }

//     const eventData = req.body;

//     // Retrieve the corresponding transaction in your database
//     const transactionDetails = await Transaction.findOne({
//       ref: eventData.tx_ref,
//     });

//     if (transactionDetails) {
//       // Update the transaction status based on eventData.status
//       transactionDetails.status = eventData.status;
//       await transactionDetails.save();

//       // If the payment is successful, send the purchase confirmation email
//       if (eventData.status === "successful") {
//         const company = await Company.findById(transactionDetails.consumer_id);
//         if (company) {
//           await sendEmail({
//             email: company.officialEmail,
//             subject: "Purchase Completed",
//             message: "Purchase Completed",
//             html: `<p>Hello</p>
//                    <p>Thank you for placing an order with LegalMO. We are pleased to confirm the receipt of your order.</p>
//                    <!-- Rest of your email content -->
//                    `,
//           });
//         }
//       }
//     }

//     res.status(200).end();
//   } catch (error) {
//     console.error("Error handling Flutterwave webhook:", error);
//     res.status(500).end();
//   }
// };

export const checkout = async (req, res) => {
  // ... (existing code)

  // Step 1: Assemble payment details
  const paymentDetails = {
    tx_ref: "hooli-tx-1920bbtytty",
    amount: cart.bill, // Use the total amount from your cart
    currency: "NGN",
    redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
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

    // Step 3: Redirect the user to the payment link
    res.redirect(response.data.link);
  } catch (err) {
    console.log(err.code);
    console.log(err.response.body);
    res.status(500).send("Failed to initiate payment");
  }
};

// export const checkout = async (req, res) => {
//   const company = await Company.findById(req.userId);
//   if (!company) {
//     res.status(404).send({ message: "Unauthorized!, You must be a company" });
//     return;
//   }
//   const companyId = req.userId;
//   const cart = await Cart.findOne({ companyId });
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
//       await sendEmail({
//         email: company.officialEmail,
//         subject: "Purchase Completed",
//         message: `Purchase Completed`,
//         html: `<p>Hello ${company.companyName}</p>
//                 <p>Thank your for placing an order with LegalMO. We are pleased to confirm the receipt of your order </p>
//                 <p>Order details:</p>
//                 <p>Item(s):  </p>
//                 <p>Total Amount:</p>

//                 <p>Your order is now being processed and will be completed between 10-14 working days. You will receive a notification once your order has been dropped on your dashboard.</p>
//                 <p>We appreciate the trust you have placed in us and aim to provide you with the highest quality of service. If you have any questions or need further assistance, please do not hesitate to contact our customer service team at bukola@legalmo.biz or 08094818884. Thank you for choosing LegalMO. We value your business and look forward to serving you again.</p>
//                 <p>Warm regards,</p>
//                 <p>LegalMO</p>

//                 `,
//       });

//       //monnify start
//       cart.paymentStatus = "success"; // Update based on Monnify response
//       cart.completedOn = new Date(); // Update based on Monnify response
//       cart.paymentReference = req.body.paymentResponse.reference; // Update based on Monnify response

//       await cart.save();
//       //  monify end
//       return res.status(201).json("Checkout successful");
//     } else {
//       res.status(400).send("Nothing in your cart");
//     }
//   } catch (error) {
//     //monnify start
//     console.error("Error processing payment:", error);
//     //monnify end
//     res.status(500).send("something went wrong");
//   }
// };
