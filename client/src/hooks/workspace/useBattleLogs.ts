import { useCallback, useState } from "react";
import type { BattleLog, BattleLogPayload, Mood } from "../../api/workspace.api";
import { workspaceApi } from "../../api/workspace.api";
import { toast } from "../../components/ui/Toast";
import { applyXpReward } from "../../lib/xp-reward";
import { getApiErrorMessage } from "../../lib/api-errors";
import { useAsyncQuery } from "../useAsyncQuery";

export interface BattleLogFormState {
  mood: Mood;
  completed: string;
  win: string;
  learned: string;
  bug: string;
  tomorrow: string;
}

export const EMPTY_BATTLE_LOG_FORM: BattleLogFormState = {
  mood: "GOOD",
  completed: "",
  win: "",
  learned: "",
  bug: "",
  tomorrow: "",
};

function formFromLog(log: BattleLog): BattleLogFormState {
  return {
    mood: log.mood,
    completed: log.completed ?? "",
    win: log.win ?? "",
    learned: log.learned ?? "",
    bug: log.bug ?? "",
    tomorrow: log.tomorrow ?? "",
  };
}

export function useBattleLogs() {
  const [todayLog, setTodayLog] = useState<BattleLog | null>(null);
  const [form, setForm] = useState<BattleLogFormState>(EMPTY_BATTLE_LOG_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchAll = useCallback(async () => {
    const [logs, today] = await Promise.all([
      workspaceApi.battleLogs.getAll(),
      workspaceApi.battleLogs.getToday(),
    ]);
    setTodayLog(today);
    setForm(today ? formFromLog(today) : EMPTY_BATTLE_LOG_FORM);
    return logs;
  }, []);

  const { data: logs, loading, reload, setData: setLogs } = useAsyncQuery(fetchAll, {
    errorMessage: "Failed to load battle logs",
  });

  const save = useCallback(
    async (payload: BattleLogPayload, hasContent: boolean) => {
      if (!hasContent) return false;

      setSaving(true);
      try {
        if (todayLog) {
          const { log, xpGained, dashboard } = await workspaceApi.battleLogs.update(
            todayLog.id,
            payload,
          );
          setTodayLog(log);
          setLogs((prev) => (prev ?? []).map((e) => (e.id === log.id ? log : e)));
          applyXpReward({ xpGained, dashboard });
          toast("Battle log updated");
        } else {
          const { log, xpGained, dashboard } = await workspaceApi.battleLogs.create(payload);
          setTodayLog(log);
          setLogs((prev) => [log, ...(prev ?? []).filter((e) => e.id !== log.id)]);
          setForm(formFromLog(log));
          applyXpReward({ xpGained, dashboard });
          toast("Battle logged!");
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        return true;
      } catch (err) {
        toast(getApiErrorMessage(err, "Failed to save battle log"), "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [todayLog, setLogs],
  );

  return {
    logs: logs ?? [],
    todayLog,
    form,
    setForm,
    loading,
    saving,
    saved,
    reload,
    save,
  };
}
