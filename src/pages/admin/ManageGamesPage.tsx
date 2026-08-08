import { useState, useEffect, useCallback } from "react";
import { gameService } from "../../services/gameService";
import type { Game, GameInput } from "../../types/game";
import type { Page } from "../../types/pagination";
import { emptyPage } from "../../types/pagination";
import { getApiErrorMessage } from "../../utils/apiError";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 20;

const EMPTY_FORM: GameInput = {
  title: "",
  genre: "",
  price: 0,
  rating: 0,
  description: "",
  imageUrl: "",
  heroImage: "",
};

export default function ManageGamesPage() {
  const [result, setResult] = useState<Page<Game>>(emptyPage(PAGE_SIZE));
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [form, setForm] = useState<GameInput>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const games = result.content;

  // Every mutation re-reads the current page instead of splicing local state.
  // With a paginated table, splicing lies: adding a row doesn't push the last
  // one onto the next page, and deleting one leaves a 19-row page that should
  // have pulled a row up from behind it. The service already drops its cache on
  // write, so this re-read always hits the server.
  const load = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await gameService.getPage({ page, size: PAGE_SIZE }));
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load games."));
      setResult(emptyPage(PAGE_SIZE));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(pageIndex);
  }, [pageIndex, load]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingGame(null);
    setModalMode("add");
  }

  function openEdit(game: Game) {
    setForm({
      title: game.title,
      genre: game.genre,
      price: game.price,
      rating: game.rating,
      description: game.description,
      imageUrl: game.imageUrl,
      heroImage: game.heroImage,
    });
    setEditingGame(game);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingGame(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "price" || name === "rating") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    }else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        await gameService.create(form);
        closeModal();
        // The list sorts by id ASC, so a new game lands on the last page —
        // stay put and the admin would never see what they just added.
        const last = Math.max(0, Math.ceil((result.totalElements + 1) / PAGE_SIZE) - 1);
        if (last === pageIndex) await load(pageIndex);
        else setPageIndex(last);
        return;
      }

      if (editingGame) {
        await gameService.update(editingGame.id, form);
        closeModal();
        await load(pageIndex);
        return;
      }

      closeModal();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save game."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await gameService.delete(id);
      setDeleteId(null);
      // Deleting the only row on the last page would strand the admin on a page
      // that no longer exists, so step back instead of reloading an empty one.
      if (games.length === 1 && pageIndex > 0) setPageIndex(pageIndex - 1);
      else await load(pageIndex);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete game."));
    }
  }

  return (
    <div className="manage-games-page">
      <div className="page-header">
        <h2 className="page-title">Manage Games</h2>
        <button className="btn-primary" onClick={openAdd}>+ Add Game</button>
      </div>

      {error && <p className="page-error">{error}</p>}

      {isLoading ? (
        <p className="table-loading">Loading games…</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">No games found.</td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id}>
                    <td>{game.id}</td>
                    <td>{game.title}</td>
                    <td>{game.genre}</td>
                    <td>R {game.price.toFixed(2)}</td>
                    <td>{game.rating}</td>
                    <td className="table-actions">
                      {deleteId === game.id ? (
                        <span className="confirm-delete">
                          <span className="confirm-label">Confirm?</span>
                          <button className="btn-danger btn-sm" onClick={() => handleDelete(game.id)}>Yes</button>
                          <button className="btn-outline btn-sm" onClick={() => setDeleteId(null)}>No</button>
                        </span>
                      ) : (
                        <>
                          <button className="btn-outline btn-sm" onClick={() => openEdit(game)}>Edit</button>
                          <button className="btn-danger btn-sm" onClick={() => setDeleteId(game.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination page={result} onPageChange={setPageIndex} label="games" />
        </>
      )}

      {modalMode && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">{modalMode === "add" ? "Add Game" : "Edit Game"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-field">
                <label>Genres (comma-separated)</label>
                <input
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  placeholder="Action, RPG, Adventure"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Price (R)</label>
                  <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label>Rating (0–5)</label>
                  <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>

              <div className="form-field">
                <label>Cover Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Hero Image URL</label>
                <input name="heroImage" value={form.heroImage} onChange={handleChange} />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : modalMode === "add" ? "Add Game" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
