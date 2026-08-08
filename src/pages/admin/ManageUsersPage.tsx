import { useState, useEffect, useCallback } from "react";
import { userService } from "../../services/userService";
import type { User, Role } from "../../types/user";
import type { Page } from "../../types/pagination";
import { emptyPage } from "../../types/pagination";
import { getApiErrorMessage } from "../../utils/apiError";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 20;

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

// UsersController now returns a UserResponse from addUser/updateUser, but this
// gate stays: it also filters anything malformed out of a page's `content`, and
// a null slipping into the users array white-screens the table on next render.
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as User).id === "number"
  );
}

export default function ManageUsersPage() {
  const [result, setResult] = useState<Page<User>>(emptyPage(PAGE_SIZE));
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<EmployeeFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const users = result.content;

  // Re-reads the page after every write rather than splicing local state: with
  // a paginated table, a spliced row doesn't push the last row onto the next
  // page and a spliced-out one doesn't pull a row up from behind it.
  const load = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getPage({ page, size: PAGE_SIZE });
      setResult({ ...data, content: data.content.filter(isUser) });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load employees."));
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
    setError(null);
    try {
      // Warnings are raised AFTER the reload, never before: load() clears the
      // error banner on entry, so setting one first would wipe it out.
      if (modalMode === "add") {
        const created = await userService.create(form);
        closeModal();
        // Sorted by id ASC, so a new employee lands on the last page — reload
        // there, otherwise the admin adds someone and sees nothing change.
        const last = Math.max(0, Math.ceil((result.totalElements + 1) / PAGE_SIZE) - 1);
        if (last === pageIndex) await load(pageIndex);
        else setPageIndex(last);
        if (!isUser(created)) {
          setError(
            "The employee was likely saved, but POST /users returned an empty body, so the table below may not reflect it.",
          );
        }
        return;
      }

      if (editingUser) {
        const updated = await userService.update(editingUser.id, {
          userName: form.userName,
          email: form.email,
          role: form.role,
          points: form.points,
        });
        closeModal();
        await load(pageIndex);
        if (!isUser(updated)) {
          setError(
            "The employee was likely updated, but PUT /users/{id} returned an empty body, so the table below may not reflect it.",
          );
        }
        return;
      }

      closeModal();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save employee."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await userService.delete(id);
      setDeleteId(null);
      // Removing the last row on the last page would strand the admin on a page
      // that no longer exists, so step back instead of reloading an empty one.
      if (users.length === 1 && pageIndex > 0) setPageIndex(pageIndex - 1);
      else await load(pageIndex);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete employee."));
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
        <>
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
                      <span
                        className={`role-badge ${(user.role ?? "user").toLowerCase()}`}
                      >
                        {user.role ?? "—"}
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

          <Pagination page={result} onPageChange={setPageIndex} label="employees" />
        </>
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
