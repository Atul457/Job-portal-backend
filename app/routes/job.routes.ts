// Third party
import express from "express";

// Controllers
import { jobController } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Constants
const jobRouter = express.Router();

// Routes
jobRouter.get("/getJobs", jobController.getJobs);
jobRouter.get("/getJob/:jobId", jobController.getJob);
jobRouter.get("/getMyJob/:jobId", authMiddleware, jobController.getMyJob);
jobRouter.get("/getJobsOfCompany/:companyId", authMiddleware, jobController.getJobsOfCompany);

jobRouter.post("/updateJob", authMiddleware, jobController.updateJob);
jobRouter.post("/deleteJob", authMiddleware, jobController.deleteJob);
jobRouter.post("/createJob", authMiddleware, jobController.createJob);


export { jobRouter };