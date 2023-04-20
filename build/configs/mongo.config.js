var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient } from "mongodb";
import { envConfig } from "./env.config.js";
// Contants
import { CONSTANTS } from "../utils/constants.js";
// Holds all the collections
const collections = {};
/**
 * @info Creates connection to mongo db
 */
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("Establishing mongo db connection...");
    try {
        const client = new MongoClient(envConfig.MONGODB_CONNECTION_STR);
        yield client.connect();
        const db = client.db(envConfig.MONGO_DB_NAME);
        const usersCollection = db.collection(CONSTANTS.TABLES.USERS);
        const companiesCollection = db.collection(CONSTANTS.TABLES.COMPANIES);
        const jobsCollection = db.collection(CONSTANTS.TABLES.JOBS);
        const appliedJobsCollection = db.collection(CONSTANTS.TABLES.JOBS_APPLIED);
        const notificationsCollection = db.collection(CONSTANTS.TABLES.NOTIFICATIONS);
        collections.jobs = jobsCollection;
        collections.users = usersCollection;
        collections.companies = companiesCollection;
        collections.jobsApplied = appliedJobsCollection;
        collections.notifications = notificationsCollection;
        console.log("MongoDb database connected");
        return { status: true };
    }
    catch (error) {
        console.log((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
        return {
            status: false,
            message: (_b = error === null || error === void 0 ? void 0 : error.mesage) !== null && _b !== void 0 ? _b : CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
});
export { collections };
export default connectMongoDB;
//# sourceMappingURL=mongo.config.js.map