import { Product } from "../models/productmodel.js";
import { Admin } from "../models/adminmodel.js";
import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import {
  productcreation,
  options,
  productupdate,
} from "../utils/productvalidation.js";

//cloudinary
import cloudinary from "../utils/cloudinary.js";

export const create = async (req, res) => {
  const validate = productcreation.validate(req.body, options);
  if (validate.error) {
    const message = validate.error.details
      .map((detail) => detail.message)
      .join(",");
    return res.status(400).send({
      status: "fail",
      message,
    });
  }

  const upload = async (req, res) => {
    const { originalname } = req.file;
    const fileExtension = originalname.split(".").pop(); // Extracting file extension
    const publicId = `${Date.now()}-${originalname.replace(
      `.${fileExtension}`,
      ""
    )}`;
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      public_id: publicId,
    });

    // const { originalname } = req.file;
    // const publicId = `${Date.now()}-${originalname}`;
    // const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //   public_id: publicId,
    // });

    if (uploadResult.secure_url) {
      // Use the secure_url to save the product image URL to the database
      req.body.productImage = uploadResult.secure_url;

      // Proceed with creating the product using the rest of the code
    } else {
      res.status(500).send({ error: "Failed to upload product image" });
    }
  };

  await upload(req, res);

  const {
    productName,
    productPrice,
    productDescription,
    // productImage
  } = req.body;
  const adminId = req.userId;
  // const _id = adminId;
  // const adminExists = await Admin.findOne({ _id });
  const adminExists = await Admin.findById(adminId);
  console.log(adminExists);
  if (adminExists) {
    try {
      const product = await Product.create({
        productName,
        productPrice,
        productDescription,
        adminId,

        productImage: req.body.productImage,
      });
      if (product) {
        return res.status(201).json({
          status: "success",
          data: product,
        });
      }
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  } else {
    res.status(400);
    throw new Error("Admin doesn't Exist");
  }
};
// export const create = async (req, res) => {
//   const validate = productcreation.validate(req.body, options);
//   if (validate.error) {
//     const message = validate.error.details
//       .map((detail) => detail.message)
//       .join(",");
//     return res.status(400).send({
//       status: "fail",
//       message,
//     });
//   }

//   //new
//   const upload = async (req, res) => {
//     const { originalname } = req.file;
//     const publicId = `${Date.now()}-${originalname}`;
//     const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//       public_id: publicId,
//     });

//     if (uploadResult.secure_url) {
//       // Use the secure_url to save the product image URL to the database
//       req.body.productImage = uploadResult.secure_url;

//       // Proceed with creating the product using the rest of the code
//     } else {
//       res.status(500).send({ error: "Failed to upload product image" });
//     }
//   };
//   // const productUpload = await cloudinary.uploader.upload(req.file.path);
//   // Upload the file to Cloudinary while preserving the filename and generating a unique public ID
//   // const productUpload = await cloudinary.uploader.upload(req.file.path, {
//   //   use_filename: true, // Preserve original filename
//   //   public_id: (filename) => {
//   //     const timestamp = Date.now();
//   //     return `${filename}-${timestamp}`; // Generates unique public ID based on filename and timestamp
//   //   },
//   //   secure_url: {
//   //     template: `https://res.cloudinary.com/${
//   //       cloudinary.config().cloud_name
//   //     }/${(file) => file.public_id}.${(file) => file.format}`, // Use the public_id and format properties of the uploaded file
//   //   },
//   // secure_url: {
//   //   template: `https://res.cloudinary.com/${cloudinary.config().cloud_name}/${
//   //     productUpload.public_id
//   //   }${req.file.extension}`,
//   // },
//   // });

//   const {
//     productName,
//     productPrice,
//     productDescription,
//     // productImage
//   } = req.body;
//   const adminId = req.userId;
//   // const _id = adminId;
//   // const adminExists = await Admin.findOne({ _id });
//   const adminExists = await Admin.findById(adminId);
//   console.log(adminExists);
//   if (adminExists) {
//     try {
//       const product = await Product.create({
//         productName,
//         productPrice,
//         productDescription,
//         adminId,
//         // productImage,
//         productImage: productUpload.secure_url,
//         // productImage_id: productUpload.public_id,
//       });
//       if (product) {
//         return res.status(201).json({
//           status: "success",
//           data: product,
//         });
//       }
//     } catch (error) {
//       res.send(error);
//       console.log(error);
//     }
//   } else {
//     res.status(400);
//     throw new Error("Admin doesn't Exist");
//   }
// };

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const updateProduct = async (req, res) => {
//   const validate = productupdate.validate(req.body, options);
//   if (validate.error) {
//     const message = validate.error.details
//       .map((detail) => detail.message)
//       .join(",");
//     return res.status(400).send({
//       status: "fail",
//       message,
//     });
//   }
//   const { productName, productPrice, productDescription, productImage } =
//     req.body;
//   const adminExists = await Admin.findById(req.userId);
//   if (adminExists) {
//     try {
//       const updateProduct = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: { productName, productPrice, productImage, productDescription },
//         },
//         { new: true }
//       );
//       res.status(200).json(updateProduct);
//       if (!updateProduct)
//         throw Error("Something went wrong while updating the product");
//     } catch {
//       res.send(error);
//       console.log(error);
//     }
//   } else {
//     res.status(403);
//     throw new Error("You are not authorized to update this product");
//   }
// };
export const updateProduct = async (req, res) => {
  const validate = productupdate.validate(req.body, options);
  if (validate.error) {
    const message = validate.error.details
      .map((detail) => detail.message)
      .join(",");
    return res.status(400).send({
      status: "fail",
      message,
    });
  }

  const adminExists = await Admin.findById(req.userId);
  if (adminExists) {
    try {
      // Check if there's a file in the request
      if (req.file) {
        const { originalname } = req.file;
        const fileExtension = originalname.split(".").pop();
        const publicId = `${Date.now()}-${originalname.replace(
          `.${fileExtension}`,
          ""
        )}`;

        // Await the file upload to complete
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          public_id: publicId,
        });

        if (uploadResult.secure_url) {
          // If image upload is successful, update the product image URL
          req.body.productImage = uploadResult.secure_url;
        } else {
          return res
            .status(500)
            .send({ error: "Failed to upload product image" });
        }
      }

      const { productName, productPrice, productDescription, productImage } =
        req.body;

      const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: { productName, productPrice, productDescription, productImage },
        },
        { new: true }
      );

      if (updateProduct) {
        return res.status(200).json({
          status: "success",
          data: updateProduct,
        });
      } else {
        throw new Error("Something went wrong while updating the product");
      }
    } catch (error) {
      res.status(500).send(error.message);
      console.log(error);
    }
  } else {
    res.status(403);
    throw new Error("You are not authorized to update this product");
  }
};

export const deleteProduct = async (req, res) => {
  const adminExists = await Admin.findById(req.userId);
  if (adminExists) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) throw Error("No product found!");
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ msg: err });
    }
  } else {
    res.status(403);
    throw new Error("You are not authorized to delete this product");
  }
};
export const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw Error("No product found!");
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};
