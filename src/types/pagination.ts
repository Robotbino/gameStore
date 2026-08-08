/**
 * Mirrors the backend `PagedResponse<T>` record (dto/PagedResponse.java) — the
 * envelope every list endpoint now returns instead of a bare JSON array.
 *
 * It is deliberately NOT Spring Data's Page/PageImpl shape (no `pageable`,
 * `sort`, `numberOfElements`, `first`/`last`): Spring Boot 3.3 warns that
 * PageImpl's JSON isn't a stable contract, so the backend wraps it in a record
 * it owns. These five fields are the entire contract — don't reach for others.
 */
export interface Page<T> {
  content: T[];
  /** Zero-based, like Spring's `page` request param. */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * The standard Spring Data paging params. `sort` is "field,dir" — e.g.
 * "title,asc". Axios leaves the comma unescaped, so it arrives intact.
 */
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

/** Matches @PageableDefault(size = 20) on both paginated controllers. */
export const DEFAULT_PAGE_SIZE = 20;

export function emptyPage<T>(size: number = DEFAULT_PAGE_SIZE): Page<T> {
  return { content: [], page: 0, size, totalElements: 0, totalPages: 0 };
}

/**
 * Coerce a response body into a Page<T>.
 *
 * Two things it defends against, both of which used to be render-time crashes:
 * a missing/null `content` (`.map` of undefined), and a bare array — which is
 * what an older backend build, or any endpoint that hasn't been paginated yet,
 * still returns. Treating an array as a single full page means a stale server
 * degrades to the old behaviour instead of blanking the screen.
 */
export function toPage<T>(data: unknown, requested: PageParams = {}): Page<T> {
  if (Array.isArray(data)) {
    return {
      content: data as T[],
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: data.length > 0 ? 1 : 0,
    };
  }

  const body = (data ?? {}) as Partial<Page<T>>;
  const content = Array.isArray(body.content) ? body.content : [];
  const size = body.size ?? requested.size ?? DEFAULT_PAGE_SIZE;
  const totalElements = body.totalElements ?? content.length;

  return {
    content,
    page: body.page ?? requested.page ?? 0,
    size,
    totalElements,
    totalPages: body.totalPages ?? (size > 0 ? Math.ceil(totalElements / size) : 0),
  };
}
