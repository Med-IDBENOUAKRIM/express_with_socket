const Joi = require('joi');

exports.validateSignUpInputs = async (req, res, next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(4).max(50).required().messages({
                'string.empty': `name cannot be empty`,
                'string.min': `name must have a minimum length of {#limit}`,
                'any.required': `name is required`,
            }),
            email: Joi.string().email().required().messages({
                'any.required': 'Email is a required field',
                'string.email': 'Please enter a valid email'
            }),
            username: Joi.string().min(4).max(50).required().messages({
                'string.empty': `username cannot be empty`,
                'string.min': `username must have a minimum length of {#limit}`,
                'any.required': `username is required`,
            }),
            password: Joi.string().min(6).max(12).required().messages({
                'any.required': 'password is required',
                'string.min': 'The password must have a minimum length of {#limit}',
                'string.empty': `Password cannot be empty`,
            }),
        });
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(500).json({error: error.details[0].message})
    }
}


exports.validateSignInInputs = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'any.required': 'Email is a required field',
                'string.email': 'Please enter a valid email'
            }),
            password: Joi.string().min(6).max(50).required().messages({
                'any.required': 'password is required',
                'string.min': 'The password must have a minimum length of {#limit}',
                'string.empty': `Password cannot be empty`,
            }),
        });
        await schema.validateAsync(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ msg: err.details[0].message });
    }
}