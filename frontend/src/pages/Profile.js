import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${id}`);
    const data = await res.json();

    setUser(data.user);
    setPosts(data.posts);
  };

  return (
    <div className="container mt-4">
      {user && (
        <>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.bio}</p>
        </>
      )}

      <hr />

      <h4>User Posts</h4>

      {posts.map((post) => (
        <div key={post._id} className="card p-3 mb-2">
          <h5>{post.title}</h5>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;