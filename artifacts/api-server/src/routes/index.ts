import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sensorRouter from "./sensor";
import weatherRouter from "./weather";
import recommendationRouter from "./recommendation";
import simulatorRouter from "./simulator";
import predictRouter from "./predict";
import growthStageRouter from "./growth-stage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sensorRouter);
router.use(weatherRouter);
router.use(recommendationRouter);
router.use(simulatorRouter);
router.use(predictRouter);
router.use(growthStageRouter);

export default router;
