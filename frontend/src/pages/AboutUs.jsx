
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaUserFriends, FaLightbulb, FaRocket } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  padding: 100px 2rem 4rem;
  background: #0f0f0f;
  color: white;
  display: flex;
  flex-direction: column;
  items-align: center;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #fff, #999);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled(motion.div)`
  margin: 4rem 0;
  padding: 3rem;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: #f5576c;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.8);
  max-width: 700px;
`;

export default function AboutUs() {
    return (
        <Container>
            <Content>
                <Title
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Reshaping Fashion
                </Title>

                <Section
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <IconWrapper><FaLightbulb /></IconWrapper>
                    <h2>Our Vision</h2>
                    <Text>
                        FashionFreak was born from a simple idea: style shouldn't be a guessing game.
                        We believe everyone deserves to feel confident in what they wear. By combining
                        cutting-edge AI technology with a vibrant community, we're democratizing fashion advice.
                    </Text>
                </Section>

                <Section
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <IconWrapper><FaUserFriends /></IconWrapper>
                    <h2>The Community</h2>
                    <Text>
                        We are more than just an app; we are a global collective of trendsetters,
                        style enthusiasts, and fashion-forward individuals. Whether you're prepping for a
                        prom or just hitting the gym, our community is here to hype you up.
                    </Text>
                </Section>

                <Section
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <IconWrapper><FaRocket /></IconWrapper>
                    <h2>The Tech</h2>
                    <Text>
                        Powered by advanced machine learning models, our "Rate My Fit" engine analyzes
                        thousands of datapoints to give you objective, constructive feedback on your outfits.
                        It's like having a personal stylist in your pocket, 24/7.
                    </Text>
                </Section>
            </Content>
        </Container>
    );
}
