import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sensorRouter from "./sensor";
import weatherRouter from "./weather";
import recommendationRouter from "./recommendation";
import simulatorRouter from "./simulator";
import predictRouter from "./predict";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sensorRouter);
router.use(weatherRouter);
router.use(recommendationRouter);
router.use(simulatorRouter);
router.use(predictRouter);

export default router;
