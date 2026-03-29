
import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { deletePost } from "../services/api";
import { FaTrash } from "react-icons/fa";

const Card = styled.div`
  background:white; border-radius:12px; overflow:hidden;
  box-shadow:0 18px 40px rgba(2,6,23,0.06); display:flex; flex-direction:column;
  position: relative;
  transition: transform 0.2s;
  
  &:hover { transform: translateY(-5px); }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; alignItems: center; justifyContent: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover { background: red; }
`;

export default function PostCard({ p, onDelete }) {
    const { user } = useContext(AuthContext);
    const isOwner = user && user.username === p.owner_username;

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this post?")) return;
        try {
            await deletePost(p.id);
            if (onDelete) onDelete(p.id);
            else window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    };

    return (
        <Card>
            {isOwner && <DeleteBtn onClick={handleDelete}><FaTrash size={14} /></DeleteBtn>}
            <Link to={`/post/${p.id}`}>
                <div style={{ height: 360, overflow: 'hidden' }}>
                    <img src={p.image_url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f8fafc' }} />
                </div>
                <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.title || "Untitled"}</div>
                    <div style={{ color: '#64748B', marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <div>@{p.owner_username}</div>
                        <div style={{ fontWeight: 'bold' }}>★ {Number(p.community_rating || 0).toFixed(1)}</div>
                    </div>
                </div>
            </Link>
        </Card>
    );
}
