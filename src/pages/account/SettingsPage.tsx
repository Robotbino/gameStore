import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { getApiErrorMessage } from "../../utils/apiError";
import { countryOptions } from "../../utils/country";
import type { ChangePasswordRequest } from "../../types/user";
import AvatarPicker from "../../components/account/AvatarPicker";

const BIO_LIMIT = 280;

type Status = { kind: "ok" | "error"; text: string } | null;

/**
 * Three independent forms, one per backend endpoint. Each owns its own
 * submitting flag and its own status line, so a failed password change doesn't
 * blank out the confirmation from the profile save above it — and a bug in one
 * form can't put the others into a weird state.
 */
export default function SettingsPage() {
  const { currentUser, refreshCurrentUser, applyNewToken } = useAuth();

  if (!currentUser) {
    return <div className="loading-screen">Loading settings…</div>;
  }

  return (
    <div className="account-page">
      <h2 className="page-title">Settings</h2>

      <ProfileSection
        key={`profile-${currentUser.id}`}
        onSaved={refreshCurrentUser}
      />
      <AccountSection
        key={`account-${currentUser.id}`}
        onTokenIssued={applyNewToken}
      />
      <SecuritySection />
    </div>
  );
}

/* ── Profile: display name, avatar, bio, country ─────────────────────────── */

function ProfileSection({ onSaved }: { onSaved: () => Promise<void> }) {
  const { currentUser } = useAuth();
  const countries = useMemo(() => countryOptions(), []);

  const [displayName, setDisplayName] = useState("");
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Seed from the loaded record once it exists. Without the guard the fields
  // would reset to empty on every context refresh — including the one this
  // form triggers on save.
  useEffect(() => {
    if (!currentUser) return;
    setDisplayName(currentUser.displayName ?? "");
    setAvatarKey(currentUser.avatarKey);
    setBio(currentUser.bio ?? "");
    setCountry(currentUser.country ?? "");
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsSaving(true);
    try {
      // All four fields go every time: the endpoint replaces rather than
      // merges, which is what makes clearing a bio possible. Empty strings are
      // sent as null so the column is cleared rather than filled with "".
      await userService.updateProfile({
        displayName: displayName.trim() || null,
        avatarKey,
        bio: bio.trim() || null,
        country: country || null,
      });
      await onSaved();
      setStatus({ kind: "ok", text: "Profile saved." });
    } catch (err) {
      setStatus({
        kind: "error",
        text: getApiErrorMessage(err, "Couldn't save your profile."),
      });
    } finally {
      setIsSaving(false);
    }
  }

  const name = displayName.trim() || currentUser?.userName || "";
  const remaining = BIO_LIMIT - bio.length;

  return (
    <section className="settings-section">
      <header className="settings-section-head">
        <h3 className="settings-section-title">Profile</h3>
        <p className="settings-section-hint">
          How you appear across the store.
        </p>
      </header>

      <form className="settings-form" onSubmit={handleSubmit}>
        <AvatarPicker
          value={avatarKey}
          onChange={setAvatarKey}
          name={name}
          disabled={isSaving}
        />

        <div className="form-field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            maxLength={50}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={currentUser?.userName ?? ""}
          />
          <p className="field-hint">
            Leave empty to go by your username, @{currentUser?.userName}.
          </p>
        </div>

        <div className="form-field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            maxLength={BIO_LIMIT}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="What do you play?"
          />
          <p className="field-hint">{remaining} characters left</p>
        </div>

        <div className="form-field">
          <label htmlFor="country">Region</label>
          <select
            id="country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Not set</option>
            {countries.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <StatusLine status={status} />

        <button className="btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </section>
  );
}

/* ── Account: username and email ─────────────────────────────────────────── */

function AccountSection({
  onTokenIssued,
}: {
  onTokenIssued: (jwt: string) => Promise<void>;
}) {
  const { currentUser } = useAuth();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setUserName(currentUser.userName);
    setEmail(currentUser.email);
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsSaving(true);
    try {
      const res = await userService.updateAccount({
        userName: userName.trim(),
        email: email.trim(),
      });
      // Adopting the replacement token is not optional. The JWT's subject is
      // the email, so once it changes the token in localStorage names an
      // address the backend can't resolve — the next request would 401 and the
      // interceptor would bounce this page to /login mid-save.
      await onTokenIssued(res.access_token);
      setStatus({ kind: "ok", text: "Account details saved." });
    } catch (err) {
      setStatus({
        kind: "error",
        text: getApiErrorMessage(err, "Couldn't save your account details."),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="settings-section">
      <header className="settings-section-head">
        <h3 className="settings-section-title">Account</h3>
        <p className="settings-section-hint">
          Your username and the address you sign in with. Both must be unique.
        </p>
      </header>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="accountEmail">Email</label>
          <input
            id="accountEmail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="field-hint">
            Changing this changes how you sign in. You'll stay signed in here.
          </p>
        </div>

        <StatusLine status={status} />

        <button className="btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save account"}
        </button>
      </form>
    </section>
  );
}

/* ── Security: password ──────────────────────────────────────────────────── */

const EMPTY_PASSWORD_FORM: ChangePasswordRequest & { confirm: string } = {
  currentPassword: "",
  newPassword: "",
  confirm: "",
};

function SecuritySection() {
  const [form, setForm] = useState(EMPTY_PASSWORD_FORM);
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    // Confirmation is checked here and never sent: the server has no use for
    // it, and a mismatch is a typo the user can fix without a round trip.
    if (form.newPassword !== form.confirm) {
      setStatus({ kind: "error", text: "The new passwords don't match." });
      return;
    }

    setIsSaving(true);
    try {
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      // Clear on success so the plaintext doesn't sit in component state (and
      // in React DevTools) for the rest of the session.
      setForm(EMPTY_PASSWORD_FORM);
      setStatus({ kind: "ok", text: "Password changed." });
    } catch (err) {
      // A wrong current password arrives as 400, not 401 — deliberately, so the
      // response interceptor doesn't read it as a dead session and log the user
      // out over a typo.
      setStatus({
        kind: "error",
        text: getApiErrorMessage(err, "Couldn't change your password."),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="settings-section">
      <header className="settings-section-head">
        <h3 className="settings-section-title">Password</h3>
        <p className="settings-section-hint">
          Confirm the password you use now, then choose a new one.
        </p>
      </header>

      <form className="settings-form" onSubmit={handleSubmit}>
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

        <div className="form-field">
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <p className="field-hint">At least 8 characters.</p>
        </div>

        <div className="form-field">
          <label htmlFor="confirm">Confirm new password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </div>

        <StatusLine status={status} />

        <button className="btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Changing…" : "Change password"}
        </button>
      </form>
    </section>
  );
}

/* ── Shared ──────────────────────────────────────────────────────────────── */

/**
 * role="status" so the result is announced rather than only seen — these forms
 * give no other feedback that a save landed.
 */
function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p
      className={status.kind === "error" ? "auth-error" : "settings-ok"}
      role="status"
    >
      {status.text}
    </p>
  );
}
