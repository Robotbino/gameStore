// Mirrors the backend OrderResponse / CheckoutRequest records.
export type PaymentMethod = "CARD" | "STRIPE" | "PAYFLEX";

// gameId and imageUrl are null when the game has since been deleted; the
// title and price snapshot still stand.
export interface OrderItem {
  gameId: number | null;
  title: string;
  unitPrice: number;
  imageUrl: string | null;
}

export interface Order {
  id: number;
  subtotal: number;
  pointsRedeemed: number;
  discount: number;
  total: number;
  pointsEarned: number;
  // Balance after this order. Only meaningful on the checkout response.
  pointsBalance: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  status: "PAID";
  createdAt: string;
  items: OrderItem[];
  // Cart ids skipped because the user already owned them.
  alreadyOwned: number[];
}

export interface CheckoutRequest {
  gameIds: number[];
  paymentMethod: PaymentMethod;
  redeemPoints: boolean;
}
