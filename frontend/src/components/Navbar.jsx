import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FiPlusSquare, FiLogOut, FiUser, FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";
import { buildImageUrl } from "../services/api";

const Bar = styled.header`
  position: sticky; top:0; z-index:60;
  background: ${p => p.theme.colors.glass};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${p => p.theme.colors.border};
  transition: all 0.3s ease;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  width: min(1200px, 94%);
  margin: 0 auto;
`;

const Logo = styled.div`
  font-weight: 700;
  font-family: ${p => p.theme.fonts.title};
  font-size: 1.5rem;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 18px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavA = styled(Link)`
  padding: 8px 10px;
  border-radius: 8px;
  color: inherit;
  font-weight: 500;
  &:hover {
    background: rgba(2,6,23,0.03);
    transform: translateY(-2px);
    transition: all .18s ease;
  }
`;

const AvatarBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  &:hover { background: rgba(0,0,0,0.04); }
`;

const CreateBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${p => p.theme.colors.text};
  color: ${p => p.theme.colors.bg};
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
  &:hover { transform: rotate(15deg); }
`;

const HamburgerBtn = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${p => p.theme.colors.text};
  padding: 8px;
  align-items: center;
  justify-content: center;
  z-index: 70;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${p => p.$open ? 'flex' : 'none'};
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border-top: 1px solid ${p => p.theme.colors.border};
    background: ${p => p.theme.colors.glass};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
`;

const MobileNavA = styled(Link)`
  padding: 12px 16px;
  border-radius: 8px;
  color: inherit;
  font-weight: 500;
  font-size: 1rem;
  display: block;
  &:hover { background: rgba(0,0,0,0.05); }
`;

const MobileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <Bar>
      <Inner>
        <Logo>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>FashionFreak</Link>
        </Logo>

        {/* Desktop Nav */}
        <NavLinks>
          <NavA to="/">Home</NavA>
          <NavA to="/explore">Explore</NavA>
          <NavA to="/wardrobe">Wardrobe</NavA>
          <NavA to="/search">Search</NavA>
          <NavA to="/try" style={{
            background: 'linear-gradient(135deg, #00c2b3 0%, #009e91 100%)',
            color: 'white',
            fontWeight: 'bold',
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
                  {user.avatar ? <img src={buildImageUrl(user.avatar)} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(user.username || "U").slice(0, 1).toUpperCase()}</span>}
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
              <NavA to="/signup" style={{ background: mode === 'light' ? '#000' : '#fff', color: mode === 'light' ? '#fff' : '#000' }}>Sign up</NavA>
            </>
          )}
        </NavLinks>

        {/* Mobile: hamburger only (theme toggle is in NavLinks for desktop) */}
        <HamburgerBtn onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </HamburgerBtn>
      </Inner>

      {/* Mobile Menu */}
      <MobileMenu $open={menuOpen}>
        <MobileNavA to="/" onClick={closeMenu}>Home</MobileNavA>
        <MobileNavA to="/explore" onClick={closeMenu}>Explore</MobileNavA>
        <MobileNavA to="/wardrobe" onClick={closeMenu}>Wardrobe</MobileNavA>
        <MobileNavA to="/search" onClick={closeMenu}>Search</MobileNavA>
        <MobileNavA to="/try" onClick={closeMenu} style={{
          background: 'linear-gradient(135deg, #00c2b3 0%, #009e91 100%)',
          color: 'white',
          fontWeight: 'bold',
        }}>Rate My Fit ✨</MobileNavA>

        <button
          onClick={toggleTheme}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: '12px 16px', fontWeight: 500, fontSize: '1rem' }}
        >
          {mode === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>

        {user ? (
          <>
            <MobileNavA to="/create" onClick={closeMenu} style={{ background: mode === 'light' ? '#000' : '#fff', color: mode === 'light' ? '#fff' : '#000' }}>
              + Create Post
            </MobileNavA>
            <MobileRow>
              <AvatarBtn onClick={() => { nav(`/profile/${user.username}`); closeMenu(); }}>
                <div style={{ width: 34, height: 34, borderRadius: 999, overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                  {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{(user.username || "U").slice(0, 1).toUpperCase()}</span>}
                </div>
                <span style={{ fontWeight: 600 }}>{user.username}</span>
              </AvatarBtn>
              <button onClick={() => { logout(); nav("/"); closeMenu(); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiLogOut size={18} /> Logout
              </button>
            </MobileRow>
          </>
        ) : (
          <MobileRow>
            <MobileNavA to="/login" onClick={closeMenu}>Login</MobileNavA>
            <MobileNavA to="/signup" onClick={closeMenu} style={{ background: mode === 'light' ? '#000' : '#fff', color: mode === 'light' ? '#fff' : '#000', borderRadius: 8 }}>Sign up</MobileNavA>
          </MobileRow>
        )}
      </MobileMenu>
    </Bar>
  );
}
