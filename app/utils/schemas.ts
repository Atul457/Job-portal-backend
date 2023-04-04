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
 * @info Signin api schema
 */
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(6).required()
})

/**
 * @info UpdateProfie api schema
 */
const updateProfileSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email().optional(),
  phone: Joi.string().length(10).optional(),
  _id: Joi.string().length(24).hex().optional(),
})

/**
 * @info Logout api schema
 */
const logoutSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional(),
})

/**
 * @info UpdatePasword api schema
 */
const updatePasswordSchema = Joi.object({
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional(),
  old_password: Joi.string().min(6).max(6).required(),
  new_password: Joi.string().min(6).max(6).required(),
})

/**
 * @info getProfie api schema
 */
const getProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional()
})

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * @info Create company schema
 */
const createCompanySchema = Joi.object({
  email: Joi.string().email().optional(),
  company_name: Joi.string().min(2).required(),
  _id: Joi.string().length(24).hex().optional(),
  company_location: Joi.string().min(2).required(),
})

/**
 * @info Get companies schema
 */
const getCompanySchema = Joi.object({
  email: Joi.string().email().optional(),
  company_id: Joi.string().length(24).hex(),
  _id: Joi.string().length(24).hex().optional(),
})

/**
 * @info Update company schema
 */
const updateCompanySchema = Joi.object({
  company_name: Joi.string().min(2).optional(),
  company_location: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional(),
  company_id: Joi.string().length(24).hex().required()
})

/**
 * @info Delete company schema
 */
const deleteCompanySchema = Joi.object({
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional(),
  company_id: Joi.string().length(24).hex().required()
})


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


/**
 * @info Create job schema
 */
const createJobSchema = Joi.object({
  email: Joi.string().email().optional(),
  job_name: Joi.string().min(2).required(),
  job_salary: Joi.number().min(100).required(),
  _id: Joi.string().length(24).hex().optional(),
  job_description: Joi.string().min(80).required(),
  company_id: Joi.string().length(24).hex().required(),
})


/**
 * @info Get jobs related to a company schema
 */
const getJobsOfCompany = Joi.object({
  company_id: Joi.string().length(24).hex().required()
})

/**
 * @info get my job schema
 */
const getJob = Joi.object({
  jobId: Joi.string().length(24).hex().required()
})

/**
 * @info deleteJob schema
 */
const deleteJob = Joi.object({
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional(),
  job_id: Joi.string().length(24).hex().required(),
})

/**
 * @info Updatejob schema
 */
const updateJob = Joi.object({
  job_id: Joi.string().length(24).hex().required(),
  job_name: Joi.string().min(2).optional(),
  job_salary: Joi.number().min(100).optional(),
  job_description: Joi.string().min(80).optional(),
  email: Joi.string().email().optional(),
  _id: Joi.string().length(24).hex().optional()
})

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


/**
 * @info Get company schema
 */
const paginatedSearch = Joi.object({
  q: Joi.string().optional(),
  ls: Joi.number().optional(),
  hs: Joi.number().optional(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  order: Joi.string().valid("asc", "desc").optional(),
})


const schemas = {
  user: {
    signupSchema,
    signinSchema,
    logoutSchema,
    getProfileSchema,
    updateProfileSchema,
    updatePasswordSchema,
  },
  company: {
    getCompanySchema,
    createCompanySchema,
    updateCompanySchema,
    deleteCompanySchema
  },
  job: {
    getJob,
    updateJob,
    deleteJob,
    getJobsOfCompany,
    createJobSchema,
    createCompanySchema,
    updateCompanySchema,
    deleteCompanySchema
  },
  pagination: {
    paginatedSearch: paginatedSearch
  }
};

export { schemas };
