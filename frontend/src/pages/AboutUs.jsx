import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaUserFriends, FaLightbulb, FaRocket, FaSearch, FaTshirt, FaRobot } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 6rem;
  background: #0f0f0f;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 100px 1.5rem 4rem;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255,255,255,0.6);
  max-width: 700px;
  margin: 0 auto 4rem auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(motion.div)`
  padding: 3rem 2.5rem;
  background: rgba(255,255,255,0.02);
  border-radius: 24px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(168, 85, 247, 0.4);
    background: rgba(255,255,255,0.04);
  }
`;

const IconWrapper = styled.div`
  font-size: 3.5rem;
  color: #c084fc;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 15px rgba(192, 132, 252, 0.6));
`;

const Heading = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const Text = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
  max-width: 400px;
`;

export default function AboutUs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: <FaLightbulb />,
            title: "Our Vision",
            desc: "FashionFreak was born from a simple idea: style shouldn't be a guessing game. We believe everyone deserves to feel confident in what they wear, removing the friction from fashion discovery."
        },
        {
            icon: <FaRobot />,
            title: "AI 'Rate My Fit'",
            desc: "Powered by our advanced Machine Learning Vision Engine. Upload your outfit, tell us the occasion, and immediately receive an objective 1-10 rating, professional critique, and actionable recommendations to elevate your look."
        },
        {
            icon: <FaSearch />,
            title: "Detailed Analysis",
            desc: "Go beyond the surface. We provide deep visual breakdowns of your look, picking out the dominant color palettes, identifying fabric aesthetics, and detailing the pros and cons of your styling choices."
        },
        {
            icon: <FaTshirt />,
            title: "Shop The Look",
            desc: "Our AI breaks down your image into distinct clothing pieces (e.g., 'Baggy Jeans', 'Red Overshirt') and provides direct search links to platforms like Myntra, Amazon, and Pinterest so you can buy exact matches instantly."
        },
        {
            icon: <FaUserFriends />,
            title: "The Community",
            desc: "Join a growing social feed of trendsetters. Rate other's outfits, explore trending global aesthetics, and gather inspiration directly from our responsive platform."
        },
        {
            icon: <FaRocket />,
            title: "Modern Tech Stack",
            desc: "Crafted with cutting-edge technologies: React for dynamic UIs, styled-components for sleek glassmorphism, FastAPI for robust backend services, and a custom Machine Learning pipeline for real-time inference."
        }
    ];

    return (
        <Container>
            <Content>
                <Title
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    We Are FashionFreak
                </Title>
                <Subtitle
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Your personal AI stylist, visual search engine, and digital fashion community built into one premium platform.
                </Subtitle>

                <Grid>
                    {sections.map((sec, index) => (
                        <Section
                            key={sec.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <IconWrapper>{sec.icon}</IconWrapper>
                            <Heading>{sec.title}</Heading>
                            <Text>{sec.desc}</Text>
                        </Section>
                    ))}
                </Grid>
            </Content>
        </Container>
    );
}
