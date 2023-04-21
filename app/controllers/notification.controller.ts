// Collections
import { collections } from "../configs/mongo.config.js";

// Third party
import * as Express from "express";

// Constants
import { CONSTANTS } from "../utils/constants.js";
import { apiUtils } from "../utils/api.util.js";
import { ObjectId } from "mongodb";


/**
 * @param userId Id of the user to whom to you want to send notification
 * @param message Message you want to send to the user
 * @info Insert data in notification table, else throws error 
 */
const sendNotification = async (ownerId: string, userId: string, jobId: string) => {

    try {
        if (!userId)
            throw new Error(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

        const res = await collections.notifications?.insertOne({
            job_id: new ObjectId(jobId),
            user_id: new ObjectId(userId),
            owner_id: new ObjectId(ownerId),
        });

        if (!res?.acknowledged)
            throw new Error(CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG);

    } catch (error) {
        return error;
    }

};


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/**
 * @TODO Document this 
 */
const getMyNotifications = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {

    try {

        const { _id: user_id } = req.body;

        const notifications = await collections.notifications?.aggregate([
            {
                $match: {
                    owner_id: new ObjectId(user_id)
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
        ]).toArray()


        const responseToSend = apiUtils.generateRes({
            status: true,
            statusCode: 200,
            data: notifications
        });

        res.json(responseToSend);

    } catch (error) {
        console.log(error)
        next(error);
    }

}

const notificationController = {
    sendNotification,
    getMyNotifications
};

export { notificationController };