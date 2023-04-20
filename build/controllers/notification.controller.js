var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Collections
import { collections } from "../configs/mongo.config.js";
// Constants
import { CONSTANTS } from "../utils/constants.js";
import { apiUtils } from "../utils/api.util.js";
import { ObjectId } from "mongodb";
/**
 * @param userId Id of the user to whom to you want to send notification
 * @param message Message you want to send to the user
 * @info Insert data in notification table, else throws error
 */
const sendNotification = (userId, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!userId)
            throw new Error(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
        const res = yield ((_a = collections.notifications) === null || _a === void 0 ? void 0 : _a.insertOne({
            user_id: new ObjectId(userId),
            job_id: new ObjectId(jobId)
        }));
        if (!(res === null || res === void 0 ? void 0 : res.acknowledged))
            throw new Error(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);
    }
    catch (error) {
        return error;
    }
});
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/**
 * @TODO Document this
 */
const getMyNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { _id: user_id } = req.body;
        console.log({ user_id });
        const notifications = yield ((_b = collections.notifications) === null || _b === void 0 ? void 0 : _b.aggregate([
            {
                $match: {
                    user_id: new ObjectId(user_id)
                }
            },
            {
                $lookup: {
                    from: CONSTANTS.TABLES.JOBS,
                    localField: "job_id",
                    foreignField: "_id",
                    as: "job"
                }
            },
            {
                $unwind: "$job"
            },
            {
                $lookup: {
                    from: CONSTANTS.TABLES.USERS,
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    doc: {
                        message: {
                            $concat: ["$user.name", " has applied for ", "$job.job_name"]
                        },
                        user_id: "$user._id",
                        job_id: "$job._id"
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$doc"
                }
            }
        ]).toArray());
        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: notifications
        });
        res.json(responseToSend);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const notificationController = {
    sendNotification,
    getMyNotifications
};
export { notificationController };
//# sourceMappingURL=notification.controller.js.map