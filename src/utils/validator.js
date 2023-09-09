import Joi from "joi";

export const adminRegister = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  name: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),

});

export const companyRegister = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  companyName: Joi.string().required(),
  contactName: Joi.string().required(),
  officeAddress: Joi.string().required(),
  industry: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),

});

export const lawyerRegister = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  name: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),
  scn: Joi.string().required(),
  areasOfPractise: Joi.array().items(Joi.string()).required(),
});


export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const AdminLogin = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
});

export const CompanyLogin = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
});

export const LawyerLogin = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
});

