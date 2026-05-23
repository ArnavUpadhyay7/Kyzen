import { workspaceApi } from "../../api/workspace.api";
import { useWorkspaceCollection } from "./useWorkspaceCollection";

export function useWorkspaceProjects() {
  return useWorkspaceCollection({
    api: workspaceApi.projects,
    loadingMessage: "Loading projects…",
    messages: {
      loadError: "Failed to load projects",
      createSuccess: "Project created",
      updateSuccess: "Project updated",
      deleteSuccess: "Project deleted",
      saveError: "Failed to create project",
      deleteError: "Failed to delete project",
    },
  });
}
