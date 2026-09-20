import { useCallback, useEffect, useState } from "react";
import { rewardsService } from "../services/rewardsService";
import type { RewardsSummary } from "../types/rewards";

/** The signed-in user's points balance and recent ledger. */
export function useRewards() {
  const [rewards, setRewards] = useState<RewardsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setRewards(await rewardsService.getMine());
      setError(null);
    } catch {
      setError("Failed to load your rewards.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { rewards, isLoading, error, reload };
}
