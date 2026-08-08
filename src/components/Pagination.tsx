import type { Page } from "../types/pagination";

interface PaginationProps {
  /** Any Page envelope — only the metadata is read, never the rows. */
  page: Page<unknown>;
  onPageChange: (page: number) => void;
  /** Plural noun for the caption, e.g. "games" / "employees". */
  label?: string;
  /** Locks the controls while the next page is in flight. */
  disabled?: boolean;
}

export default function Pagination({
  page,
  onPageChange,
  label = "results",
  disabled = false,
}: PaginationProps) {
  const { page: current, size, totalElements, totalPages } = page;

  // Nothing to page through and nothing to count — say nothing. The empty
  // state belongs to the table/grid above, not here.
  if (totalElements === 0) return null;

  // Derived from the metadata rather than content.length so the caption stays
  // right on a partial last page.
  const from = current * size + 1;
  const to = Math.min(from + size - 1, totalElements);

  const hasPrev = current > 0;
  const hasNext = current + 1 < totalPages;

  return (
    <nav className="pagination" aria-label={`${label} pagination`}>
      <p className="pagination-caption" aria-live="polite">
        Showing <strong>{from}</strong>–<strong>{to}</strong> of{" "}
        <strong>{totalElements}</strong> {label}
      </p>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => onPageChange(current - 1)}
            disabled={disabled || !hasPrev}
          >
            ← Prev
          </button>

          <span className="pagination-position">
            Page {current + 1} of {totalPages}
          </span>

          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => onPageChange(current + 1)}
            disabled={disabled || !hasNext}
          >
            Next →
          </button>
        </div>
      )}
    </nav>
  );
}
