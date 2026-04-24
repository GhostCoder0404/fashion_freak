import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostCard from "./PostCard";
import { fetchFeed } from "../services/api";

const Section = styled.section` padding: 36px 0; background: #fafafa; `;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  max-width: 1200px;
  margin: 12px auto;
  padding: 0 16px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default function TopRated() {
    const [items, setItems] = useState(null);
    useEffect(() => {
        fetchFeed().then(data => {
            // sort by community_rating desc and take top 3
            const sorted = (data || []).sort((a, b) => (b.community_rating || 0) - (a.community_rating || 0));
            setItems(sorted.slice(0, 3));
        }).catch(err => {
            console.error("Feed fetch error", err);
            setItems([]);
        });
    }, []);
    return (
        <Section>
            <div className="container">
                <h3>Top Rated Looks</h3>
                <p style={{ color: '#64748B' }}>Inspiration from our highest-scoring community members.</p>

                {items === null ? (
                    <div style={{ padding: 24 }}>Loading...</div>
                ) : items.length === 0 ? (
                    <div style={{ padding: 24, color: '#64748B', background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.04)' }}>
                        No cards available
                    </div>
                ) : (
                    <Grid>
                        {items.map(m => <PostCard key={m.id} p={m} />)}
                    </Grid>
                )}
            </div>
        </Section>
    );
}
