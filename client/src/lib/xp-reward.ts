import { mapDashboard, type RawDashboard } from "../api/dashboard.api";
import { useDashboardStore } from "../state/dashboard/usedashboardstore";

export interface XpRewardPayload {
  xpGained?: number;
  dashboard?: RawDashboard;
}

/** Apply server XP + refresh dashboard; triggers global animated badge. */
export function applyXpReward({ xpGained, dashboard }: XpRewardPayload): void {
  if (!xpGained || xpGained <= 0) return;
  useDashboardStore.getState().grantXp(
    xpGained,
    dashboard ? mapDashboard(dashboard) : undefined,
  );
}
