import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, getPosts, adminGetMe, adminDeleteUser, adminDeletePost, createNotification, getAdminNotifications, deleteNotification, toggleNotification } from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'announcement'
  });
  const [showLastFive, setShowLastFive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / usersPerPage));

  const firstFiveUsers = users.slice(0, 5);
  const nextFiveUsers = users.slice(5, 10);
  const lastFiveUsers = users.slice(-5);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  const rightColumnUsers = showLastFive ? lastFiveUsers : nextFiveUsers;
  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Basic verification and data fetch
    const fetchAdminData = async () => {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
         navigate("/admin");
         return;
      }

      try {
        setLoading(true);
        const [usersList, postsList, adminMe, notificationsList] = await Promise.all([
          getAllUsers(),
          getPosts(),
          adminGetMe(adminToken),
          getAdminNotifications(adminToken)
        ]);

        setUsers(usersList);
        setPosts(postsList);
        setNotifications(notificationsList.notifications || []);
        if (adminMe.user) setCurrentAdmin(adminMe.user);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    if(!window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await adminDeleteUser(userId, adminToken);
      
      if(data._id) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const handleDeletePost = async (postId) => {
    if(!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await adminDeletePost(postId, adminToken);
      
      if(data._id) {
        setPosts(posts.filter(p => p._id !== postId));
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      alert("Please fill in both title and message");
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await createNotification(notificationForm, adminToken);
      
      if (data.message === 'Notification created successfully') {
        setNotifications([data.notification, ...notifications]);
        setNotificationForm({ title: '', message: '', type: 'announcement' });
        setShowNotificationForm(false);
        alert("Notification created successfully!");
      } else {
        alert(`Failed to create notification: ${data.message}`);
      }
    } catch (err) {
      console.error("Notification creation error:", err);
      alert("An error occurred while creating the notification.");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if(!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await deleteNotification(notificationId, adminToken);
      
      if (data.message === 'Notification deleted successfully') {
        setNotifications(notifications.filter(n => n._id !== notificationId));
        alert("Notification deleted successfully!");
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const handleToggleNotification = async (notificationId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await toggleNotification(notificationId, adminToken);
      
      if (data.message === 'Notification toggled successfully') {
        setNotifications(notifications.map(n => 
          n._id === notificationId ? data.notification : n
        ));
      } else {
        alert(`Failed to toggle: ${data.message}`);
      }
    } catch (err) {
      console.error("Toggle error:", err);
      alert("An error occurred while toggling the notification.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  if (loading) {
    return <div className="vh-100 d-flex justify-content-center align-items-center bg-white"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="min-vh-100 bg-light text-dark border-top border-4 border-primary">
      {/* Admin Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm mb-4 py-2">
        <div className="container px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-primary btn-sm rounded-pill px-3" style={{ fontSize: "0.8rem" }} onClick={() => navigate('/home')}>
              ← Back Home
            </button>
            <Link className="navbar-brand fw-bold mb-0" style={{ color: "#6366f1" }} to="/admin/dashboard">
              <span className="me-2">🛡️</span>Admin-Console
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
             {currentAdmin && (
               <div className="d-flex align-items-center gap-2 border-end pe-3 me-1">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}>
                    {currentAdmin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="d-flex flex-column lh-1">
                    <span className="small fw-bold text-dark">{currentAdmin.name}</span>
                    <span className="text-muted" style={{ fontSize: "0.65rem" }}>{currentAdmin.role}</span>
                  </div>
               </div>
             )}
            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" style={{ fontSize: "0.8rem" }} onClick={handleLogout}>
              Logout Session
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-4">
        <div className="row mb-4 g-3">
          <div className="col-md-3">
             <div className="card border-0 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #4338ca, #6366f1)" }}>
               <div className="card-body">
                 <h6 className="text-light text-opacity-75 small fw-bold">TOTAL USERS</h6>
                 <h2 className="mb-0 fw-bold">{users.length}</h2>
               </div>
             </div>
          </div>
          <div className="col-md-3">
             <div className="card border-0 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }}>
               <div className="card-body">
                 <h6 className="text-light text-opacity-75 small fw-bold">TOTAL POSTS</h6>
                 <h2 className="mb-0 fw-bold">{posts.length}</h2>
               </div>
             </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-white border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div>
                  <h5 className="mb-1 fw-bold text-dark">Developer Name Columns</h5>
                  <p className="small text-muted mb-0">Total developers: {users.length}</p>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={() => setShowLastFive(prev => !prev)}
                >
                  {showLastFive ? 'Show middle 5' : 'Show last 5'}
                </button>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold">Column 1</h6>
                        <span className="badge bg-info text-dark">First 5</span>
                      </div>
                      <ul className="list-group list-group-flush">
                        {firstFiveUsers.length > 0 ? firstFiveUsers.map((user) => (
                          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                            <span className="small fw-semibold">{user.name || 'Unknown'}</span>
                            <span className="badge bg-secondary rounded-pill">{user.email}</span>
                          </li>
                        )) : (
                          <li className="list-group-item p-2 text-muted">No users available</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold">Column 2</h6>
                        <span className="badge bg-warning text-dark">{showLastFive ? 'Last 5' : 'Next 5'}</span>
                      </div>
                      <ul className="list-group list-group-flush">
                        {rightColumnUsers.length > 0 ? rightColumnUsers.map((user) => (
                          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                            <span className="small fw-semibold">{user.name || 'Unknown'}</span>
                            <span className="badge bg-secondary rounded-pill">{user.email}</span>
                          </li>
                        )) : (
                          <li className="list-group-item p-2 text-muted">No users available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
           <div className="col-md-12">
             <div className="card bg-white border-0 shadow-sm rounded-3">
               <div className="card-header bg-white border-bottom py-3">
                 <h5 className="mb-0 fw-bold text-dark">Recent Users Directory</h5>
               </div>
               <div className="card-body p-0">
                 <div className="table-responsive">
                   <table className="table table-hover mb-0">
                     <thead className="bg-light text-secondary text-uppercase small fw-bold">
                       <tr>
                         <th>Name</th>
                         <th>Email</th>
                         <th>Bio</th>
                         <th>Joined</th>
                         <th>Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {currentUsers.map(u => (
                         <tr key={u._id}>
                           <td>
                             <div className="d-flex align-items-center gap-2">
                                <div 
                                  className={`rounded-circle d-flex align-items-center justify-content-center text-white ${u.gender === 'female' ? 'bg-danger' : 'bg-primary'}`}
                                  style={{ width: "30px", height: "30px", fontSize: "0.7rem" }}
                                >
                                  {u.gender === 'female' ? '👩' : '👨'}
                                </div>
                                <div className="d-flex flex-column">
                                  <span className="fw-bold small">{u.name || 'Unknown'}</span>
                                  <span className="text-muted" style={{ fontSize: "0.65rem" }}>ID: {u._id.slice(-6)}</span>
                                </div>
                             </div>
                           </td>
                           <td className="small">{u.email}</td>
                           <td className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>{u.bio || "-"}</td>
                           <td className="small">{new Date(u.createdAt).toLocaleDateString()}</td>
                           <td>
                             <button 
                               className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill" 
                               onClick={() => handleDeleteUser(u._id)}
                             >
                               Restrict
                             </button>
                           </td>
                         </tr>
                       ))}
                       {currentUsers.length === 0 && (
                         <tr><td colSpan="5" className="text-center text-muted py-3">No users found.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
                 <div className="d-flex justify-content-between align-items-center py-3 px-3 border-top">
                   <button 
                     className="btn btn-sm btn-outline-secondary rounded-pill"
                     disabled={currentPage === 1}
                     onClick={() => handlePageChange(currentPage - 1)}
                   >
                     Previous
                   </button>
                   <div className="text-secondary small">
                     Page {currentPage} of {totalPages}
                   </div>
                   <button 
                     className="btn btn-sm btn-outline-secondary rounded-pill"
                     disabled={currentPage === totalPages}
                     onClick={() => handlePageChange(currentPage + 1)}
                   >
                     Next
                   </button>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="row mt-5">
           <div className="col-md-12">
             <div className="card bg-white border-0 shadow-sm rounded-3">
               <div className="card-header bg-white border-bottom py-3">
                 <h5 className="mb-0 fw-bold text-dark">Recent Posts Management</h5>
               </div>
               <div className="card-body p-0">
                 <div className="table-responsive">
                   <table className="table table-hover mb-0">
                     <thead className="bg-light text-secondary text-uppercase small fw-bold">
                       <tr>
                         <th>ID</th>
                         <th>Title</th>
                         <th>Author ID</th>
                         <th>Date</th>
                         <th>Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {posts.slice(0, 10).map(p => (
                         <tr key={p._id}>
                           <td className="text-secondary small">{p._id}</td>
                           <td>{p.title}</td>
                           <td className="text-secondary small">{p.author}</td>
                           <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                           <td>
                             <button 
                               className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill" 
                               onClick={() => handleDeletePost(p._id)}
                             >
                               Delete
                             </button>
                           </td>
                         </tr>
                       ))}
                       {posts.length === 0 && (
                         <tr><td colSpan="5" className="text-center text-muted py-3">No posts found.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Notifications Management */}
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="card bg-white border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">📢 Notification Management</h5>
                <button 
                  className="btn btn-primary btn-sm rounded-pill px-3"
                  onClick={() => setShowNotificationForm(!showNotificationForm)}
                >
                  {showNotificationForm ? 'Cancel' : '+ Create Notification'}
                </button>
              </div>
              <div className="card-body">
                {showNotificationForm && (
                  <form onSubmit={handleCreateNotification} className="mb-4 p-3 bg-light rounded-3">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                          placeholder="Notification title"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Type</label>
                        <select
                          className="form-select"
                          value={notificationForm.type}
                          onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                        >
                          <option value="announcement">📢 Announcement</option>
                          <option value="update">🔄 Update</option>
                          <option value="alert">⚠️ Alert</option>
                          <option value="event">🎉 Event</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Message</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={notificationForm.message}
                          onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                          placeholder="Notification message content"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-success btn-sm me-2">
                          🚀 Publish Notification
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setShowNotificationForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light text-secondary text-uppercase small fw-bold">
                      <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map(n => (
                        <tr key={n._id}>
                          <td>
                            <div className="fw-bold small">{n.title}</div>
                            <div className="text-muted small text-truncate" style={{maxWidth: '300px'}}>
                              {n.message}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${n.type === 'announcement' ? 'bg-primary' : n.type === 'update' ? 'bg-info' : n.type === 'alert' ? 'bg-warning' : 'bg-success'}`}>
                              {n.type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${n.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {n.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="small">{new Date(n.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className={`btn ${n.isActive ? 'btn-outline-secondary' : 'btn-outline-success'} btn-sm`}
                                onClick={() => handleToggleNotification(n._id)}
                                title={n.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {n.isActive ? '🔇' : '🔊'}
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteNotification(n._id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {notifications.length === 0 && (
                        <tr><td colSpan="5" className="text-center text-muted py-3">No notifications created yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
