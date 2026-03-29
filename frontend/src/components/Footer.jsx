import React from "react";
import { FaInstagram, FaTwitter, FaFacebook, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer style={{ padding: 36, background: '#f8fafc', marginTop: 40 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700 }}>FashionFreak</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <a href="#" aria-label="instagram"><FaInstagram size={18} color="#111827" /></a>
                    <a href="#" aria-label="twitter"><FaTwitter size={18} color="#111827" /></a>
                    <a href="#" aria-label="facebook"><FaFacebook size={18} color="#111827" /></a>
                    <a href="#" aria-label="github"><FaGithub size={18} color="#111827" /></a>
                </div>
                <div style={{ color: '#64748B' }}>© {new Date().getFullYear()}</div>
            </div>
        </footer>
    );
}
