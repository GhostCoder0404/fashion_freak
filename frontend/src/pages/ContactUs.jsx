
import React from "react";
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
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
      border-color: #f5576c;
      background: rgba(255,255,255,0.1);
    }
  }
`;

const SubmitBtn = styled.button`
  padding: 1rem;
  background: white;
  color: black;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export default function ContactUs() {
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
                        <FaPhone /> +1 (555) 123-4567
                    </InfoItem>
                    <InfoItem>
                        <FaMapMarkerAlt /> 123 Style Street, NY
                    </InfoItem>
                </InfoSide>

                <FormSide>
                    <Title>Get in Touch</Title>
                    <InputGroup>
                        <label>Name</label>
                        <input type="text" placeholder="John Doe" />
                    </InputGroup>
                    <InputGroup>
                        <label>Email</label>
                        <input type="email" placeholder="john@example.com" />
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
