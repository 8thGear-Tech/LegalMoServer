import Joi from "joi";

export const productSchemas = { 

    productcreation: Joi.object().keys({ 
        productName: Joi.string().required(),
        productPrice: Joi.number(),
        productDescription: Joi.string().required(),
        adminId: Joi.string().required(),
        productImage:  Joi.string().required(),
    })
}




