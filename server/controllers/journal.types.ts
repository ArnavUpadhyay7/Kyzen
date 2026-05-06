import { Mood } from "@prisma/client";

export const VALID_MOODS: Mood[] = [
  "LOCKED_IN",
  "GOOD",
  "TIRED",
  "BURNED_OUT",
  "DISTRACTED",
];

export interface UpsertJournalBody {
  completed?: string;
  distractedBy?: string;
  biggestWin?: string;
  tomorrowFocus?: string;
  mood?: Mood;
}