import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.jpg";

const Section = styled.section`
  min-height: 85vh;
  display: flex;
  align-items: center;
  position: relative;
  background: url(${heroImg}) center/cover no-repeat fixed;
  color: white;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 1;
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: min(1200px, 94%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 0;
`;

const Content = styled(motion.div)`
  max-width: 720px;
`;

const Eyebrow = styled.div`
  color: ${p => p.theme.colors.accent1};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const Title = styled.h1`
  font-family: ${p => p.theme.fonts.title};
  font-size: clamp(2.5rem, 6vw, 4.8rem);
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0,0,0,0.6);
  
  span {
    display: block;
    color: ${p => p.theme.colors.accent1};
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  max-width: 56ch;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
`;

const CTA = styled.button`
  background: #fff;
  color: #0f1724;
  border: none;
  padding: 1rem 2.2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
  }
`;

const SecondaryCTA = styled.button`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2.2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
  }
`;

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Section>
      <Overlay />
      <Inner>
        <Content
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Eyebrow>Rate Your Style</Eyebrow>
          <Title>
            Smart Style.
            <span>Real Feedback.</span>
          </Title>
          <Subtitle>
            Upload your outfit and get instant AI analysis based on occasion and trends.
            Join the community to discover what works best for you.
          </Subtitle>
          <ButtonGroup>
            <CTA onClick={() => navigate('/try')}>Check My Rating</CTA>
            <SecondaryCTA onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Learn More
            </SecondaryCTA>
          </ButtonGroup>
        </Content>
      </Inner>
    </Section>
  );
}
