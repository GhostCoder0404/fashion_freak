
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaMars, FaVenus, FaCloudUploadAlt, FaMagic, FaArrowLeft, FaCoffee, FaBlackTie, FaRing, FaDumbbell, FaCrown, FaHeart } from "react-icons/fa";
import * as api from "../services/api"; // We will add predictScore here
import { useNavigate } from "react-router-dom";

// --- STYLES ---

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
  padding-top: 80px; // Navbar space
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$bg || "#1a1a1a"};
  transition: background 0.8s ease-in-out;
  color: white;
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled(motion.div)`
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 3rem;
  max-width: 600px;
`;

// -- Gender Step --
const GenderContainer = styled.div`
  display: flex;
  gap: 4rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
`;

const GenderCircle = styled(motion.button)`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.15);
    transform: scale(1.05);
    border-color: rgba(255,255,255,0.5);
    box-shadow: 0 0 30px rgba(255,255,255,0.2);
  }

  svg {
    font-size: 4rem;
    color: white;
  }
  
  span {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
  }

  &.selected {
    background: white;
    color: black;
    svg, span { color: black; }
  }

  @media (max-width: 480px) {
    width: 180px;
    height: 180px;
    svg { font-size: 3rem; }
    span { font-size: 1.2rem; }
  }
`;

// -- Occasion Step --
const OccasionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
`;

const OccasionCard = styled(motion.button)`
  padding: 2rem;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-5px);
  }
`;

// -- Upload Step --
const UploadBox = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  height: 400px;
  border: 3px dashed rgba(255,255,255,0.3);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(255,255,255,0.8);
    background: rgba(0,0,0,0.3);
  }

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: rgba(255,255,255,0.7);
  
  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
`;

const AnalyzeButton = styled(motion.button)`
  margin-top: 3rem;
  padding: 1rem 4rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.9rem 2.5rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultRow = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

// -- Result Step --
const ResultContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background: rgba(0,0,0,0.6);
  padding: 3rem;
  border-radius: 30px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  max-width: 800px;
  width: 100%;

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    border-radius: 20px;
  }
`;

const ScoreCircle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.$color} ${props => props.$score * 36}deg,
    rgba(255,255,255,0.1) 0deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    background: #111;
    border-radius: 50%;
  }

  span {
    position: relative;
    z-index: 1;
    font-size: 4rem;
    font-weight: 800;
    color: ${props => props.$color};
  }
`;

const FeedbackText = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BackButton = styled.button`
  position: absolute;
  top: 100px;
  left: 40px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  z-index: 10;
  
  &:hover { opacity: 1; }

  @media (max-width: 768px) {
    top: 80px;
    left: 16px;
    font-size: 1.1rem;
  }
`;

// --- MAIN COMPONENT ---

const OCCASIONS = [
  { id: "casual", label: "Casual Hangout", color: "#FF7EB3", icon: <FaCoffee /> },
  { id: "formal", label: "Formal Event", color: "#2575FC", icon: <FaBlackTie /> },
  { id: "wedding", label: "Wedding Guest", color: "#FAD0C4", icon: <FaRing /> },
  { id: "gym", label: "Gym / Sport", color: "#84FAB0", icon: <FaDumbbell /> },
  { id: "prom", label: "Prom Night", color: "#667EEA", icon: <FaCrown /> },
  { id: "date", label: "Date Night", color: "#E0C3FC", icon: <FaHeart /> },
];

export default function TryOutfit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState("#1a1a1a");

  // Form Data
  const [gender, setGender] = useState(null);
  const [occasion, setOccasion] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleGenderSelect = (g) => {
    setGender(g);
    setBg(g === "male" ? "#141E30" : "#240b36"); // Deep Blue or Deep Purple
    setTimeout(() => setStep(1), 300);
  };

  const handleOccasionSelect = (occ) => {
    setOccasion(occ);
    // Gradient mix based on occasion
    if (occ.id === "casual") setBg("linear-gradient(to right, #cc2b5e, #753a88)");
    if (occ.id === "formal") setBg("linear-gradient(to right, #243949, #517fa4)");
    if (occ.id === "wedding") setBg("linear-gradient(to right, #ff9a9e, #fecfef)");
    if (occ.id === "gym") setBg("linear-gradient(to right, #11998e, #38ef7d)");
    if (occ.id === "prom") setBg("linear-gradient(to right, #6a11cb, #2575fc)");

    setTimeout(() => setStep(2), 300);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleAnalyze = async () => {
    if (!file || !gender || !occasion) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("gender", gender);
      formData.append("occasion", occasion.id);

      const res = await api.predictScore(formData);
      setResult(res);
      setStep(3);
    } catch (err) {
      alert("Something went wrong! Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setGender(null);
    setOccasion(null);
    setFile(null);
    setPreview(null);
    setResult(null);
    setBg("#1a1a1a");
  };

  const getScoreColor = (s) => {
    if (s >= 8) return "#00ff87";
    if (s >= 5) return "#ffeb3b";
    return "#ff0055";
  };

  return (
    <PageContainer $bg={bg}>
      {step > 0 && <BackButton onClick={() => {
        if (step === 3) reset();
        else setStep(step - 1);
      }}><FaArrowLeft /> Back</BackButton>}

      <AnimatePresence mode="wait">

        {/* STEP 0: GENDER */}
        {step === 0 && (
          <ContentWrapper
            key="gender"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Title>Who are we styling?</Title>
            <Subtitle>Select your gender to help the AI understand your fit.</Subtitle>
            <GenderContainer>
              <GenderCircle onClick={() => handleGenderSelect("male")}>
                <FaMars />
                <span>Male</span>
              </GenderCircle>
              <GenderCircle onClick={() => handleGenderSelect("female")}>
                <FaVenus />
                <span>Female</span>
              </GenderCircle>
            </GenderContainer>
          </ContentWrapper>
        )}

        {/* STEP 1: OCCASION */}
        {step === 1 && (
          <ContentWrapper
            key="occasion"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <Title>What's the Occasion?</Title>
            <Subtitle>Context is everything. Tell us where you're going.</Subtitle>
            <OccasionGrid>
              {OCCASIONS.map((occ) => (
                <OccasionCard
                  key={occ.id}
                  onClick={() => handleOccasionSelect(occ)}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: "2.5rem", color: occ.color }}>{occ.icon}</span>
                  {occ.label}
                </OccasionCard>
              ))}
            </OccasionGrid>
          </ContentWrapper>
        )}

        {/* STEP 2: UPLOAD */}
        {step === 2 && (
          <ContentWrapper
            key="upload"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Title>Show us the Fit</Title>
            <Subtitle>Upload a clear photo of your outfit.</Subtitle>

            <UploadBox whileHover={{ scale: 1.02 }}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <UploadContent>
                  <FaCloudUploadAlt />
                  <h3>Click or Drag Image Here</h3>
                </UploadContent>
              )}
            </UploadBox>

            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!file || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Analyzing..." : "Rate My Fit ✨"}
            </AnalyzeButton>
          </ContentWrapper>
        )}

        {/* STEP 3: RESULT */}
        {step === 3 && result && (
          <ContentWrapper
            key="result"
            initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <ResultContainer>
              <Title style={{ margin: "0 0 2rem 0", fontSize: '2.5rem' }}>The Verdict</Title>

              <ResultRow>

                {/* LEFT: Image & Score */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", flex: 1 }}>
                  <img
                    src={preview}
                    alt="Your Fit"
                    style={{ width: "100%", maxWidth: "300px", aspectRatio: "3/4", objectFit: "cover", borderRadius: "15px", border: "2px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                  />
                  <ScoreCircle $score={result.score} $color={getScoreColor(result.score)}>
                    <span>{result.score}</span>
                  </ScoreCircle>
                </div>

                {/* RIGHT: Analysis & Recommendation */}
                <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '15px', width: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#00c2b3' }}>Analysis</h3>
                    <p style={{ lineHeight: 1.6, fontSize: '1.1rem', color: '#e2e8f0' }}>{result.compliment}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ff6b6b' }}>Recommendation</h3>
                    <p style={{ lineHeight: 1.6, fontSize: '1.1rem', color: '#e2e8f0' }}>{result.recommendation}</p>
                  </div>
                </div>

              </ResultRow>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <AnalyzeButton onClick={reset}>
                  Try Another Outfit
                </AnalyzeButton>
                <AnalyzeButton
                  onClick={() => navigate("/outfit-analysis", {
                    state: { preview, file, gender, occasion: occasion?.id }
                  })}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 10px 30px rgba(118,75,162,0.4)' }}
                >
                  🔍 Detailed Analysis
                </AnalyzeButton>
              </div>
            </ResultContainer>
          </ContentWrapper>
        )}

      </AnimatePresence>
    </PageContainer>
  );
}
