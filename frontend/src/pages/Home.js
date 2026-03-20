import { useEffect, useState } from "react";
import { getPosts, createPost } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false); // ✅ NEW

  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    await createPost({ title, content });
    setTitle("");
    setContent("");
    setShowForm(false); // ✅ close form after post
    fetchPosts();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-2 bg-light vh-100 p-3">
  <h5 className="text-success mb-3">Dev Community</h5>

  <Link to="/home" className="d-block mb-2 text-decoration-none">🏠 Home</Link>
  <Link to="/questions" className="d-block mb-2 text-decoration-none">❓ Questions</Link>
  <Link to="/ai" className="d-block mb-2 text-decoration-none">🤖 AI Assist</Link>
  <Link to="/tags" className="d-block mb-2 text-decoration-none">🏷 Tags</Link>
  <Link to="/challenges" className="d-block mb-2 text-decoration-none">🏆 Challenges</Link>
  <Link to="/chat" className="d-block mb-2 text-decoration-none">💬 Chat</Link>
  <Link to="/articles" className="d-block mb-2 text-decoration-none">📰 Articles</Link>
  <Link to="/users" className="d-block mb-2 text-decoration-none">👤 Users</Link>
  <Link to="/companies" className="d-block mb-2 text-decoration-none">🏢 Companies</Link>
</div>

        {/* Main */}
        <div className="col-7 p-4">

          {/* Header */}
          <div className="d-flex align-items-center mb-3">

  <h4 className="me-auto">Latest Posts</h4>

  <button
    onClick={() => setShowForm(!showForm)}
    className="btn btn-success me-2"
  >
    {showForm ? "Close" : "Ask Question"}
  </button>

  

</div>
          {/* Ask Question Form */}
          {showForm && (
            <div className="card p-3 mb-4 shadow">
              <h5 className="text-success mb-2">Ask a Question</h5>

              <input
                className="form-control mb-2"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="form-control mb-2"
                placeholder="Describe your problem..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <button onClick={handleCreatePost} className="btn btn-success">
                Post Question
              </button>
            </div>
          )}

          {/* Posts */}
          {posts.map((post) => (
            <div key={post._id} className="card p-3 mb-3 shadow-sm">
              <h5 className="text-primary">{post.title}</h5>
              <p>{post.content}</p>

              <small
                className="text-success fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${post.user._id}`)}
              >
                👤 {post.user?.name}
              </small>
            </div>
          ))}

        </div>

        {/* Right Panel */}
        <div className="col-3 bg-light vh-100 p-3">

  {/* Logout Top Right */}
  <div className="d-flex justify-content-end mb-3">
    <button onClick={handleLogout} className="btn btn-danger btn-sm">
      Logout
    </button>
  </div>

  <h5>📢 Announcements</h5>
  <hr />
  <p>🚀 Welcome to Dev Community</p>
  <p>🔥 Start asking questions</p>

  <h6 className="mt-4">👥 Top Users</h6>
  <p>Varun</p>
  <p>Guest</p>

</div>

      </div>
    </div>
  );
}

export default Home;