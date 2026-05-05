import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask,
} from "../controllers/task.controller";

const router = Router();

router.post("/",             createTask);
router.get("/",              getTasks);
router.patch("/:id",         updateTask);
router.delete("/:id",        deleteTask);
router.post("/:id/complete", completeTask);

export default router;