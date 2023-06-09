/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient } from "mongodb";
import { envConfig } from "./env.config.js";
import type * as mongoTypes from "mongodb";

// Types
import { IMongoCollection, IConnectToDbFn } from "../utils/types.js";

// Contants
import { CONSTANTS } from "../utils/constants.js";

// Holds all the collections
const collections: IMongoCollection = {};

/**
 * @info Creates connection to mongo db
 */
const connectMongoDB: IConnectToDbFn = async () => {
  console.log("Establishing mongo db connection...");

  try {
    const client: mongoTypes.MongoClient = new MongoClient(
      envConfig.MONGODB_CONNECTION_STR
    );
    await client.connect();

    const db: mongoTypes.Db = client.db(envConfig.MONGO_DB_NAME);

    const usersCollection: mongoTypes.Collection = db.collection(
      CONSTANTS.TABLES.USERS
    );

    const companiesCollection: mongoTypes.Collection = db.collection(
      CONSTANTS.TABLES.COMPANIES
    );

    const jobsCollection: mongoTypes.Collection = db.collection(
      CONSTANTS.TABLES.JOBS
    );

    const appliedJobsCollection: mongoTypes.Collection = db.collection(
      CONSTANTS.TABLES.JOBS_APPLIED
    )

    const notificationsCollection: mongoTypes.Collection = db.collection(
      CONSTANTS.TABLES.NOTIFICATIONS
    );

    collections.jobs = jobsCollection;
    collections.users = usersCollection;
    collections.companies = companiesCollection;
    collections.jobsApplied = appliedJobsCollection;
    collections.notifications = notificationsCollection;

    console.log("MongoDb database connected");

    return { status: true };

  } catch (error: any) {

    console.log(error?.message ?? error);

    return {
      status: false,
      message:
        error?.mesage ?? CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
};

export { collections };
export default connectMongoDB;
