import {Product} from '../models/productmodel.js';
import {Admin } from '../models/adminmodel.js';
import {Company} from '../models/companymodel.js'
import {Lawyer} from '../models/lawyermodel.js'
import { productcreation, options } from '../utils/productvalidation.js';


export const create = async (req, res) => {
    const validate = productcreation.validate(req.body, options)
        if (validate.error) {
            const message = validate.error.details.map((detail) => detail.message).join(',');
                return res.send({
                    status: 'fail',
                    message,
                })
          }
    const { productName,  productPrice, productDescription, adminId, productImage } = req.body;
    if (!productName || !productPrice || !productDescription || !adminId || !productImage) {
      console.log("Invalid data passed into request");
     return res.sendStatus(400);      
     }
     const _id = adminId
     const adminExists = await Admin.findOne({ _id });
     console.log(adminExists);
     if (adminExists) {
        try {
            const product = await Product.create({
                productName,        
                productPrice,
                productDescription,
                adminId,
                productImage
            });
            if (product) {
                return res.status(201).json({
                    status: 'success',
                    data: product
                });
            }
            
            
        } catch (error) {
            res.send(error)
            console.log(error)
        }
     }
     else{
        res.status(400);
        throw new Error("Admin doesn't Exist");
     }    
}

export const getProducts = async (req, res) => {
   try{
       const products = await Product.find();
       res.status(200).json({products})
   }
   catch(err){res.status(500).json({error :  err.message})}
    }

export const updateProduct = async (req, res) => {
    const { productName, productPrice, productDescription, adminId } = req.body;
    const _id = adminId
    const adminExists = await Admin.findOne({ _id });
    if (adminExists) {
        try {
            const updateProduct = await Product.findByIdAndUpdate(req.params.id, 
                  {$set: {productName, productPrice, productDescription}}, {new: true});
              res.status(200).json(updateProduct);
              if(!updateProduct) throw Error('Something went wrong while updating the product');
          }
          catch{
              res.send(error)
              console.log(error)
          }   
    }
    else{
        res.status(403);
        throw new Error("You are not authorized to update this product");
    }
        
}

export const deleteProduct = async (req, res) => {
    const { adminId } = req.body;
    const _id = adminId
    const adminExists = await Admin.findOne({ _id });
    if (adminExists) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if(!product) throw Error('No product found!');
            res.status(200).json({success: true});
        }
        catch(err){
            res.status(400).json({msg: err})
        }
    }
    else{
        res.status(403);
        throw new Error("You are not authorized to delete this product");
    }
    
}

export const singleProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) throw Error('No product found!');
        res.status(200).json(product);
    }
    catch(err){
        res.status(400).json({msg: err})
    }
}
     