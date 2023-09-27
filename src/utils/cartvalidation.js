import Joi from "joi";

export const addCart = Joi.object().keys({ 
    productId: Joi.string().required(),
    companyId: Joi.string().required(),
    quantity: Joi.number().required(),
})

export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };
