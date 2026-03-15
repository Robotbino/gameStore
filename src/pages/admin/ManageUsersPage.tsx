// TODO: replace placeholder with real users fetched from API

export default function ManageUsersPage() {
  return (
    <div className="manage-users-page">
      <div className="page-header">
        <h2 className="page-title">Manage Users</h2>
      </div>

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
          <tr>
            <td colSpan={6} style={{ color: "var(--text-muted)", textAlign: "center" }}>
              No users loaded yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
