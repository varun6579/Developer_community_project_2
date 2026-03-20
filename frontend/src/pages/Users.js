import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();

  const users = [
    { id: 1, name: "Varun", email: "varun@mail.com" },
    { id: 2, name: "Teja", email: "teja@mail.com" }
  ];

  return (
    <div className="container mt-4">
      <h2>👤 Users</h2>

      {users.map((user) => (
        <div
          key={user.id}
          className="card p-3 my-2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <h5>{user.name}</h5>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;