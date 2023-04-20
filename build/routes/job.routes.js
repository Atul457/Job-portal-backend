// Third party
import express from "express";
// Controllers
import { jobController } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
// Constants
const jobRouter = express.Router();
// Routes
jobRouter.get("/getJob/:jobId", jobController.getJob);
jobRouter.get("/getMyJob/:jobId", authMiddleware, jobController.getMyJob);
jobRouter.get("/getJobsOfCompany/:companyId", authMiddleware, jobController.getJobsOfCompany);
jobRouter.get("/getJobs", authMiddleware, jobController.getJobs);
jobRouter.post("/updateJob", authMiddleware, jobController.updateJob);
jobRouter.post("/deleteJob", authMiddleware, jobController.deleteJob);
jobRouter.post("/createJob", authMiddleware, jobController.createJob);
jobRouter.get("/applyForJob/:jobId", authMiddleware, jobController.applyForJob);
jobRouter.get("/getApplicantsOfJob/:jobId", authMiddleware, jobController.getApplicantsOfJob);
export { jobRouter };
//# sourceMappingURL=job.routes.js.map