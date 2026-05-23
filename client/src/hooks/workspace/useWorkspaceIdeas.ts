import { workspaceApi } from "../../api/workspace.api";
import { useWorkspaceCollection } from "./useWorkspaceCollection";

export function useWorkspaceIdeas() {
  return useWorkspaceCollection({
    api: workspaceApi.ideas,
    loadingMessage: "Loading ideas…",
    messages: {
      loadError: "Failed to load ideas",
      createSuccess: "Idea saved",
      updateSuccess: "Idea updated",
      deleteSuccess: "Idea deleted",
      saveError: "Failed to save idea",
      deleteError: "Failed to delete idea",
    },
  });
}
