import { Router } from "express";
import {
  createJournal,
  getJournals,
  getTodayJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journal.controller";

const router = Router();

// /today must be declared before /:id so Express doesn't swallow it as a param
router.get("/today",  getTodayJournal);

router.get("/",       getJournals);
router.post("/",      createJournal);
router.patch("/:id",  updateJournal);
router.delete("/:id", deleteJournal);

export default router;