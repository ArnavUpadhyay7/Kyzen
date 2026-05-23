import { workspaceApi } from "../../api/workspace.api";
import { useWorkspaceCollection } from "./useWorkspaceCollection";

export function useWorkspaceInspirations() {
  return useWorkspaceCollection({
    api: workspaceApi.inspirations,
    loadingMessage: "Loading inspiration…",
    messages: {
      loadError: "Failed to load inspiration",
      createSuccess: "Inspiration added",
      updateSuccess: "Inspiration updated",
      deleteSuccess: "Inspiration removed",
      saveError: "Failed to add inspiration",
      deleteError: "Failed to delete",
    },
  });
}
