import React, { useEffect, useState } from "react";
import { fetchFeed } from "../services/api";
import PostCard from "../components/PostCard";

export default function Explore() {
    const [items, setItems] = useState([]);
    useEffect(() => { fetchFeed().then(setItems).catch(e => { console.error(e); }) }, []);
    return (
        <div className="container" style={{ padding: 24 }}>
            <h2>Explore</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 18 }}>
                {items.map(it => <PostCard key={it.id} p={it} />)}
            </div>
        </div>
    );
}
