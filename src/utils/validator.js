import Joi from "joi";

export const adminRegister = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  name: Joi.string().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
  passwordConfirm: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),
});

export const companyRegister = Joi.object().keys({
  companyName: Joi.string().required(),
  contactName: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .message("Invalid phone number format")
    .required(),
  officialEmail: Joi.string().email().trim().lowercase().required(),
  officeAddress: Joi.string().required(),
  cac: Joi.string()
    .regex(/^RC-\d{6}$/) // Use the regular expression pattern for CAC numbers
    .message("Invalid CAC registration number format"),
  industry: Joi.string().required(),
  cac: Joi.string(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
  passwordConfirm: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .message("Invalid phone number format")
    .required(),
});

export const lawyerRegister = Joi.object().keys({
  name: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .message("Invalid phone number format")
    .required(),
  officialEmail: Joi.string().email().trim().lowercase().required(),
  lawFirmName: Joi.string(),
  lawFirmAddress: Joi.string().required(),
  scn: Joi.string().required(),
  cac: Joi.string(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
  passwordConfirm: Joi.string().required(),
  areasOfPractise: Joi.array().items(Joi.string().valid('Maritime', 'International Trade and Investment', 'Tax Practise', 'Aviation and Space', 'Sports', 'Entertainment', 'Technology')).required(),
});

export const AdminLogin = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
});

export const CompanyLogin = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
});

export const LawyerLogin = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
});

export const ValidateforgotPassword = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase().required(),
});

export const ValidateResetPassword = Joi.object().keys({
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length."
    )
    .required(),
  passwordConfirm: Joi.string().required(),
});

export const validateLawyerProfileUpdate = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase(),
  scn: Joi.string(),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format'),
  yourBio: Joi.string(),
  yearOfCall: Joi.string().pattern(/^[0-9]{4}$/).message('Invalid year format'),
  alternativeEmailAddress: Joi.string().email().trim().lowercase(),
  areasOfPractise: Joi.array().items(Joi.string().valid('Maritime', 'International Trade and Investment', 'Tax Practise', 'Aviation and Space', 'Sports', 'Entertainment', 'Technology')),
  profileImage: Joi.string()
});

export const validateAdminProfileUpdate = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase(),
  name: Joi.string(),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format'),
  profileImage: Joi.string(),
});

export const validateCompanyProfileUpdate = Joi.object().keys({
  officialEmail: Joi.string().email().trim().lowercase(),
  website: Joi.string(),
  yourBio: Joi.string(),
  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format'),
  officeAddress: Joi.string(),
  alternativeEmailAddress: Joi.string().email().trim().lowercase(),
  profileImage: Joi.string(),
});

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
