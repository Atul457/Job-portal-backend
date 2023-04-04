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
const RESPONSE_MESSAGES = CONSTANTS.RESPONSE_MESSAGES;
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { error } = COMPANY_SCHEMAS.createCompanySchema.validate(req.body);
        if (error)
            throw error;
        let { company_name, company_location, _id: user_id } = req.body;
        if (!user_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        user_id = new ObjectId(user_id);
        const user = yield ((_a = collections.users) === null || _a === void 0 ? void 0 : _a.findOne({
            _id: user_id
        }));
        if (!user)
            throw ErrorHandlingService.unAuthorized({
                message: RESPONSE_MESSAGES.CAN_NOT_CREATE_COMPANY_USER_NOT_FOUND
            });
        const company = yield ((_b = collections.companies) === null || _b === void 0 ? void 0 : _b.insertOne({
            company_name,
            company_location,
            user_id,
            created_at: new Date(Date.now()).toUTCString(),
            updated_at: new Date(Date.now()).toUTCString()
        }));
        if (!(company === null || company === void 0 ? void 0 : company.acknowledged))
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        let resToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            message: RESPONSE_MESSAGES.COMPANY_CREATED
        });
        res.json(resToSend);
    }
    catch (error) {
        next(error);
    }
});
const getMyCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { _id: user_id } = req.body;
        if (!user_id)
            throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        const companies = (_d = yield ((_c = collections.companies) === null || _c === void 0 ? void 0 : _c.find({
            user_id: new ObjectId(user_id),
            deleted: {
                $not: {
                    $eq: true
                }
            }
        }, {
            projection: {
                _id: 1,
                created_at: 1,
                updated_at: 1,
                company_name: 1,
                company_location: 1
            }
        }).toArray())) !== null && _d !== void 0 ? _d : [];
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: companies
        });
        res.json(responseToSend);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { error } = COMPANY_SCHEMAS.getCompanySchema.validate({
            company_id: req.params.companyId
        });
        if (error)
            throw error;
        const company_id = req.params.companyId;
        const company = yield ((_e = collections.companies) === null || _e === void 0 ? void 0 : _e.findOne({
            _id: new ObjectId(company_id)
        }, {
            projection: {
                _id: 1,
                created_at: 1,
                updated_at: 1,
                company_name: 1,
                company_location: 1
            }
        }));
        if (!company)
            throw ErrorHandlingService.userNotFound({
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            });
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: company
        });
        return res.json(responseToSend);
    }
    catch (error) {
        next(error);
    }
});
const updateCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const { error } = COMPANY_SCHEMAS.updateCompanySchema.validate(req.body);
        if (error)
            throw error;
        const { company_name, company_id, company_location, _id: user_id } = req.body;
        const result = yield ((_f = collections.companies) === null || _f === void 0 ? void 0 : _f.findOneAndUpdate({
            _id: new ObjectId(company_id),
            user_id: new ObjectId(user_id)
        }, {
            $set: Object.assign(Object.assign(Object.assign({}, (company_name && { company_name })), (company_location && { company_location })), { updated_at: new Date(Date.now()).toUTCString() })
        }));
        const company = yield ((_g = collections.companies) === null || _g === void 0 ? void 0 : _g.findOne({
            _id: new ObjectId(company_id)
        }, {
            projection: {
                _id: 1,
                created_at: 1,
                updated_at: 1,
                company_name: 1,
                company_location: 1
            }
        }));
        if (!company || !result) {
            const responseToSend = apiUtils.generateRes({
                status: false,
                statusCode: 200,
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            });
            return res.json(responseToSend);
        }
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 404,
            message: RESPONSE_MESSAGES.COMPANY_UPDATED,
            data: Object.assign({}, company)
        });
        return res.json(responseToSend);
    }
    catch (error) {
        next(error);
    }
});
const deleteCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const { error } = COMPANY_SCHEMAS.deleteCompanySchema.validate(req.body);
        if (error)
            throw error;
        let { company_id } = req.body;
        company_id = new ObjectId(company_id);
        const result = yield ((_h = collections.companies) === null || _h === void 0 ? void 0 : _h.updateOne({
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
        }));
        if (!(result === null || result === void 0 ? void 0 : result.matchedCount)) {
            const responseToSend = apiUtils.generateRes({
                status: false,
                statusCode: 200,
                message: RESPONSE_MESSAGES.COMPANY_NOT_FOUND
            });
            return res.json(responseToSend);
        }
        if (result.modifiedCount) {
            const responseToSend = apiUtils.generateRes({
                status: true,
                statusCode: 404,
                message: RESPONSE_MESSAGES.COMPANY_DELETED
            });
            return res.json(responseToSend);
        }
        throw new Error(RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
    }
    catch (error) {
        next(error);
    }
});
export const companyController = {
    getCompany,
    updateCompany,
    createCompany,
    deleteCompany,
    getMyCompanies,
};
//# sourceMappingURL=company.controller.js.map