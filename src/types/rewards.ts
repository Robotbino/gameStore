// Mirrors the backend RewardsSummaryResponse / RewardTransactionResponse records.
export type RewardReason = "EARN" | "REDEEM" | "ADJUST";

export interface RewardTransaction {
  id: number;
  // Positive for EARN, negative for REDEEM.
  delta: number;
  balanceAfter: number;
  reason: RewardReason;
  orderId: number | null;
  createdAt: string;
}

export interface RewardsSummary {
  balance: number;
  // The balance expressed in Rands at the redemption rate.
  worth: number;
  transactions: RewardTransaction[];
}
