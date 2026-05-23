import { workspaceApi } from "../../api/workspace.api";
import { useWorkspaceCollection } from "./useWorkspaceCollection";

export function useWorkspaceNotes() {
  return useWorkspaceCollection({
    api: workspaceApi.notes,
    loadingMessage: "Loading notes…",
    messages: {
      loadError: "Failed to load notes",
      createSuccess: "Note saved",
      updateSuccess: "Note updated",
      deleteSuccess: "Note deleted",
      saveError: "Failed to save note",
      deleteError: "Failed to delete note",
    },
  });
}
