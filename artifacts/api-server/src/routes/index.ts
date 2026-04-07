import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appointmentsRouter from "./appointments";
import patientsRouter from "./patients";
import blogRouter from "./blog";
import faqsRouter from "./faqs";
import symptomsRouter from "./symptoms";
import servicesRouter from "./services";
import enquiriesRouter from "./enquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(appointmentsRouter);
router.use(patientsRouter);
router.use(blogRouter);
router.use(faqsRouter);
router.use(symptomsRouter);
router.use(servicesRouter);
router.use(enquiriesRouter);

export default router;
