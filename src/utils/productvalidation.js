import Joi from "joi";

export const productcreation = Joi.object().keys({
  productName: Joi.string().required(),
  adminId: Joi.string().required(),
  productPrice: Joi.number().required(),
  productDescription: Joi.string().required(),
  productImage: Joi.string().required(),
});

export const productupdate = Joi.object().keys({
  productName: Joi.string(),
  adminId: Joi.string(),
  productPrice: Joi.number(),
  productDescription: Joi.string(),
  productImage: Joi.string(),
});

export const paymentDetailss = Joi.object().keys({
  accountNumber: Joi.number(),
  accountName: Joi.string(),
  bank: Joi.string(),
});

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

//651433fee82718d40ee12fb4
//65143d6b818c5b8bae08b8b2
// For an Admin eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGIxYzhmOTBjNzBjMjgyMjIyY2FjZCIsImlhdCI6MTY5NTgyMDE0OSwiZXhwIjoxNzAzNTk2MTQ5fQ.PqEIaCKu2kT42n3TP0Yrskg1g_BGvjtJWs07FdzA0Ic

//  For a Company eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGVjMjA5NWIwODRhMmRlZGFkNzlkMyIsImlhdCI6MTY5NTgyMDg0OSwiZXhwIjoxNzAzNTk2ODQ5fQ.jZNbUhemxyaV7DpLwysUcqhXbELuomhccKmUcvURM80

//  For a lawyer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGVjM2Q5OTAwMWU0NTE4N2NiMzkzMyIsImlhdCI6MTY5NTgyMDk1OCwiZXhwIjoxNzAzNTk2OTU4fQ.Hrlm1V4QDy5CwUjVqPSMNO-0J3-0vVA9D95-EqTIqsM

// export const productSchemas = {

//     productcreation: Joi.object().keys({
//         productName: Joi.string().required(),
//         productPrice: Joi.number(),
//         productDescription: Joi.string().required(),
//         adminId: Joi.string().required(),
//         productImage:  Joi.string().required(),
//     })
// }
