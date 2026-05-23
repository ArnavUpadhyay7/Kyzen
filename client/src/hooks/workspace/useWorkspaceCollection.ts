import { useCallback, useState } from "react";
import type { RawDashboard } from "../../api/dashboard.api";
import { toast } from "../../components/ui/Toast";
import { applyXpReward } from "../../lib/xp-reward";
import { getApiErrorMessage } from "../../lib/api-errors";
import { useAsyncQuery } from "../useAsyncQuery";

export interface WorkspaceCollectionMessages {
  loadError: string;
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  saveError: string;
  deleteError: string;
}

interface WorkspaceCreateResult<T> {
  item: T;
  xpGained: number;
  dashboard?: RawDashboard;
}

interface WorkspaceCollectionApi<T, TCreate, TUpdate> {
  getAll: () => Promise<T[]>;
  create: (payload: TCreate) => Promise<WorkspaceCreateResult<T>>;
  update: (id: string, payload: TUpdate) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

interface UseWorkspaceCollectionOptions<T, TCreate, TUpdate> {
  api: WorkspaceCollectionApi<T, TCreate, TUpdate>;
  messages: WorkspaceCollectionMessages;
  loadingMessage?: string;
}

export function useWorkspaceCollection<
  T extends { id: string },
  TCreate,
  TUpdate = Partial<TCreate>,
>({
  api,
  messages,
  loadingMessage = "Loading…",
}: UseWorkspaceCollectionOptions<T, TCreate, TUpdate>) {
  const { data: items, loading, reload, setData } = useAsyncQuery(api.getAll, {
    errorMessage: messages.loadError,
  });

  const [saving, setSaving] = useState(false);

  const create = useCallback(
    async (payload: TCreate) => {
      setSaving(true);
      try {
        const { item, xpGained, dashboard } = await api.create(payload);
        setData((prev) => [item, ...(prev ?? [])]);
        applyXpReward({ xpGained, dashboard });
        toast(messages.createSuccess);
        return item;
      } catch (err) {
        toast(getApiErrorMessage(err, messages.saveError), "error");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [api, messages, setData],
  );

  const update = useCallback(
    async (id: string, payload: TUpdate) => {
      setSaving(true);
      try {
        const updated = await api.update(id, payload);
        setData((prev) => (prev ?? []).map((item) => (item.id === id ? updated : item)));
        toast(messages.updateSuccess);
        return updated;
      } catch (err) {
        toast(getApiErrorMessage(err, messages.saveError), "error");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [api, messages, setData],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await api.delete(id);
        setData((prev) => (prev ?? []).filter((item) => item.id !== id));
        toast(messages.deleteSuccess);
        return true;
      } catch (err) {
        toast(getApiErrorMessage(err, messages.deleteError), "error");
        return false;
      }
    },
    [api, messages, setData],
  );

  return {
    items: items ?? [],
    loading,
    loadingMessage,
    saving,
    reload,
    setItems: setData,
    create,
    update,
    remove,
  };
}
