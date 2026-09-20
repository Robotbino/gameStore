import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { getApiErrorMessage } from "../../utils/apiError";

const MIN_PASSWORD_LENGTH = 8;

export default function SettingsPage() {
  const { currentUser, refreshUser } = useAuth();

  return (
    <div className="settings-page">
      <h2 className="page-title">Settings</h2>

      {currentUser && (
        <AccountSection
          userName={currentUser.userName}
          email={currentUser.email}
          onSaved={refreshUser}
        />
      )}
      <PasswordSection />
    </div>
  );
}

function AccountSection({
  userName,
  email,
  onSaved,
}: {
  userName: string;
  email: string;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(userName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setName(userName), [userName]);

  const isUnchanged = name.trim() === userName;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      await userService.updateMe({ userName: name.trim() });
      await onSaved();
      setSuccess("Username updated.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't update your username."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="settings-card">
      <h3>Account</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" value={email} disabled />
          <small className="form-hint">Email can't be changed yet.</small>
        </div>

        {error && <p className="page-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="settings-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving || isUnchanged || !name.trim()}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function PasswordSection() {
  const [form, setForm] = useState(EMPTY_PASSWORD_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate(): string | null {
    if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
      return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (form.newPassword !== form.confirmPassword) {
      return "New passwords don't match.";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    setIsSaving(true);
    try {
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(EMPTY_PASSWORD_FORM);
      setSuccess("Password changed.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't change your password."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="settings-card">
      <h3>Password</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p className="page-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="settings-actions">
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? "Updating…" : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}
