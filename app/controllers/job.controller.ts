// Types
import type * as Express from "express";

// Constants
import { CONSTANTS } from "../utils/constants.js";

// Third party
import { schemas } from "../utils/schemas.js";

// Configs
import { collections } from "../configs/mongo.config.js";

// Services
import { ErrorHandlingService } from "../services/errorHandler.service.js";

// Utils
import { apiUtils } from "../utils/api.util.js";
import { ObjectId } from "mongodb";
import { ICompanyExistsFn } from "../utils/types.js";


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Constants
const COMPANY_SCHEMAS = schemas.company;
const PAGINATION_SCHEMAS = schemas.pagination;
const JOB_SCHEMAS = schemas.job;
const RESPONSE_MESSAGES = CONSTANTS.RESPONSE_MESSAGES;

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


const createJob = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = JOB_SCHEMAS.createJobSchema.validate(req.body);

        if (error) throw error;

        let { job_name, job_salary, company_id, job_description, _id: user_id } = req.body;

        if (!company_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

        user_id = new ObjectId(user_id);
        company_id = new ObjectId(company_id);

        const company = await companyExists(company_id, user_id)

        if (!company.status)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            })

        const jobToCreate = {
            job_name,
            reviews: 0,
            job_salary,
            job_description,
            created_at: new Date(Date.now()).toUTCString(),
            updated_at: new Date(Date.now()).toUTCString()
        }

        const job = await collections.jobs?.insertOne({
            company_id,
            ...jobToCreate,
        });

        if (!job?.acknowledged)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)

        let resToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            message: RESPONSE_MESSAGES.JOB_CREATED,
            data: jobToCreate
        })

        res.json(resToSend)

    } catch (error) {
        next(error)
    }

}

const getJobsOfCompany = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = COMPANY_SCHEMAS.getCompanySchema.validate({
            company_id: req.params.companyId
        });

        if (error) throw error;

        const { _id: user_id } = req.body;
        const company_id = req.params.companyId;

        const company = await companyExists(company_id, user_id)

        if (!company.status)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            })

        const jobs = await collections.jobs?.find(
            {
                company_id: new ObjectId(company_id),
                deleted: {
                    $not: {
                        $eq: true
                    }
                }
            },
            {
                projection: {
                    company_id: 0
                }
            }
        ).toArray() ?? [];

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: jobs
        })

        res.json(responseToSend);

    } catch (error) {
        console.log(error)
        next(error)
    }

}

const getJobs = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    let q: null | string = null;
    let page: null | number = 1;
    let limit: null | number = 20;
    let order: null | string = "asc";
    let lowestSalary: null | number = null;
    let highestSalary: null | number = null;

    try {

        const { error } = PAGINATION_SCHEMAS.paginatedSearch.validate(req.query);

        if (error) throw error;

        q = (req.query?.q ?? q) as string;
        order = (req.query?.order ?? order) as string;
        page = parseInt((req.query?.page ?? page) as string);
        limit = parseInt((req.query?.limit ?? limit) as string);

        if (req.query?.ls) {
            lowestSalary = parseInt((req.query?.ls) as string);
        }

        if (req.query?.hs) {
            highestSalary = parseInt((req.query?.hs) as string);
        }

        if (page < 1) page = 1;

        const jobs = await collections.jobs?.aggregate([
            {
                $match: {
                    deleted: {
                        $not: {
                            $eq: true
                        }
                    },
                    ...((lowestSalary || highestSalary) && {
                        job_salary: {
                            ...({
                                ...(lowestSalary && { $gte: lowestSalary }),
                                ...(highestSalary && { $lte: highestSalary }),
                            })
                        }
                    }),
                    ...(q && { job_name: new RegExp(q, "gi") }),
                }
            },
            { $skip: limit * page > 1 ? page - 1 : page },
            {
                $sort: {
                    created_at: order === "asc" ? 1 : -1,
                    updated_at: order === "asc" ? 1 : -1
                }
            },
            { $limit: limit },
            {
                $lookup: {
                    from: CONSTANTS.TABLES.COMPANIES,
                    localField: "company_id",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $unwind: "$company"
            },
            {
                $addFields: {
                    company_name: "$company.company_name",
                    company_location: "$company.company_location"
                }
            },
            {
                $project: {
                    "company": 0,
                    "deleted": 0,
                    "company_id": 0,
                }
            },
        ]).toArray() ?? [];

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: jobs
        })

        res.json(responseToSend);

    } catch (error) {
        console.log(error)
        next(error)
    }

}


const getJob = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = JOB_SCHEMAS.getJob.validate(req.params);

        if (error) throw error;

        const job_id = req.params.jobId;

        const job = await collections.jobs?.aggregate([
            {
                $match: {
                    _id: new ObjectId(job_id),
                    "company.deleted": {
                        $not: {
                            $eq: true
                        }
                    },
                    "deleted": {
                        $not: {
                            $eq: true
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: CONSTANTS.TABLES.COMPANIES,
                    localField: "company_id",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $unwind: "$company"
            },
            {
                $lookup: {
                    from: CONSTANTS.TABLES.USERS,
                    localField: "company.user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    "company_id": 0,
                    "company.deleted": 0,
                    "company.user_id": 0,
                    "user.password": 0,
                }
            }]).toArray();


        if (!job)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            })

        // Increment review
        await collections.jobs?.findOneAndUpdate(
            {
                _id: new ObjectId(job_id)
            },
            {
                $inc: {
                    reviews: 1
                }
            }
        )

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: job
        })

        return res.json(responseToSend);


    } catch (error) {
        next(error)
    }

}


const getMyJob = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = JOB_SCHEMAS.getJob.validate(req.params);

        if (error) throw error;

        const job_id = req.params.jobId;

        const job = await collections.jobs?.findOne({
            _id: new ObjectId(job_id)
        }, {
            projection: {
                company_id: 0
            }
        });

        if (!job)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            })

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: job
        })

        return res.json(responseToSend);


    } catch (error) {
        next(error)
    }

}


const updateJob = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = JOB_SCHEMAS.updateJob.validate(req.body);

        if (error) throw error;

        const { job_id, job_name, job_salary, job_description, _id: user_id } = req.body;

        const jobBelongsToUser = await findJob(user_id, job_id);
        const jobDoesNotBelongsToUser = !jobBelongsToUser || (jobBelongsToUser && !jobBelongsToUser?.length);

        if (jobDoesNotBelongsToUser)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            })

        const updateJob = await collections.jobs?.findOneAndUpdate(
            {
                _id: new ObjectId(job_id)
            },
            {
                $set: {
                    ...(job_name && { job_name }),
                    ...(job_salary && { job_salary }),
                    ...(job_description && { job_description }),
                    updated_at: new Date(Date.now()).toUTCString()
                }
            },
            {
                projection: {
                    company_id: 0,
                },
                returnDocument: "after"
            }
        );

        if (!updateJob?.value)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: updateJob.value
        })

        return res.json(responseToSend);

    } catch (error) {
        next(error)
    }

}

const deleteJob = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = JOB_SCHEMAS.deleteJob.validate(req.body);

        if (error) throw error;

        const { job_id, _id: user_id } = req.body;

        const jobBelongsToUser = await findJob(user_id, job_id);
        const jobDoesNotBelongsToUser = !jobBelongsToUser || (jobBelongsToUser && !jobBelongsToUser?.length);

        if (jobDoesNotBelongsToUser)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            })

        const result = await collections.jobs?.updateOne({
            _id: new ObjectId(job_id),
            deleted: {
                $not: {
                    $eq: true
                }
            }
        }, {
            $set: {
                "deleted": true
            }
        })

        if (!result?.matchedCount) {
            const responseToSend = apiUtils.generateRes({
                status: false,
                statusCode: 200,
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            })
            return res.json(responseToSend);
        }

        if (result.modifiedCount) {
            const responseToSend = apiUtils.generateRes({
                status: true,
                statusCode: 404,
                message: RESPONSE_MESSAGES.JOB_DELETED
            })
            return res.json(responseToSend);
        }

        throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

    } catch (error) {
        console.log(error)
        next(error)
    }

}

const companyExists: ICompanyExistsFn = async (company_id, userId) => {

    const company = await collections.companies?.findOne({
        _id: new ObjectId(company_id),
        user_id: new ObjectId(userId),
        deleted: {
            $not: {
                $eq: true
            }
        }
    })

    return {
        status: company ? true : false,
        doc: company ? company : null
    }

}


const findJob = async (user_id: string, job_id: string) => {
    const job = await collections.jobs?.aggregate([
        {
            $match: {
                _id: new ObjectId(job_id),
                "deleted": {
                    $not: {
                        $eq: true
                    }
                }
            }
        },
        {
            $lookup: {
                from: CONSTANTS.TABLES.COMPANIES,
                localField: "company_id",
                foreignField: "_id",
                as: "company"
            }
        },
        {
            $unwind: "$company"
        },
        {
            $match: {
                "company.deleted": {
                    $not: {
                        $eq: true
                    }
                },
            }
        },
        {
            $lookup: {
                from: CONSTANTS.TABLES.USERS,
                localField: "company.user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $match: {
                "user._id": new ObjectId(user_id)
            }
        },
        {
            $project: {
                "company_id": 0,
                "company.deleted": 0,
                "company.user_id": 0,
                "user.password": 0,
            }
        }
    ]).toArray();
    return job;
}


export const jobController = {
    getJob,
    getJobs,
    getMyJob,
    createJob,
    updateJob,
    deleteJob,
    getJobsOfCompany,
}