import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sensorRouter from "./sensor";
import weatherRouter from "./weather";
import recommendationRouter from "./recommendation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sensorRouter);
router.use(weatherRouter);
router.use(recommendationRouter);

export default router;
