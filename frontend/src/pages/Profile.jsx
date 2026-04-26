
import React, { useEffect, useState, useContext } from "react";
import { profile, updateAvatar, fetchLikedPosts, deletePost, updateProfile, buildImageUrl, followUser, unfollowUser } from "../services/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import styled from "styled-components";
import { FaCamera, FaHeart, FaLayerGroup, FaTrash, FaEdit, FaRegImages } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 480px) {
    gap: 1rem;
  }
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

const MasonryGrid = styled.div`
  column-count: 3;
  column-gap: 18px;

  @media (max-width: 1000px) {
    column-count: 2;
  }
  @media (max-width: 640px) {
    column-count: 1;
  }

  & > * {
    break-inside: avoid;
    margin-bottom: 18px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  color: ${p => p.theme.colors.muted};
  background: ${p => p.theme.colors.panel};
  border-radius: 20px;
  border: 1px dashed ${p => p.theme.colors.border};
  
  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    color: ${p => p.theme.colors.text};
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
`;

const CreateBtnEmpty = styled(Link)`
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background: ${p => p.theme.colors.text};
  color: ${p => p.theme.colors.bg};
  border-radius: 50px;
  font-weight: bold;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const FollowButton = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$isFollowing ? "transparent" : props.theme.colors.text};
  color: ${props => props.$isFollowing ? props.theme.colors.text : props.theme.colors.bg};
  border: 2px solid ${props => props.$isFollowing ? props.theme.colors.border : props.theme.colors.text};

  &:hover {
    opacity: 0.8;
  }
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
    const [isFollowing, setIsFollowing] = useState(false);

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
            .then(res => {
                setData(res);
                if (user && res.user.followers && res.user.followers.includes(user.id)) {
                    setIsFollowing(true);
                } else {
                    setIsFollowing(false);
                }
            })
            .catch((err) => {
                console.error(err);
                setError("User not found.");
            });
    };
    
    useEffect(() => {
        if (data && user && data.user.followers) {
            setIsFollowing(data.user.followers.includes(user.id));
        }
    }, [data, user]);

    const handleFollowToggle = async () => {
        if (!user) return alert("Please login to follow");
        try {
            if (isFollowing) {
                await unfollowUser(username);
                setData(prev => ({
                    ...prev,
                    user: { 
                        ...prev.user, 
                        followers_count: Math.max(0, (prev.user.followers_count || 0) - 1),
                        followers: (prev.user.followers || []).filter(id => id !== user.id)
                    }
                }));
                setIsFollowing(false);
            } else {
                await followUser(username);
                setData(prev => ({
                    ...prev,
                    user: { 
                        ...prev.user, 
                        followers_count: (prev.user.followers_count || 0) + 1,
                        followers: [...(prev.user.followers || []), user.id]
                    }
                }));
                setIsFollowing(true);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update follow status");
        }
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
                    <AvatarImg src={buildImageUrl(u.avatar) || "https://via.placeholder.com/150"} alt={u.username} />
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{u.username}</h1>
                        {!isMe && (
                            <FollowButton $isFollowing={isFollowing} onClick={handleFollowToggle}>
                                {isFollowing ? "Following" : "Follow"}
                            </FollowButton>
                        )}
                    </div>

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

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', fontWeight: 'bold' }}>
                        <span>{posts.length} Posts</span>
                        <span>{u.followers_count || 0} Followers</span>
                        <span>{u.following_count || 0} Following</span>
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

            <MasonryGrid>
                {activeTab === "posts" && posts.map(p => (
                    <PostCard
                        key={p.id}
                        p={p}
                        onDelete={(id) => setData(prev => ({ ...prev, posts: prev.posts.filter(post => post.id !== id) }))}
                    />
                ))}
                {activeTab === "liked" && likedPosts.map(p => <PostCard key={p.id} p={p} />)}
            </MasonryGrid>

            {activeTab === "posts" && posts.length === 0 && (
                <EmptyState>
                    <FaRegImages />
                    <h3>No fits yet</h3>
                    <p>Time to show the world your style.</p>
                    {isMe && <CreateBtnEmpty to="/create">Create Your First Look</CreateBtnEmpty>}
                </EmptyState>
            )}
            
            {activeTab === "liked" && likedPosts.length === 0 && (
                <EmptyState>
                    <FaHeart />
                    <h3>No liked fits</h3>
                    <p>Explore the community and save your favorites.</p>
                    <CreateBtnEmpty to="/explore">Explore Outfits</CreateBtnEmpty>
                </EmptyState>
            )}
        </div>
    );
}
