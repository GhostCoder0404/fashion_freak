
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import TopRated from "../components/TopRated";

const LinksSection = styled.div`
  padding: 4rem 0;
  background: #fff;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: #f8fafc;
  color: #0f172a;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
  
  &:hover {
    background: #000;
    color: #fff;
    transform: translateY(-2px);
  }
`;

const SplashScreen = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -2px;
`;

export default function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <SplashScreen
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            FashionFreak.
          </motion.div>
        </SplashScreen>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Hero />
          <HowItWorks />
          <TopRated />

          <LinksSection>
            <StyledLink to="/about">
              <FaInfoCircle size={20} /> About Us
            </StyledLink>
            <StyledLink to="/contact">
              <FaEnvelope size={20} /> Contact Us
            </StyledLink>
          </LinksSection>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
