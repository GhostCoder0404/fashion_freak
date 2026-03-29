import React, { useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FiPlusSquare, FiLogOut, FiUser, FiMoon, FiSun } from "react-icons/fi";

const Bar = styled.header`
  position: sticky; top:0; z-index:60;
  background: ${p => p.theme.colors.glass};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${p => p.theme.colors.border};
  transition: all 0.3s ease;
`;
const Inner = styled.div` display:flex; justify-content:space-between; align-items:center; padding:14px 0; width:min(1200px,94%); margin:0 auto; `;
const Logo = styled.div` font-weight:700; font-family: ${p => p.theme.fonts.title}; font-size: 1.5rem;`;
const NavLinks = styled.nav` display:flex; gap:18px; align-items:center; `;
const NavA = styled(Link)` padding:8px 10px; border-radius:8px; color:inherit; font-weight: 500; &:hover{ background: rgba(2,6,23,0.03); transform: translateY(-2px); transition: all .18s ease; }`;
const AvatarBtn = styled.button` display:flex; align-items:center; gap:10px; border:none; background:transparent; cursor:pointer; padding: 4px 8px; border-radius: 8px; &:hover { background: rgba(0,0,0,0.04); }`;

const CreateBtn = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;
    &:hover {
        background: #333;
        transform: translateY(-1px);
    }
`;

const ToggleBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${p => p.theme.colors.text};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: rotate(15deg);
  }
`;

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { mode, toggleTheme } = useContext(ThemeContext);
    const nav = useNavigate();

    return (
        <Bar>
            <Inner>
                <Logo><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>FashionFreak</Link></Logo>
                <NavLinks>
                    <NavA to="/">Home</NavA>
                    <NavA to="/explore">Explore</NavA>
                    <NavA to="/search">Search</NavA>
                    <NavA to="/try" style={{
                        background: 'linear-gradient(135deg, #00c2b3 0%, #009e91 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none'
                    }}>Rate My Fit ✨</NavA>

                    <ToggleBtn onClick={toggleTheme} aria-label="Toggle Theme">
                        {mode === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </ToggleBtn>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <CreateBtn to="/create">
                                <FiPlusSquare size={18} />
                                <span>Create</span>
                            </CreateBtn>

                            <AvatarBtn onClick={() => nav(`/profile/${user.username}`)}>
                                <div style={{ width: 34, height: 34, borderRadius: 999, overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                    {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(user.username || "U").slice(0, 1).toUpperCase()}</span>}
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.username}</div>
                            </AvatarBtn>

                            <button onClick={() => { logout(); nav("/"); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }} title="Log out">
                                <FiLogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <NavA to="/login">Login</NavA>
                            <NavA to="/signup" style={{ background: '#000', color: '#fff' }}>Sign up</NavA>
                        </>
                    )}
                </NavLinks>
            </Inner>
        </Bar>
    );
}
