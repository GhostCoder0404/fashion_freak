// frontend/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

let jwtToken = null;
export function setToken(t) {
    jwtToken = t;
}

async function request(path, opts = {}) {
    const headers = opts.headers || {};
    if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;

    // Auto-detect content type for FormData (browser handles it), otherwise default to JSON
    if (!(opts.body instanceof FormData)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw { status: res.status, body };
    return body;
}

export function predictScore(formData) {
    return request("/api/predict-score", { method: "POST", body: formData });
}

export function signup(user) {
    return request("/auth/signup", { method: "POST", body: JSON.stringify(user) });
}
export function login(payload) {
    return request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}
export function me() {
    return request("/users/me", { method: "GET" });
}
export function fetchFeed() {
    return request("/posts/feed", { method: "GET" });
}

export function createPost(data) {
    return request("/posts/create", { method: "POST", body: data });
}

export function getPost(id) {
    return request(`/posts/${id}`, { method: "GET" });
}

export function comment(data) {
    return request("/posts/comment", { method: "POST", body: JSON.stringify(data) });
}

export function rate(data) {
    return request("/posts/rate", { method: "POST", body: JSON.stringify(data) });
}

export function profile(username) {
    return request(`/users/profile/${username}`, { method: "GET" });
}

export function updateAvatar(formData) {
    return request("/users/update_avatar", { method: "POST", body: formData });
}

export function fetchLikedPosts() {
    return request("/users/liked_posts", { method: "GET" });
}

export function deletePost(id) {
    return request(`/posts/${id}`, { method: "DELETE" });
}

export function updateProfile(data) {
    return request("/users/update", { method: "POST", body: JSON.stringify(data) });
}

export function searchUsers(q) {
    return request(`/users/search?q=${q}`, { method: "GET" });
}
