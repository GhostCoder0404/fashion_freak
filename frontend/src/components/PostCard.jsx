
import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { deletePost, buildImageUrl } from "../services/api";
import { FaTrash } from "react-icons/fa";

const Card = styled.div`
  background: ${p => p.theme.colors.panel};
  border-radius:12px; overflow:hidden;
  border: 1px solid ${p => p.theme.colors.border};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display:flex; flex-direction:column;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: ${p => p.theme.colors.accent1};
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover { background: red; }
`;

const ImgWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 200px; /* prevents layout shift on slow load */
  background: rgba(0,0,0,0.02);
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
                <ImgWrapper>
                    <img src={buildImageUrl(p.image_url)} alt={p.caption} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', backgroundColor: 'transparent' }} />
                </ImgWrapper>
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
