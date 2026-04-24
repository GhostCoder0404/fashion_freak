import React, { useEffect, useState } from "react";
import { fetchFeed } from "../services/api";
import PostCard from "../components/PostCard";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PageTitle = styled.h2`
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 800;
`;

export default function Explore() {
    const [items, setItems] = useState([]);
    useEffect(() => { fetchFeed().then(setItems).catch(e => { console.error(e); }) }, []);
    return (
        <div className="container" style={{ padding: '24px 0' }}>
            <PageTitle>Explore</PageTitle>
            <Grid>
                {items.map(it => <PostCard key={it.id} p={it} />)}
            </Grid>
        </div>
    );
}
