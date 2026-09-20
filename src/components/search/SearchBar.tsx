import { useEffect, useId, useRef, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import type { Game } from "../../types/game";
import { useGameSuggestions } from "../../hooks/useGameSuggestions";
import SearchSuggestions from "./SearchSuggestions";

const SEARCH_DEBOUNCE_MS = 300;

export default function SearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL's ?q= is the source of truth: Browse reads it, and this box mirrors
  // it so Back, Clear and a shared link all keep the input honest.
  const onBrowse = pathname === "/browse";
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // The suggestion panel is opened explicitly by typing or refocusing, never
  // derived from focus alone — submitting, or coming Back with the box still
  // focused, must not pop it open over the results.
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const optionId = (game: Game) => `${listboxId}-${game.id}`;

  const { suggestions, isLoading, error, resolvedQuery } = useGameSuggestions(query);
  const showPanel = isOpen && query.trim() !== "";
  // Clamp rather than reset in an effect: a shorter list just drops the highlight.
  const active = activeIndex < suggestions.length ? activeIndex : -1;

  // "/" from anywhere on the page jumps to the search, unless the user is
  // already typing somewhere.
  useEffect(() => {
    function handleSlash(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable]");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    document.addEventListener("keydown", handleSlash);
    return () => document.removeEventListener("keydown", handleSlash);
  }, []);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // On Browse, typing filters live after a pause. Writing only `q` drops
  // `page`, so a new term always starts from the first page.
  useEffect(() => {
    if (!onBrowse || query === urlQuery) return;
    const timer = setTimeout(() => {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, urlQuery, onBrowse, setSearchParams]);

  // Anywhere else, submitting hands the term to Browse.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsOpen(false);
    const term = query.trim();
    navigate(term ? `/browse?q=${encodeURIComponent(term)}` : "/browse");
  }

  function clear() {
    setQuery("");
    setIsOpen(false);
    if (onBrowse) setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  }

  function select(game: Game) {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery("");
    navigate(`/games/${game.id}`);
  }

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    setIsOpen(value.trim() !== "");
  }

  // Covers click-outside and Tab-away in one place; clicks inside the panel
  // never blur the input (see SearchSuggestions).
  function handleBlur(e: React.FocusEvent<HTMLFormElement>) {
    if (!formRef.current?.contains(e.relatedTarget as Node | null)) setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const count = suggestions.length;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (count === 0) return;
        setIsOpen(true);
        const step = e.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((active + step + count) % count);
        return;
      }
      case "Enter":
        if (showPanel && active >= 0) {
          e.preventDefault();
          select(suggestions[active]);
        }
        return;
      case "Escape":
        clear();
        return;
    }
  }

  return (
    <form
      ref={formRef}
      className="search-bar"
      onSubmit={handleSubmit}
      onFocus={() => query.trim() && setIsOpen(true)}
      onBlur={handleBlur}
      role="search"
    >
      <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search games"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search games"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? optionId(suggestions[active]) : undefined}
        autoComplete="off"
      />
      {query ? (
        <button type="button" className="search-clear" onClick={clear} aria-label="Clear search">
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      ) : (
        <kbd className="search-kbd" aria-hidden="true">
          /
        </kbd>
      )}

      <SearchSuggestions
        id={listboxId}
        isOpen={showPanel}
        suggestions={suggestions}
        isLoading={isLoading}
        error={error}
        resolvedQuery={resolvedQuery}
        activeIndex={active}
        optionId={optionId}
        onSelect={select}
      />
    </form>
  );
}
