import styled from "styled-components";
import { motion } from "framer-motion";
import loginBg from "../assets/loginbg.jpg";

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #000;
  color: #fff;
  overflow: hidden;
`;

export const SplitWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  @media(max-width: 900px) {
    flex-direction: column;
  }
`;

export const LeftPanel = styled.div`
  flex: 1.2;
  background: url(${loginBg}) center center/cover no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
  }
  @media(max-width: 900px) {
    flex: 0.4;
    padding: 40px;
  }
  @media(max-width: 600px) {
    flex: 0 0 200px;
    padding: 28px 24px;
  }
`;

export const LeftContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 480px;
`;

export const RightPanel = styled.div`
  flex: 0.8;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
`;

export const FormWrapper = styled(motion.div)`
  width: 100%;
  max-width: 400px;
`;

export const Title = styled.h2`
  font-family: ${p => p.theme.fonts.title};
  font-size: clamp(1.8rem, 5vw, 3rem);
  margin-bottom: 16px;
  color: #fff;
`;

export const SubTitle = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 32px;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding: 12px 0;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  &:focus {
    outline: none;
    border-bottom-color: #00c2b3;
  }
  &::placeholder {
    color: rgba(255,255,255,0.4);
  }
`;

export const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: #00c2b3;
  color: #000;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 24px;
  &:hover {
    background: #00e0d0;
  }
`;

export const SwitchText = styled.div`
  margin-top: 24px;
  text-align: center;
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  a {
    color: #00c2b3;
    font-weight: 600;
    margin-left: 6px;
    &:hover { text-decoration: underline; }
  }
`;

export const SocialLogin = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
`;
