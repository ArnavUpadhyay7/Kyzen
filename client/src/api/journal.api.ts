import api from "../lib/axios";

export type Mood =
  | "LOCKED_IN"
  | "GOOD"
  | "TIRED"
  | "BURNED_OUT"
  | "DISTRACTED";

export interface JournalEntry {
  id: string;
  date: string;          // ISO datetime string from backend
  completed: string | null;
  distractedBy: string | null;
  biggestWin: string | null;
  tomorrowFocus: string | null;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertJournalPayload {
  completed?: string;
  distractedBy?: string;
  biggestWin?: string;
  tomorrowFocus?: string;
  mood?: Mood;
}

export const journalApi = {
  /** GET /journal — all entries, newest first */
  getAll: async (): Promise<JournalEntry[]> => {
    const res = await api.get<{ journals: JournalEntry[] }>("/journal");
    return res.data.journals;
  },

  /** GET /journal/today — today's entry or null */
  getToday: async (): Promise<JournalEntry | null> => {
    const res = await api.get<{ journal: JournalEntry | null }>("/journal/today");
    return res.data.journal;
  },

  /** POST /journal — create today's entry */
  create: async (payload: UpsertJournalPayload): Promise<JournalEntry> => {
    const res = await api.post<{ journal: JournalEntry }>("/journal", payload);
    return res.data.journal;
  },

  /** PATCH /journal/:id — update an existing entry */
  update: async (id: string, payload: UpsertJournalPayload): Promise<JournalEntry> => {
    const res = await api.patch<{ journal: JournalEntry }>(`/journal/${id}`, payload);
    return res.data.journal;
  },

  /** DELETE /journal/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/journal/${id}`);
  },
};