import {User} from './../models/usermodel.js';

export const signup = async (req, res) => {
    try {
        const newUser = new User({
        companyName: req.body.companyName,
        contactName: req.body.contactName,
        officialEmail: req.body.officialEmail,
        contactPhone: req.body.contactPhone,
        officialAddress: req.body.officialAddress,
        });

        await newUser.save();

        res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
        });
    } catch (error) {
        res.status(400).json({
        status: 'fail',
        message: error.message,
        });
    }   
}