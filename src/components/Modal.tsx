import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "default" | "wide";
}

const EXIT_MS = 150;
const FOCUSABLE =
  'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href]';

export default function Modal({ open, title, onClose, children, size = "default" }: ModalProps) {
  const titleId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<"closed" | "open" | "closing">(open ? "open" : "closed");

  // Keep the last content rendered while the exit animation plays, so the
  // dialog doesn't flash a different title on its way out.
  const lastContent = useRef({ title, children });
  if (open) lastContent.current = { title, children };

  useEffect(() => {
    if (open) {
      setPhase("open");
      return;
    }
    setPhase((current) => (current === "open" ? "closing" : current));
    const timer = setTimeout(() => setPhase("closed"), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // Focus moves into the dialog on open and back to whatever opened it on close.
  useEffect(() => {
    if (phase !== "open") return;
    openerRef.current = document.activeElement as HTMLElement | null;
    boxRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => openerRef.current?.focus();
  }, [phase]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !boxRef.current) return;

    const focusable = boxRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (phase === "closed") return null;

  return (
    <div
      className={`modal-overlay ${phase === "closing" ? "is-closing" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`modal-box ${size === "wide" ? "modal-box--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={boxRef}
      >
        <div className="modal-header">
          <h3 className="modal-title" id={titleId}>
            {lastContent.current.title}
          </h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {lastContent.current.children}
      </div>
    </div>
  );
}
