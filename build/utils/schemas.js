// Third party imports
import Joi from "joi";
/**
 * @info Signup api schema
 */
const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(6).required(),
});
const schemas = {
    user: {
        signupSchema,
    },
};
export { schemas };
//# sourceMappingURL=schemas.js.map