// Third party
import express from "express";

// Controllers
import { companyController } from "../controllers/company.controller.js";

// Constants
const companyRouter = express.Router();

// Routes
companyRouter.get("/getCompany/:companyId", companyController.getCompany);
companyRouter.post("/updateCompany", companyController.updateCompany);
companyRouter.post("/deleteCompany", companyController.deleteCompany);
companyRouter.post("/createCompany", companyController.createCompany);
companyRouter.get("/getMyCompanies", companyController.getMyCompanies);


export { companyRouter };