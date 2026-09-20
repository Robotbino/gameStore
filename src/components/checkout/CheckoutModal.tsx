import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useAuth } from "../../hooks/useAuth";
import { orderService } from "../../services/orderService";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  canRedeem,
  discountFor,
  formatPoints,
  formatRand,
  pointsEarned,
  pointsToRedeem,
  randsFor,
} from "../../utils/rewards";
import type { Game } from "../../types/game";
import type { Order, PaymentMethod } from "../../types/order";
import { MastercardMark, PayflexMark, StripeMark, VisaMark } from "../payment/PaymentMarks";

interface CheckoutModalProps {
  open: boolean;
  items: Game[];
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

type Step = "review" | "pay" | "processing" | "success";

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

const EMPTY_CARD: CardDetails = { number: "", name: "", expiry: "", cvc: "" };
const PROCESSING_MS = 1200;
// Any card number ending in these digits is declined locally, before any
// request, so the failure path can be exercised in the demo.
const DECLINE_SUFFIX = "0002";

const TITLES: Record<Step, string> = {
  review: "Review order",
  pay: "Payment",
  processing: "Processing",
  success: "You're all set",
};

const BRAND: Record<PaymentMethod, string> = {
  CARD: "your bank",
  STRIPE: "Stripe",
  PAYFLEX: "Payflex",
};

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function CheckoutModal({ open, items, onClose, onSuccess }: CheckoutModalProps) {
  const { currentUser } = useAuth();

  const [step, setStep] = useState<Step>("review");
  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [redeem, setRedeem] = useState(false);
  const [card, setCard] = useState<CardDetails>(EMPTY_CARD);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  // Card details are demo input and never outlive the dialog.
  useEffect(() => {
    if (!open) return;
    setStep("review");
    setMethod("CARD");
    setRedeem(false);
    setCard(EMPTY_CARD);
    setError(null);
    setOrder(null);
  }, [open]);

  const balance = currentUser?.points ?? 0;
  const subtotal = items.reduce((sum, game) => sum + game.price, 0);
  const discount = redeem ? discountFor(balance, subtotal) : 0;
  const total = subtotal - discount;
  const earn = pointsEarned(total);
  const redeemable = canRedeem(balance) && subtotal > 0;

  function handleClose() {
    if (step === "processing") return;
    if (step === "success" && order) {
      onSuccess(order);
      return;
    }
    onClose();
  }

  async function pay() {
    if (method === "CARD") {
      const digits = card.number.replace(/\D/g, "");
      if (digits.length < 16 || card.expiry.length < 5 || card.cvc.length < 3) {
        setError("Complete your card details to continue.");
        return;
      }
      if (digits.endsWith(DECLINE_SUFFIX)) {
        setError("Card declined (demo). Try any other number.");
        return;
      }
    }

    setError(null);
    setStep("processing");
    try {
      const [result] = await Promise.all([
        orderService.checkout({
          gameIds: items.map((g) => g.id),
          paymentMethod: method,
          redeemPoints: redeem,
        }),
        wait(PROCESSING_MS),
      ]);
      setOrder(result);
      setStep("success");
    } catch (err) {
      setError(getApiErrorMessage(err, "Payment failed. Please try again."));
      setStep("pay");
    }
  }

  return (
    <Modal open={open} title={TITLES[step]} onClose={handleClose} size="wide">
      <div className="checkout" data-step={step}>
        {step !== "success" && (
          <div className="checkout-top">
            <ol className="checkout-steps" aria-label="Checkout progress">
              <li className={step === "review" ? "is-current" : "is-done"}>Review</li>
              <li className={step === "pay" || step === "processing" ? "is-current" : ""}>Pay</li>
              <li>Done</li>
            </ol>
            <span className="checkout-demo-badge">
              <i className="fa-solid fa-flask" aria-hidden="true" />
              Demo checkout, no money moves
            </span>
          </div>
        )}

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}

        {step === "review" && (
          <ReviewStep
            items={items}
            balance={balance}
            redeem={redeem}
            redeemable={redeemable}
            onToggleRedeem={() => setRedeem((r) => !r)}
            subtotal={subtotal}
            discount={discount}
            total={total}
            earn={earn}
            onContinue={() => setStep("pay")}
          />
        )}

        {step === "pay" && (
          <PayStep
            method={method}
            onMethod={setMethod}
            card={card}
            onCard={setCard}
            total={total}
            onBack={() => setStep("review")}
            onPay={pay}
          />
        )}

        {step === "processing" && (
          <div className="checkout-processing" role="status" aria-live="polite">
            <div className="checkout-processing-icon">
              <i className="fa-solid fa-lock" aria-hidden="true" />
            </div>
            <p className="checkout-processing-text">Contacting {BRAND[method]}…</p>
            <div className="checkout-shimmer" aria-hidden="true" />
          </div>
        )}

        {step === "success" && order && <SuccessStep order={order} onDone={() => onSuccess(order)} />}
      </div>
    </Modal>
  );
}

interface ReviewStepProps {
  items: Game[];
  balance: number;
  redeem: boolean;
  redeemable: boolean;
  onToggleRedeem: () => void;
  subtotal: number;
  discount: number;
  total: number;
  earn: number;
  onContinue: () => void;
}

function ReviewStep(props: ReviewStepProps) {
  const { items, balance, redeem, redeemable, onToggleRedeem, subtotal, discount, total, earn } = props;
  const potentialDiscount = discountFor(balance, subtotal);

  return (
    <>
      <ul className="checkout-lines">
        {items.map((game) => (
          <li key={game.id}>
            <img src={game.imageUrl} alt="" />
            <span className="checkout-line-title">{game.title}</span>
            <span className="checkout-line-price">{formatRand(game.price)}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="rewards-toggle"
        role="switch"
        aria-checked={redeem}
        disabled={!redeemable}
        onClick={onToggleRedeem}
      >
        <span className="rewards-toggle-icon">
          <i className="fa-solid fa-coins" aria-hidden="true" />
        </span>
        <span className="rewards-toggle-text">
          {redeemable ? (
            <>
              <strong>
                Use {formatPoints(pointsToRedeem(potentialDiscount))} points
                <span aria-hidden="true"> → </span>
                <span className="visually-hidden">for </span>
                {formatRand(potentialDiscount)} off
              </strong>
              <small>You have {formatPoints(balance)} points worth {formatRand(randsFor(balance))}</small>
            </>
          ) : (
            <>
              <strong>Rewards locked</strong>
              <small>Earn 100 points to unlock R 1.00 off. You have {formatPoints(balance)}.</small>
            </>
          )}
        </span>
        <span className="rewards-toggle-track" aria-hidden="true">
          <span className="rewards-toggle-thumb" />
        </span>
      </button>

      <dl className="checkout-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatRand(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="is-discount">
            <dt>Rewards discount</dt>
            <dd>− {formatRand(discount)}</dd>
          </div>
        )}
        <div className="is-total">
          <dt>Total</dt>
          <dd>{formatRand(total)}</dd>
        </div>
      </dl>

      <div className="checkout-earn">
        <span className="points-chip">
          <i className="fa-solid fa-star" aria-hidden="true" />+{formatPoints(earn)} pts
        </span>
        <span>You'll earn these on this order</span>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn-primary" onClick={props.onContinue}>
          Continue to payment
        </button>
      </div>
    </>
  );
}

interface PayStepProps {
  method: PaymentMethod;
  onMethod: (m: PaymentMethod) => void;
  card: CardDetails;
  onCard: (c: CardDetails) => void;
  total: number;
  onBack: () => void;
  onPay: () => void;
}

function PayStep({ method, onMethod, card, onCard, total, onBack, onPay }: PayStepProps) {
  const instalment = total / 4;

  return (
    <>
      <div className="pay-methods" role="radiogroup" aria-label="Payment method">
        <button
          type="button"
          role="radio"
          aria-checked={method === "CARD"}
          className="pay-method"
          onClick={() => onMethod("CARD")}
        >
          <span className="pay-method-marks">
            <VisaMark />
            <MastercardMark />
          </span>
          <span className="pay-method-label">Card</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={method === "STRIPE"}
          className="pay-method"
          onClick={() => onMethod("STRIPE")}
        >
          <span className="pay-method-marks">
            <StripeMark />
          </span>
          <span className="pay-method-label">Stripe</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={method === "PAYFLEX"}
          className="pay-method"
          onClick={() => onMethod("PAYFLEX")}
        >
          <span className="pay-method-marks">
            <PayflexMark />
          </span>
          <span className="pay-method-label">4 × {formatRand(instalment)}</span>
        </button>
      </div>

      {method === "CARD" ? (
        <CardForm card={card} onCard={onCard} />
      ) : (
        <p className="pay-redirect-note">
          <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          You'd be redirected to {BRAND[method]} to finish paying. This demo completes it for you.
          {method === "PAYFLEX" && " Four interest-free instalments, first one today."}
        </p>
      )}

      <div className="modal-footer">
        <button type="button" className="btn-outline" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn-primary pay-button" onClick={onPay}>
          <i className="fa-solid fa-lock" aria-hidden="true" />
          Pay {formatRand(total)}
        </button>
      </div>
    </>
  );
}

function CardForm({ card, onCard }: { card: CardDetails; onCard: (c: CardDetails) => void }) {
  const digits = card.number.replace(/\D/g, "");
  const preview = (digits + "••••••••••••••••").slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");

  return (
    <div className="pay-card">
      <div className="pay-card-preview" aria-hidden="true">
        <div className="pay-card-preview-top">
          <span className="pay-card-chip" />
          <span className="pay-card-brand">
            {digits.startsWith("5") ? <MastercardMark /> : <VisaMark />}
          </span>
        </div>
        <div className="pay-card-number">{preview}</div>
        <div className="pay-card-preview-bottom">
          <span>{card.name.trim() ? card.name.toUpperCase() : "YOUR NAME"}</span>
          <span>{card.expiry || "MM/YY"}</span>
        </div>
      </div>

      <div className="form-grid pay-form">
        <div className="form-field">
          <label htmlFor="card-number">Card number</label>
          <input
            id="card-number"
            inputMode="numeric"
            autoComplete="off"
            placeholder="4242 4242 4242 4242"
            value={card.number}
            onChange={(e) => onCard({ ...card, number: formatCardNumber(e.target.value) })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="card-name">Name on card</label>
          <input
            id="card-name"
            autoComplete="off"
            placeholder="A. Gamer"
            value={card.name}
            onChange={(e) => onCard({ ...card, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="card-expiry">Expiry</label>
            <input
              id="card-expiry"
              inputMode="numeric"
              autoComplete="off"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={(e) => onCard({ ...card, expiry: formatExpiry(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label htmlFor="card-cvc">CVC</label>
            <input
              id="card-cvc"
              inputMode="numeric"
              autoComplete="off"
              placeholder="123"
              value={card.cvc}
              onChange={(e) => onCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessStep({ order, onDone }: { order: Order; onDone: () => void }) {
  return (
    <div className="checkout-success">
      <svg className="success-check" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" />
        <path d="M14 27l8 8 16-16" />
      </svg>
      <h4 className="checkout-success-title">Payment complete</h4>
      <p className="checkout-success-text">
        {order.items.length} {order.items.length === 1 ? "game" : "games"} added to your library.
      </p>

      <div className="checkout-success-chips">
        <span className="reference-chip">{order.paymentReference}</span>
        {order.pointsEarned > 0 && (
          <span className="points-chip">
            <i className="fa-solid fa-star" aria-hidden="true" />+{formatPoints(order.pointsEarned)} pts
          </span>
        )}
      </div>

      <dl className="checkout-totals">
        {order.discount > 0 && (
          <div className="is-discount">
            <dt>Rewards used</dt>
            <dd>− {formatRand(order.discount)}</dd>
          </div>
        )}
        <div className="is-total">
          <dt>Paid</dt>
          <dd>{formatRand(order.total)}</dd>
        </div>
        <div>
          <dt>Points balance</dt>
          <dd>{formatPoints(order.pointsBalance)}</dd>
        </div>
      </dl>

      <div className="modal-footer">
        <button type="button" className="btn-primary" onClick={onDone}>
          Go to library
        </button>
      </div>
    </div>
  );
}
