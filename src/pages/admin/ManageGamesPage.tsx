import gameData from "../../assets/gameData";

// TODO: replace with real API data and add create/edit/delete actions

export default function ManageGamesPage() {
  return (
    <div className="manage-games-page">
      <div className="page-header">
        <h2 className="page-title">Manage Games</h2>
        <button className="btn-primary">+ Add Game</button>
      </div>

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
          {gameData.games.map((game) => (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td>{game.title}</td>
              <td>{game.genre.join(", ")}</td>
              <td>R {game.price.toFixed(2)}</td>
              <td>{game.rating}</td>
              <td className="table-actions">
                <button className="btn-outline">Edit</button>
                <button className="btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
