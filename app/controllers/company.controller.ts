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


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Constants
const COMPANY_SCHEMAS = schemas.company;
const RESPONSE_MESSAGES = CONSTANTS.RESPONSE_MESSAGES;

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


const createCompany = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = COMPANY_SCHEMAS.createCompanySchema.validate(req.body);

        if (error) throw error;

        let { company_name, company_location, _id: user_id } = req.body;

        if (!user_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

        user_id = new ObjectId(user_id);

        const user = await collections.users?.findOne({
            _id: user_id
        })

        if (!user)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.CAN_NOT_CREATE_COMPANY_USER_NOT_FOUND
            })

        const company = await collections.companies?.insertOne({
            company_name,
            company_location,
            user_id,
            created_at: new Date(Date.now()).toUTCString(),
            updated_at: new Date(Date.now()).toUTCString()
        })

        if (!company?.acknowledged)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)

        let resToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            message: RESPONSE_MESSAGES.COMPANY_CREATED
        })

        res.json(resToSend)

    } catch (error) {
        next(error)
    }

}

const getMyCompanies = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { _id: user_id } = req.body;

        if (!user_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

        const companies = await collections.companies?.find(
            {
                user_id: new ObjectId(user_id),
                deleted: {
                    $not: {
                        $eq: true
                    }
                }
            },
            {
                projection: {
                    _id: 1,
                    created_at: 1,
                    updated_at: 1,
                    company_name: 1,
                    company_location: 1
                }
            }
        ).toArray() ?? [];

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: companies
        })

        res.json(responseToSend);

    } catch (error) {
        console.log(error)
        next(error)
    }

}


const getCompany = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = COMPANY_SCHEMAS.getCompanySchema.validate({
            company_id: req.params.companyId
        });

        if (error) throw error;

        const company_id = req.params.companyId;

        const company = await collections.companies?.findOne({
            _id: new ObjectId(company_id)
        }, {
            projection: {
                _id: 1,
                created_at: 1,
                updated_at: 1,
                company_name: 1,
                company_location: 1
            }
        });

        if (!company)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            })

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: company
        })

        return res.json(responseToSend);


    } catch (error) {
        next(error)
    }

}


const updateCompany = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = COMPANY_SCHEMAS.updateCompanySchema.validate(req.body);

        if (error) throw error;

        const { company_name, company_id, company_location, _id: user_id } = req.body;

        const result = await collections.companies?.findOneAndUpdate(
            {
                _id: new ObjectId(company_id),
                user_id: new ObjectId(user_id)
            },
            {
                $set: {
                    ...(company_name && { company_name }),
                    ...(company_location && { company_location }),
                    updated_at: new Date(Date.now()).toUTCString()
                }
            }
        );

        const company = await collections.companies?.findOne({
            _id: new ObjectId(company_id)
        }, {
            projection: {
                _id: 1,
                created_at: 1,
                updated_at: 1,
                company_name: 1,
                company_location: 1
            }
        });

        if (!company || !result) {
            const responseToSend = apiUtils.generateRes({
                status: false,
                statusCode: 200,
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            })
            return res.json(responseToSend);
        }

        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 404,
            message: RESPONSE_MESSAGES.COMPANY_UPDATED,
            data: {
                ...company
            }
        })
        return res.json(responseToSend);

    } catch (error) {
        next(error)
    }

}

const deleteCompany = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { error } = COMPANY_SCHEMAS.deleteCompanySchema.validate(req.body);

        if (error) throw error;

        let { company_id } = req.body;

        company_id = new ObjectId(company_id);

        const result = await collections.companies?.updateOne({
            _id: company_id,
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
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            })
            return res.json(responseToSend);
        }

        if (result.modifiedCount) {
            const responseToSend = apiUtils.generateRes({
                status: true,
                statusCode: 404,
                message: RESPONSE_MESSAGES.COMPANY_DELETED
            })
            return res.json(responseToSend);
        }

        throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

    } catch (error) {
        next(error)
    }

}

export const companyController = {
    getCompany,
    updateCompany,
    createCompany,
    deleteCompany,
    getMyCompanies,
}