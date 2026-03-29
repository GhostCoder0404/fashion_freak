
import React, { useEffect, useState, useContext } from "react";
import { profile, updateAvatar, fetchLikedPosts, deletePost, updateProfile } from "../services/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import styled from "styled-components";
import { FaCamera, FaHeart, FaLayerGroup, FaTrash, FaEdit } from "react-icons/fa";

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media(max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  cursor: pointer;
  
  &:hover .overlay { opacity: 1; }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 0;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.$active ? "#000" : "#999"};
  border-bottom: 2px solid ${props => props.$active ? "#000" : "transparent"};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover { color: #000; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

export default function Profile() {
    const { username } = useParams();
    const { user, login } = useContext(AuthContext); // Re-login to update user state if avatar changes
    const [data, setData] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [error, setError] = useState(null);
    const [editingBio, setEditingBio] = useState(false);
    const [newBio, setNewBio] = useState("");

    useEffect(() => {
        loadProfile();
    }, [username]);

    // Fetch liked posts when tab changes
    useEffect(() => {
        if (activeTab === "liked" && user && user.username === username) {
            fetchLikedPosts().then(setLikedPosts).catch(console.error);
        }
    }, [activeTab, user, username]);

    const loadProfile = () => {
        profile(username)
            .then(setData)
            .catch((err) => {
                console.error(err);
                setError("User not found.");
            });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await updateAvatar(formData);
            // Quick local update
            const newUser = { ...user, avatar: res.avatar };
            login(newUser); // HACK: Update context
            setData(prev => ({ ...prev, user: { ...prev.user, avatar: res.avatar } }));
        } catch (err) {
            console.error(err);
            alert("Failed to update avatar");
        }
    };

    const saveBio = async () => {
        try {
            await updateProfile({ bio: newBio });
            setData(prev => ({ ...prev, user: { ...prev.user, bio: newBio } }));
            setEditingBio(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update bio");
        }
    };

    if (error) return <div className="container" style={{ padding: 40, color: 'red' }}>{error}</div>;
    if (!data) return <div className="container" style={{ padding: 40 }}>Loading...</div>;

    const { user: u, posts } = data;
    const isMe = user && user.username === u.username;

    return (
        <div className="container" style={{ padding: "40px 24px" }}>
            <ProfileHeader>
                <AvatarWrapper>
                    <AvatarImg src={u.avatar || "https://via.placeholder.com/150"} alt={u.username} />
                    {isMe && (
                        <AvatarOverlay className="overlay">
                            <label style={{ cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaCamera />
                                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </AvatarOverlay>
                    )}
                </AvatarWrapper>

                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{u.username}</h1>

                    {isMe ? (
                        <div style={{ marginTop: '0.5rem' }}>
                            {editingBio ? (
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <input
                                        value={newBio}
                                        onChange={e => setNewBio(e.target.value)}
                                        style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
                                    />
                                    <button onClick={saveBio} style={{ background: 'black', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
                                    <button onClick={() => setEditingBio(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            ) : (
                                <p style={{ color: '#666', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {u.bio || "No bio yet."}
                                    <button onClick={() => { setEditingBio(true); setNewBio(u.bio || ""); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}><FaEdit /></button>
                                </p>
                            )}
                        </div>
                    ) : (
                        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {u.bio || "Fashion enthusiast ready to rate some fits!"}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontWeight: 'bold' }}>
                        <span>{posts.length} Posts</span>
                    </div>
                </div>
            </ProfileHeader>

            <Tabs>
                <Tab $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
                    <FaLayerGroup /> My Fits
                </Tab>
                {isMe && (
                    <Tab $active={activeTab === "liked"} onClick={() => setActiveTab("liked")}>
                        <FaHeart /> Liked Fits
                    </Tab>
                )}
            </Tabs>

            <Grid>
                {activeTab === "posts" && posts.map(p => (
                    <PostCard
                        key={p.id}
                        p={p}
                        onDelete={(id) => setData(prev => ({ ...prev, posts: prev.posts.filter(post => post.id !== id) }))}
                    />
                ))}
                {activeTab === "liked" && likedPosts.map(p => <PostCard key={p.id} p={p} />)}
            </Grid>

            {activeTab === "posts" && posts.length === 0 && <p style={{ color: '#999' }}>No posts yet.</p>}
            {activeTab === "liked" && likedPosts.length === 0 && <p style={{ color: '#999' }}>No liked posts yet.</p>}
        </div>
    );
}
