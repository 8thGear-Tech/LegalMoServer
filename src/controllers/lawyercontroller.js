import { Lawyer } from "../models/lawyermodel.js";
import { paymentDetail, options } from "../utils/productvalidation.js";
import { sendEmail } from "../utils/email.js";

export const addPaymentDetails = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  const validate = paymentDetail.validate(req.body, options);
  if (validate.error) {
    const message = validate.error.details
      .map((detail) => detail.message)
      .join(",");
    return res.status(400).send({
      status: "fail",
      message,
    });
  }
  const { accountNumber, accountName, bank } = req.body;
  try {
    const isLawyerMailConfirmed = await Lawyer.findById(req.userId);
    if (!isLawyerMailConfirmed.isEmailConfirmed) {
      res
        .status(401)
        .send({ message: "Unauthorized!, Lawyer has not confirmed email" });
      return;
    }
    const lawyer = await Lawyer.findByIdAndUpdate(req.userId, {
      $push: {
        accountDetails: {
          accountNumber: accountNumber,
          accountName: accountName,
          bank: bank,
        },
      },
    });
    res.status(200).json({ lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editPaymentDetails = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  const { accountNumber, accountName, bank } = req.body;
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(req.userId, {
      $set: {
        accountDetails: {
          accountNumber: accountNumber,
          accountName: accountName,
          bank: bank,
        },
      },
    });
    res.status(200).json({ lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendOTP = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  try {
    const lawyer = await Lawyer.findById(req.userId);
    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log(OTP);
    await sendEmail({
      email: lawyer.officialEmail,
      subject: "OTP for updating payment details",
      message: `Your OTP is ${OTP}`,
      html: ` <p>Your OTP is ${OTP}</p>`,
    });
    await Lawyer.findByIdAndUpdate(req.userId, {
      updateOTP: OTP,
    });
    res.status(200).json({ message: "OTP sent successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmOTP = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  const { OTP } = req.body;
  try {
    const lawyer = await Lawyer.findById(req.userId);
    if (OTP === lawyer.updateOTP) {
      await Lawyer.findByIdAndUpdate(req.userId, {
        updateOTP: "",
      });
      res.status(200).json({ message: "OTP confirmed successfully" });
    } else {
      res.status(400).json({ message: "OTP is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(404).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  try {
    const lawyer = await Lawyer.findById(req.userId);
    res.status(200).json({ lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
