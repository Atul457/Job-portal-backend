// Third party imports
import Joi from "joi";

/**
 * @info Signup api schema
 */
const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(10).required(),
  password: Joi.string().min(6).max(6).required()
});

/**
 * @info Signin api scheam
 */
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(6).required()
})

const schemas = {
  user: {
    signupSchema,
    signinSchema
  },
};

export { schemas };
