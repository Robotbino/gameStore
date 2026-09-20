import { useRef } from "react";
import type { Game } from "../../types/game";
import { parseGenres } from "../../utils/genre";

interface SearchSuggestionsProps {
  id: string;
  isOpen: boolean;
  suggestions: Game[];
  isLoading: boolean;
  error: boolean;
  resolvedQuery: string;
  activeIndex: number;
  optionId: (game: Game) => string;
  onSelect: (game: Game) => void;
}

export default function SearchSuggestions({
  id,
  isOpen,
  suggestions,
  isLoading,
  error,
  resolvedQuery,
  activeIndex,
  optionId,
  onSelect,
}: SearchSuggestionsProps) {
  // The panel stays mounted and fades out, so freeze what it showed at the
  // moment it closed — otherwise clearing the box empties it mid-fade.
  const last = useRef({ suggestions, isLoading, error, resolvedQuery });
  if (isOpen) last.current = { suggestions, isLoading, error, resolvedQuery };
  const shown = last.current;

  const isEmpty =
    !shown.isLoading &&
    !shown.error &&
    shown.resolvedQuery !== "" &&
    shown.suggestions.length === 0;

  return (
    // mousedown preventDefault keeps focus in the input while an option is
    // clicked, so the form's blur handler never closes the panel under the click.
    <div
      className={`search-suggestions ${isOpen ? "is-open" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ul id={id} role="listbox" aria-label="Game suggestions" aria-busy={shown.isLoading}>
        {shown.suggestions.map((game, index) => (
          <li
            key={game.id}
            id={optionId(game)}
            role="option"
            aria-selected={index === activeIndex}
            className="search-suggestion"
            onClick={() => onSelect(game)}
          >
            <img className="search-suggestion-thumb" src={game.imageUrl} alt="" />
            <span className="search-suggestion-title">{game.title}</span>
            <span className="search-suggestion-meta">
              {parseGenres(game.genre).slice(0, 2).join(" · ") || "Uncategorised"}
            </span>
          </li>
        ))}
      </ul>

      <div className="search-suggestions-status" role="status">
        {shown.isLoading && shown.suggestions.length === 0 && "Searching…"}
        {shown.error && "Couldn't load suggestions"}
        {isEmpty && (
          <>
            No games match <strong>“{shown.resolvedQuery}”</strong>
          </>
        )}
      </div>
    </div>
  );
}
