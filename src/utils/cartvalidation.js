import Joi from "joi";

export const addCart = Joi.object().keys({
  productId: Joi.string().required(),
  quantity: Joi.number(),
  detail: Joi.string(),
  file: Joi.string(),
});

export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };
