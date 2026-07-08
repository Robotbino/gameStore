import { useState, useEffect } from "react";
import { gameService } from "../../services/gameService";
import type { Game, GameInput } from "../../types/game";

interface GameFormData extends GameInput {
  genreText: string;
}

const EMPTY_FORM: GameFormData = {
  title: "",
  genre: [],
  genreText: "",
  price: 0,
  rating: 0,
  description: "",
  imageUrl: "",
  heroImage: "",
};

export default function ManageGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [form, setForm] = useState<GameFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setGames(await gameService.getAll());
    } catch {
      setError("Failed to load games.");
    } finally {
      setIsLoading(false);
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingGame(null);
    setModalMode("add");
  }

  function openEdit(game: Game) {
    const genreText = Array.isArray(game.genre) ? game.genre.join(", ") : game.genre;
    setForm({
      title: game.title,
      genre: game.genre,
      genreText,
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
    if (name === "genreText") {
      setForm((prev) => ({
        ...prev,
        genreText: value,
        genre: value.split(",").map((g) => g.trim()).filter(Boolean),
      }));
    } else if (name === "price" || name === "rating") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const { genreText: _gt, ...gameData } = form;
    try {
      if (modalMode === "add") {
        const created = await gameService.create(gameData);
        setGames((prev) => [...prev, created]);
      } else if (editingGame) {
        const updated = await gameService.update(editingGame.id, gameData);
        setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      }
      closeModal();
    } catch {
      setError("Failed to save game.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await gameService.delete(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      setDeleteId(null);
    } catch {
      setError("Failed to delete game.");
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
                  <td>{Array.isArray(game.genre) ? game.genre.join(", ") : game.genre}</td>
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
                  name="genreText"
                  value={form.genreText}
                  onChange={handleChange}
                  placeholder="Action, RPG, Adventure"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Price (R)</label>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label>Rating (0–10)</label>
                  <input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={handleChange} required />
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
