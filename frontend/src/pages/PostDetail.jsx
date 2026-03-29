import React, { useEffect, useState, useContext } from "react";
import { getPost, comment, rate } from "../services/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PostDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [txt, setTxt] = useState("");
    const [score, setScore] = useState(5);
    useEffect(() => { getPost(id).then(setPost).catch(() => { }) }, [id]);

    async function sendComment() {
        if (!user) { alert("Login to comment"); return; }
        await comment({ post_id: id, user_id: user.id, text: txt });
        setTxt(""); // reload
        setPost(await getPost(id));
    }
    async function sendRating() {
        if (!user) { alert("Login to rate"); return; }
        await rate({ post_id: id, user_id: user.id, score });
        setPost(await getPost(id));
    }

    if (!post) return <div className="container" style={{ padding: 40 }}>Loading…</div>;
    return (
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, padding: 20 }}>
            <div>
                <img src={post.image_url} alt={post.caption} style={{ width: '100%', height: 520, objectFit: 'contain', borderRadius: 12, backgroundColor: '#f8fafc' }} />
                <div style={{ marginTop: 8 }}>
                    <h3>{post.title || "Untitled"}</h3>
                    <div style={{ color: '#64748B' }}>{post.caption}</div>
                </div>

                <div style={{ marginTop: 18 }}>
                    <h4>Comments</h4>
                    {post.comments && post.comments.length ? post.comments.map(c => (
                        <div key={c.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', gap: '10px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {c.user_avatar ? (
                                    <img src={c.user_avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#64748B' }}>{(c.user_username || "U")[0].toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700 }}>@{c.user_username}</div>
                                <div style={{ color: '#64748B', marginTop: 2 }}>{c.text}</div>
                            </div>
                        </div>
                    )) : <div className="muted">No comments yet</div>}
                    <div style={{ marginTop: 8 }}>
                        <textarea value={txt} onChange={e => setTxt(e.target.value)} style={{ width: '100%', minHeight: 80 }} />
                        <button onClick={sendComment} style={{ marginTop: 8 }}>Post Comment</button>
                    </div>
                </div>
            </div>

            <aside>
                <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: 700 }}>By @{post.owner_username}</div>
                    <div style={{ color: '#64748B', marginTop: 6 }}>Community rating: ★ {Number(post.community_rating || 0).toFixed(1)}</div>

                    <div style={{ marginTop: 12 }}>
                        <label>Rate this look (1-10)</label>
                        <input type="range" min="1" max="10" value={score} onChange={e => setScore(Number(e.target.value))} />
                        <div>{score}</div>
                        <button onClick={sendRating} style={{ marginTop: 8 }}>Submit Rating</button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
