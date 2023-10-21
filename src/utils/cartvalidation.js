import Joi from "joi";

export const addCart = Joi.object().keys({ 
    productId: Joi.string().required(),
    companyId: Joi.string(),
    quantity: Joi.number(),
    detail: Joi.string()
})

export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };
