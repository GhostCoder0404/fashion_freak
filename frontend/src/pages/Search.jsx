
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { searchUsers, buildImageUrl } from "../services/api";

const Container = styled(motion.div)`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at center, #222 0%, #000 100%);
  color: white;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  z-index: 10;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 2rem;
  padding-left: 4rem;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    background: rgba(255,255,255,0.1);
    box-shadow: 0 0 30px rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.3);
  }
`;

const SuggestionsBox = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 1rem;
  background: rgba(30,30,30,0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
`;

const SuggestionItem = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
  &:last-child { border-bottom: none; }
`;

const Avatar = styled.div`
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #333;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Icon = styled.div`
  position: absolute;
  left: 1.5rem;
  top: 28px;
  color: rgba(255,255,255,0.5);
  font-size: 1.5rem;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 7vw, 3rem);
  margin-bottom: 3rem;
  font-weight: 800;
  background: linear-gradient(to bottom, #fff, #666);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchUsers(q).then(res => setResults(res || [])).catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  function submit(e) {
    e.preventDefault();
    if (!q) return;
    nav(`/profile/${q}`);
  }

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Find Your Inspiration</Title>
      <SearchWrapper>
        <Icon><FaSearch /></Icon>
        <form onSubmit={submit}>
          <SearchInput
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search for a style icon..."
            autoFocus
          />
        </form>

        <AnimatePresence>
          {results.length > 0 && (
            <SuggestionsBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {results.map(u => (
                <SuggestionItem key={u.username} onClick={() => nav(`/profile/${u.username}`)}>
                  <Avatar>
                    <img src={buildImageUrl(u.avatar) || "https://via.placeholder.com/40"} alt={u.username} />
                  </Avatar>
                  <span style={{ fontSize: '1.2rem' }}>{u.username}</span>
                </SuggestionItem>
              ))}
            </SuggestionsBox>
          )}
        </AnimatePresence>
      </SearchWrapper>
      <div style={{ marginTop: '2rem', color: '#666' }}>
        Press Enter to search users
      </div>
    </Container>
  );
}
