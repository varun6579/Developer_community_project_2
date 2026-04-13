const BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : "https://developer-community-project-2.onrender.com/api";

const getUserToken = () => localStorage.getItem("token");
const getAdminToken = () => localStorage.getItem("adminToken");

const getAuthToken = () => {
  return getUserToken() || getAdminToken();
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const signup = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });
  return res.json();
};

export const resetPassword = async (resetToken, newPassword) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ resetToken, newPassword })
  });
  return res.json();
};

export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const createPost = async (data) => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders()
  };

  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });

  return res.json();
};

export const addAnswer = async (postId, text) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ text })
  });
  return res.json();
};

export const getUserProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return res.json();
};

export const getCurrentUser = async () => {
  const token = getAuthToken();
  console.log("API: getCurrentUser called, token exists:", !!token);
  if (!token) {
    console.log("API: No token found");
    return null;
  }
  console.log("API: Making request to /api/protected");
  const res = await fetch(`${BASE_URL}/protected`, {
    headers: getAuthHeaders()
  });
  console.log("API: Response status:", res.status);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log("API: Response not ok, error:", errorData);
    return { message: errorData.message || "Not authenticated" };
  }
  const data = await res.json();
  console.log("API: Success, user data:", data);
  return data;
};

export const getTopUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/top`);
  if (!res.ok) return [];
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/all`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch developers network");
  }
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete user");
  }
  return res.json();
};

export const getArticles = async () => {
  const res = await fetch(`${BASE_URL}/articles/all`);
  if (!res.ok) return [];
  return res.json();
};

export const getChallenges = async () => {
  const res = await fetch(`${BASE_URL}/challenges/all`);
  if (!res.ok) return [];
  return res.json();
};

export const getMessages = async (userId) => {
  const res = await fetch(`${BASE_URL}/messages/${userId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) return [];
  return res.json();
};

export const getConversations = async () => {
  const res = await fetch(`${BASE_URL}/messages/conversations`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) return {};
  return res.json();
};

export const sendMessage = async (receiverId, text) => {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ receiverId, text })
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

export const updateUserProfile = async (data, id = null) => {
  const payload = { ...data };
  if (id) payload.targetId = id;

  const res = await fetch(`${BASE_URL}/users/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  return res.json();
};

// Admin API functions
export const adminLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const adminGetMe = async (adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/admin/auth/me`, {
    headers: { 'x-admin-auth-token': token }
  });
  return res.json();
};

export const adminDeleteUser = async (userId, adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/admin/auth/users/${userId}`, {
    method: "DELETE",
    headers: { 'x-admin-auth-token': token }
  });
  return res.json();
};

export const adminDeletePost = async (postId, adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/admin/auth/posts/${postId}`, {
    method: "DELETE",
    headers: { 'x-admin-auth-token': token }
  });
  return res.json();
};

// Notification API functions
export const createNotification = async (notificationData, adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'x-admin-auth-token': token
    },
    body: JSON.stringify(notificationData)
  });
  return res.json();
};

export const getNotifications = async () => {
  const res = await fetch(`${BASE_URL}/notifications`);
  return res.json();
};

export const getAdminNotifications = async (adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/notifications/all`, {
    headers: { 'x-admin-auth-token': token }
  });
  return res.json();
};

export const deleteNotification = async (notificationId, adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
    method: "DELETE",
    headers: { 'x-admin-auth-token': token }
  });
  return res.json();
};

export const toggleNotification = async (notificationId, adminToken) => {
  const token = adminToken || getAdminToken();
  const res = await fetch(`${BASE_URL}/notifications/${notificationId}/toggle`, {
    method: "PATCH",
    headers: { 'x-admin-auth-token': token }
  });
  return res.json();
};