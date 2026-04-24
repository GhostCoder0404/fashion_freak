
import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  padding: 100px 2rem;
  background: #0f0f0f;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    padding: 80px 1rem 2rem;
    align-items: flex-start;
  }
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 30px;
  display: flex;
  overflow: hidden;

  @media(max-width: 768px) {
    flex-direction: column;
  }
`;

const InfoSide = styled.div`
  flex: 1;
  padding: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  
  svg { font-size: 1.5rem; }
`;

const FormSide = styled.div`
  flex: 1.5;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #888;
    font-size: 0.9rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #a855f7;
      background: rgba(255,255,255,0.08);
      box-shadow: 0 0 10px rgba(168,85,247,0.2);
    }
  }
`;

const SubmitBtn = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #a855f7, #d946ef);
  color: white;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(168,85,247,0.4);
  }
`;

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Card
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <InfoSide>
          <h1>Let's Talk</h1>
          <p>Have some feedback or just want to say hi? We'd love to hear from you.</p>

          <InfoItem>
            <FaEnvelope /> hello@fashionfreak.com
          </InfoItem>
          <InfoItem>
            <FaPhone /> +91 8889461896
          </InfoItem>
          <InfoItem>
            <FaMapMarkerAlt /> Kohliyapuri, Durg, Chhattisgarh
          </InfoItem>
        </InfoSide>

        <FormSide>
          <Title>Get in Touch</Title>
          <InputGroup>
            <label>Name</label>
            <input type="text" placeholder="Your Name" />
          </InputGroup>
          <InputGroup>
            <label>Email</label>
            <input type="email" placeholder="Your Email" />
          </InputGroup>
          <InputGroup>
            <label>Message</label>
            <textarea rows="4" placeholder="Your thoughts..." />
          </InputGroup>
          <SubmitBtn>Send Message</SubmitBtn>
        </FormSide>
      </Card>
    </Container>
  );
}
