import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import type { User, Role } from "../../types/user";

interface EmployeeFormData {
  userName: string;
  email: string;
  password: string;
  role: Role;
  points: number;
}

const EMPTY_FORM: EmployeeFormData = {
  userName: "",
  email: "",
  password: "",
  role: "USER",
  points: 0,
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<EmployeeFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(await userService.getAll());
    } catch {
      setError("Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingUser(null);
    setModalMode("add");
  }

  function openEdit(user: User) {
    setForm({
      userName: user.userName,
      email: user.email,
      password: "",
      role: user.role,
      points: user.points,
    });
    setEditingUser(user);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingUser(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        const created = await userService.create(form);
        setUsers((prev) => [...prev, created]);
      } else if (editingUser) {
        const updated = await userService.update(editingUser.id, {
          userName: form.userName,
          email: form.email,
          role: form.role,
          points: form.points,
        });
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }
      closeModal();
    } catch {
      setError("Failed to save employee.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteId(null);
    } catch {
      setError("Failed to delete employee.");
    }
  }

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <h2 className="page-title">Manage Employees</h2>
        <button className="btn-primary" onClick={openAdd}>+ Add Employee</button>
      </div>

      {error && <p className="page-error">{error}</p>}

      {isLoading ? (
        <p className="table-loading">Loading employees…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">No employees found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.points}</td>
                  <td className="table-actions">
                    {deleteId === user.id ? (
                      <span className="confirm-delete">
                        <span className="confirm-label">Confirm?</span>
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Yes</button>
                        <button className="btn-outline btn-sm" onClick={() => setDeleteId(null)}>No</button>
                      </span>
                    ) : (
                      <>
                        <button className="btn-outline btn-sm" onClick={() => openEdit(user)}>Edit</button>
                        <button className="btn-danger btn-sm" onClick={() => setDeleteId(user.id)}>Delete</button>
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
              <h3 className="modal-title">{modalMode === "add" ? "Add Employee" : "Edit Employee"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Username</label>
                <input name="userName" value={form.userName} onChange={handleChange} required />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>

              {modalMode === "add" && (
                <div className="form-field">
                  <label>Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Points</label>
                  <input name="points" type="number" min="0" value={form.points} onChange={handleChange} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : modalMode === "add" ? "Add Employee" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
