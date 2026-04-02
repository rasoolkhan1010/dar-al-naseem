import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quizRouter from "./quiz";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quizRouter);
router.use(notificationsRouter);

export default router;
