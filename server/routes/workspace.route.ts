import { Router } from "express";
import {
  createBattleLog,
  createIdea,
  createInspiration,
  createNote,
  createProject,
  deleteBattleLog,
  deleteIdea,
  deleteInspiration,
  deleteNote,
  deleteProject,
  getBattleLogs,
  getIdeas,
  getInspirations,
  getNotes,
  getProjects,
  getTodayBattleLog,
  updateBattleLog,
  updateIdea,
  updateInspiration,
  updateNote,
  updateProject,
} from "../controllers/workspace.controller";

const router = Router();

// Battle logs
router.get("/battle-logs/today", getTodayBattleLog);
router.get("/battle-logs", getBattleLogs);
router.post("/battle-logs", createBattleLog);
router.patch("/battle-logs/:id", updateBattleLog);
router.delete("/battle-logs/:id", deleteBattleLog);

// Ideas
router.get("/ideas", getIdeas);
router.post("/ideas", createIdea);
router.patch("/ideas/:id", updateIdea);
router.delete("/ideas/:id", deleteIdea);

// Projects
router.get("/projects", getProjects);
router.post("/projects", createProject);
router.patch("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Inspirations
router.get("/inspirations", getInspirations);
router.post("/inspirations", createInspiration);
router.patch("/inspirations/:id", updateInspiration);
router.delete("/inspirations/:id", deleteInspiration);

// Notes
router.get("/notes", getNotes);
router.post("/notes", createNote);
router.patch("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;
