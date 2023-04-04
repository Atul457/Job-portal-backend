var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Constants
const COMPANY_SCHEMAS = schemas.company;
const PAGINATION_SCHEMAS = schemas.pagination;
const JOB_SCHEMAS = schemas.job;
const RESPONSE_MESSAGES = CONSTANTS.RESPONSE_MESSAGES;
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const createJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error } = JOB_SCHEMAS.createJobSchema.validate(req.body);
        if (error)
            throw error;
        let { job_name, job_salary, company_id, job_description, _id: user_id } = req.body;
        if (!company_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        user_id = new ObjectId(user_id);
        company_id = new ObjectId(company_id);
        const company = yield companyExists(company_id, user_id);
        if (!company.status)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            });
        const jobToCreate = {
            job_name,
            reviews: 0,
            job_salary,
            job_description,
            created_at: new Date(Date.now()).toUTCString(),
            updated_at: new Date(Date.now()).toUTCString()
        };
        const job = yield ((_a = collections.jobs) === null || _a === void 0 ? void 0 : _a.insertOne(Object.assign({ company_id }, jobToCreate)));
        if (!(job === null || job === void 0 ? void 0 : job.acknowledged))
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        let resToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            message: RESPONSE_MESSAGES.JOB_CREATED,
            data: jobToCreate
        });
        res.json(resToSend);
    }
    catch (error) {
        next(error);
    }
});
const getJobsOfCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const { error } = COMPANY_SCHEMAS.getCompanySchema.validate({
            company_id: req.params.companyId
        });
        if (error)
            throw error;
        const { _id: user_id } = req.body;
        const company_id = req.params.companyId;
        const company = yield companyExists(company_id, user_id);
        if (!company.status)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            });
        const jobs = (_c = yield ((_b = collections.jobs) === null || _b === void 0 ? void 0 : _b.find({
            company_id: new ObjectId(company_id),
            deleted: {
                $not: {
                    $eq: true
                }
            }
        }, {
            projection: {
                company_id: 0
            }
        }).toArray())) !== null && _c !== void 0 ? _c : [];
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: jobs
        });
        res.json(responseToSend);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    let q = null;
    let page = 1;
    let limit = 20;
    let order = "asc";
    let lowestSalary = null;
    let highestSalary = null;
    try {
        const { error } = PAGINATION_SCHEMAS.paginatedSearch.validate(req.query);
        if (error)
            throw error;
        q = ((_e = (_d = req.query) === null || _d === void 0 ? void 0 : _d.q) !== null && _e !== void 0 ? _e : q);
        order = ((_g = (_f = req.query) === null || _f === void 0 ? void 0 : _f.order) !== null && _g !== void 0 ? _g : order);
        page = parseInt(((_j = (_h = req.query) === null || _h === void 0 ? void 0 : _h.page) !== null && _j !== void 0 ? _j : page));
        limit = parseInt(((_l = (_k = req.query) === null || _k === void 0 ? void 0 : _k.limit) !== null && _l !== void 0 ? _l : limit));
        if ((_m = req.query) === null || _m === void 0 ? void 0 : _m.ls) {
            lowestSalary = parseInt(((_o = req.query) === null || _o === void 0 ? void 0 : _o.ls));
        }
        if ((_p = req.query) === null || _p === void 0 ? void 0 : _p.hs) {
            highestSalary = parseInt(((_q = req.query) === null || _q === void 0 ? void 0 : _q.hs));
        }
        if (page < 1)
            page = 1;
        const jobs = (_s = yield ((_r = collections.jobs) === null || _r === void 0 ? void 0 : _r.aggregate([
            {
                $match: Object.assign(Object.assign({ deleted: {
                        $not: {
                            $eq: true
                        }
                    } }, ((lowestSalary || highestSalary) && {
                    job_salary: Object.assign({}, (Object.assign(Object.assign({}, (lowestSalary && { $gte: lowestSalary })), (highestSalary && { $lte: highestSalary }))))
                })), (q && { job_name: new RegExp(q, "gi") }))
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
                $project: {
                    company_id: 0
                }
            }
        ]).toArray())) !== null && _s !== void 0 ? _s : [];
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: jobs
        });
        res.json(responseToSend);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u;
    try {
        const { error } = JOB_SCHEMAS.getJob.validate(req.params);
        if (error)
            throw error;
        const job_id = req.params.jobId;
        const job = yield ((_t = collections.jobs) === null || _t === void 0 ? void 0 : _t.aggregate([
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
            }
        ]).toArray());
        if (!job)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });
        // Increment review
        yield ((_u = collections.jobs) === null || _u === void 0 ? void 0 : _u.findOneAndUpdate({
            _id: new ObjectId(job_id)
        }, {
            $inc: {
                reviews: 1
            }
        }));
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: job
        });
        return res.json(responseToSend);
    }
    catch (error) {
        next(error);
    }
});
const getMyJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _v;
    try {
        const { error } = JOB_SCHEMAS.getJob.validate(req.params);
        if (error)
            throw error;
        const job_id = req.params.jobId;
        const job = yield ((_v = collections.jobs) === null || _v === void 0 ? void 0 : _v.findOne({
            _id: new ObjectId(job_id)
        }, {
            projection: {
                company_id: 0
            }
        }));
        if (!job)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: job
        });
        return res.json(responseToSend);
    }
    catch (error) {
        next(error);
    }
});
const updateJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _w;
    try {
        const { error } = JOB_SCHEMAS.updateJob.validate(req.body);
        if (error)
            throw error;
        const { job_id, job_name, job_salary, job_description, _id: user_id } = req.body;
        const jobBelongsToUser = yield findJob(user_id, job_id);
        const jobDoesNotBelongsToUser = !jobBelongsToUser || (jobBelongsToUser && !(jobBelongsToUser === null || jobBelongsToUser === void 0 ? void 0 : jobBelongsToUser.length));
        if (jobDoesNotBelongsToUser)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });
        const updateJob = yield ((_w = collections.jobs) === null || _w === void 0 ? void 0 : _w.findOneAndUpdate({
            _id: new ObjectId(job_id)
        }, {
            $set: Object.assign(Object.assign(Object.assign(Object.assign({}, (job_name && { job_name })), (job_salary && { job_salary })), (job_description && { job_description })), { updated_at: new Date(Date.now()).toUTCString() })
        }, {
            projection: {
                company_id: 0,
            },
            returnDocument: "after"
        }));
        if (!(updateJob === null || updateJob === void 0 ? void 0 : updateJob.value))
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: updateJob.value
        });
        return res.json(responseToSend);
    }
    catch (error) {
        next(error);
    }
});
const deleteJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _x;
    try {
        const { error } = JOB_SCHEMAS.deleteJob.validate(req.body);
        if (error)
            throw error;
        const { job_id, _id: user_id } = req.body;
        const jobBelongsToUser = yield findJob(user_id, job_id);
        const jobDoesNotBelongsToUser = !jobBelongsToUser || (jobBelongsToUser && !(jobBelongsToUser === null || jobBelongsToUser === void 0 ? void 0 : jobBelongsToUser.length));
        if (jobDoesNotBelongsToUser)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });
        const result = yield ((_x = collections.jobs) === null || _x === void 0 ? void 0 : _x.updateOne({
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
        }));
        if (!(result === null || result === void 0 ? void 0 : result.matchedCount)) {
            const responseToSend = apiUtils.generateRes({
                status: false,
                statusCode: 200,
                message: RESPONSE_MESSAGES.JOB_NOT_FOUND
            });
            return res.json(responseToSend);
        }
        if (result.modifiedCount) {
            const responseToSend = apiUtils.generateRes({
                status: true,
                statusCode: 404,
                message: RESPONSE_MESSAGES.JOB_DELETED
            });
            return res.json(responseToSend);
        }
        throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const companyExists = (company_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _y;
    const company = yield ((_y = collections.companies) === null || _y === void 0 ? void 0 : _y.findOne({
        _id: new ObjectId(company_id),
        user_id: new ObjectId(userId),
        deleted: {
            $not: {
                $eq: true
            }
        }
    }));
    return {
        status: company ? true : false,
        doc: company ? company : null
    };
});
const findJob = (user_id, job_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _z;
    const job = yield ((_z = collections.jobs) === null || _z === void 0 ? void 0 : _z.aggregate([
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
    ]).toArray());
    return job;
});
export const jobController = {
    getJob,
    getJobs,
    getMyJob,
    createJob,
    updateJob,
    deleteJob,
    getJobsOfCompany,
};
//# sourceMappingURL=job.controller.js.map