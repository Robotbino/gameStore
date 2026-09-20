import api from "./api";
import type { RewardsSummary } from "../types/rewards";

// Mirrors RewardsController.java: GET /rewards/me.
export const rewardsService = {
  getMine: async (): Promise<RewardsSummary> => {
    const res = await api.get<RewardsSummary>("/rewards/me");
    return res.data;
  },
};
