import React, { useEffect, useState, useContext } from "react";
import { fetchFeed, fetchFollowingFeed } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const MasonryGrid = styled.div`
  column-count: 3;
  column-gap: 18px;
  margin-top: 24px;

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

const SkeletonCard = styled.div`
  background: ${p => p.theme.colors.panel};
  border-radius: 12px;
  height: ${props => props.height}px;
  width: 100%;
  border: 1px solid ${p => p.theme.colors.border};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    animation: ${shimmer} 1.5s infinite ease-in-out;
  }
`;

const PageTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  font-family: ${p => p.theme.fonts.title};
`;

const Subtitle = styled.p`
  color: ${p => p.theme.colors.muted};
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 1rem 0;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.text : props.theme.colors.muted};
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.text : "transparent"};
  cursor: pointer;
  
  &:hover { color: ${p => p.theme.colors.text}; }
`;

export default function Explore() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedType, setFeedType] = useState("for_you");

    useEffect(() => { 
      setLoading(true);
      const fetchFunc = feedType === "following" ? fetchFollowingFeed : fetchFeed;
      fetchFunc()
        .then(res => {
          setItems(res);
          setLoading(false);
        })
        .catch(e => { 
          console.error(e); 
          setLoading(false);
        });
    }, [feedType]);

    // Random heights for skeletons to simulate masonry look
    const skeletonHeights = [300, 450, 350, 500, 280, 400];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <PageTitle>Explore</PageTitle>
            <Subtitle>Discover the latest community outfits.</Subtitle>

            {user && (
                <Tabs>
                    <Tab $active={feedType === "for_you"} onClick={() => setFeedType("for_you")}>
                        For You
                    </Tab>
                    <Tab $active={feedType === "following"} onClick={() => setFeedType("following")}>
                        Following
                    </Tab>
                </Tabs>
            )}
            
            <MasonryGrid>
                {loading ? (
                    skeletonHeights.map((h, i) => <SkeletonCard key={i} height={h} />)
                ) : (
                    items.map(it => <PostCard key={it.id} p={it} />)
                )}
            </MasonryGrid>
            
            {!loading && items.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#999' }}>
                    {feedType === "following" ? (
                        <p>You aren't following anyone with posts yet. Go explore!</p>
                    ) : (
                        <p>No posts found. Be the first to post!</p>
                    )}
                </div>
            )}
        </div>
    );
}
