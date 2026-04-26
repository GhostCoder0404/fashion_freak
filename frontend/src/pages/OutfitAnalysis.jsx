import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaStar, FaCheckCircle, FaTimesCircle, FaLightbulb, FaTshirt, FaDownload } from "react-icons/fa";
import { outfitDetailedAnalysis } from "../services/api";

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const breathe = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(240,80,160,0.3); }
  50% { box-shadow: 0 0 60px rgba(240,80,160,0.7); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fillBar = keyframes`
  from { width: 0%; }
  to { width: var(--target-width); }
`;

// ─── STYLED COMPONENTS ────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding-top: 80px;
  color: white;
  font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackBtn = styled.button`
  position: fixed;
  top: 100px;
  left: 30px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
  z-index: 100;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.18);
    transform: translateX(-3px);
  }

  @media (max-width: 768px) {
    top: 80px;
    left: 10px;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
`;

// ── Loading State ──
const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255,255,255,0.1);
  border-top-color: #f050a0;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  background: linear-gradient(to right, #f093fb, #f5576c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const LoadingSubtext = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 1rem;
  text-align: center;
`;

// ── Page Header ──
const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #f093fb 50%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  color: rgba(255,255,255,0.55);
  font-size: 1.1rem;
`;

// ── Two-column layout ──
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// ── Left: Image + Rating circle ──
const ImageCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
`;

const OutfitImg = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
`;

const RatingBadge = styled.div`
  padding: 1.5rem;
  text-align: center;
  background: rgba(0,0,0,0.3);
`;

const RatingNumber = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: ${props => props.$color};
  line-height: 1;
  animation: ${breathe} 3s ease-in-out infinite;
`;

const RatingLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.$color};
  margin-top: 0.3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const RatingSubline = styled.div`
  color: rgba(255,255,255,0.45);
  font-size: 0.85rem;
  margin-top: 0.3rem;
`;

// ── Right: Details ──
const DetailsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(14px);
`;

const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.8rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.$color || '#fff'};
  margin-bottom: 0.7rem;
`;

const DescText = styled.p`
  color: rgba(255,255,255,0.8);
  line-height: 1.75;
  font-size: 1.05rem;
`;

// ── Color swatches ──
const ColorRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.5rem;
`;

const ColorChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50px;
  font-size: 0.9rem;
`;

const ColorDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 1px solid rgba(255,255,255,0.3);
  flex-shrink: 0;
`;

// ── Tags ──
const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.35rem 1rem;
  background: rgba(240, 80, 160, 0.15);
  border: 1px solid rgba(240, 80, 160, 0.3);
  border-radius: 50px;
  font-size: 0.85rem;
  color: #f8b4d9;
`;

// ── Pros / Cons ──
const ListItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85);
  font-size: 1rem;
  line-height: 1.5;

  &:last-child {
    border-bottom: none;
  }

  svg {
    flex-shrink: 0;
    margin-top: 3px;
  }
`;

// ── Occasion Score Bar ──
const BarWrapper = styled.div`
  margin-top: 0.7rem;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(255,255,255,0.08);
  border-radius: 50px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 50px;
  background: linear-gradient(to right, #f093fb, #f5576c);
  width: ${props => props.$pct}%;
  transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
`;

const BarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.4rem;
`;

// ── Stylist Tip ──
const TipBox = styled(motion.div)`
  background: linear-gradient(135deg, rgba(240,80,160,0.12), rgba(102,78,234,0.12));
  border: 1px solid rgba(240,80,160,0.25);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const TipIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const TipText = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1.05rem;
  line-height: 1.7;
  font-style: italic;
`;

// ── Error State ──
const ErrorBox = styled.div`
  background: rgba(255,50,50,0.1);
  border: 1px solid rgba(255,50,50,0.3);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: #ff8080;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 4rem auto;
`;

const RetryBtn = styled.button`
  margin-top: 1.5rem;
  padding: 0.8rem 2.5rem;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────
function getRatingColor(score) {
  if (score >= 8.5) return "#00ff87";
  if (score >= 7) return "#7bed9f";
  if (score >= 5) return "#ffd32a";
  if (score >= 3) return "#ff9f43";
  return "#ff4757";
}

// Simple color name → CSS color approximation
const COLOR_MAP = {
  "navy blue": "#1a1a6e",
  "navy": "#1a1a6e",
  "white": "#f5f5f5",
  "off-white": "#fafaf0",
  "black": "#222",
  "red": "#e84118",
  "blue": "#0097e6",
  "green": "#44bd32",
  "yellow": "#fbc531",
  "pink": "#ff4a8d",
  "purple": "#9c59d1",
  "orange": "#e55207",
  "beige": "#d2b48c",
  "grey": "#747d8c",
  "gray": "#747d8c",
  "brown": "#8b4513",
  "olive": "#808000",
  "teal": "#00cec9",
  "maroon": "#800000",
  "cream": "#fffdd0",
  "khaki": "#c3b091",
};

function colorToCSS(name) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  // fallback gradient
  return "linear-gradient(135deg, #f093fb, #f5576c)";
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function OutfitAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();

  // State received from TryOutfit page via navigate state
  const { preview, file: fileState, gender, occasion } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    if (!fileState) {
      setError("No image detected. Please go back and try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("file", fileState);
      formData.append("gender", gender || "unisex");
      formData.append("occasion", occasion || "casual");

      const res = await outfitDetailedAnalysis(formData);
      setAnalysis(res.analysis);
    } catch (err) {
      console.error(err);
      setError(
        err?.body?.detail ||
        "Analysis failed. Please check the backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReportCard = async () => {
    if (!preview || !analysis) return;
    
    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920; // 9:16 aspect ratio for Instagram stories
    const ctx = canvas.getContext("2d");

    // 1. Draw Background (Gradient)
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, "#0f0c29");
    bgGradient.addColorStop(0.5, "#302b63");
    bgGradient.addColorStop(1, "#24243e");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Load User Image
    const img = new Image();
    img.src = preview;
    await new Promise((resolve) => { img.onload = resolve; });

    // Draw image in the center
    const imgWidth = 800;
    const imgHeight = 1066; // 3:4 ratio
    const imgX = (canvas.width - imgWidth) / 2;
    const imgY = 250;
    
    // Draw white border/card behind image
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.roundRect(imgX - 20, imgY - 20, imgWidth + 40, imgHeight + 40, [30]);
    ctx.fill();

    // Draw the actual image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgWidth, imgHeight, [20]);
    ctx.clip();
    
    // Object-cover logic
    const imgRatio = img.width / img.height;
    const targetRatio = imgWidth / imgHeight;
    let drawWidth = imgWidth;
    let drawHeight = imgHeight;
    let offsetX = 0;
    let offsetY = 0;
    
    if (imgRatio > targetRatio) {
      drawWidth = imgHeight * imgRatio;
      offsetX = (imgWidth - drawWidth) / 2;
    } else {
      drawHeight = imgWidth / imgRatio;
      offsetY = (imgHeight - drawHeight) / 2;
    }
    
    ctx.drawImage(img, imgX + offsetX, imgY + offsetY, drawWidth, drawHeight);
    ctx.restore();

    // 3. Draw Header text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 70px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FASHION FREAK", canvas.width / 2, 120);
    
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText("AI Outfit Analysis", canvas.width / 2, 180);

    // 4. Draw Score Circle
    const scoreText = Number(analysis.overall_rating).toFixed(1);
    const scoreColor = getRatingColor(analysis.overall_rating);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, imgY + imgHeight + 150, 100, 0, 2 * Math.PI);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.lineWidth = 15;
    ctx.strokeStyle = scoreColor;
    ctx.stroke();

    // Draw Score
    ctx.fillStyle = scoreColor;
    ctx.font = "bold 80px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(scoreText, canvas.width / 2, imgY + imgHeight + 150);

    // 5. Draw Rating Label & Occasion
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 50px sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(analysis.rating_label.toUpperCase(), canvas.width / 2, imgY + imgHeight + 330);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "40px sans-serif";
    const gen = gender ? gender.toUpperCase() : "UNISEX";
    const occ = occasion ? occasion.toUpperCase() : "CASUAL";
    ctx.fillText(`${gen} • ${occ}`, canvas.width / 2, imgY + imgHeight + 400);

    // 6. Download Image
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fashion-freak-report-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ratingColor = analysis ? getRatingColor(analysis.overall_rating) : "#f093fb";

  return (
    <Page>
      <BackBtn onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </BackBtn>

      <Container>
        {/* ── LOADING ── */}
        {loading && (
          <LoadingWrapper>
            <Spinner />
            <LoadingText>🔍 Analyzing Your Outfit...</LoadingText>
            <LoadingSubtext>
              The AI model is analyzing your outfit.<br />
              Please wait — this might take 10-20 seconds.
            </LoadingSubtext>
          </LoadingWrapper>
        )}

        {/* ── ERROR ── */}
        {!loading && error && (
          <ErrorBox>
            <p>⚠️ {error}</p>
            <RetryBtn onClick={runAnalysis}>Retry Analysis</RetryBtn>
          </ErrorBox>
        )}

        {/* ── RESULT ── */}
        <AnimatePresence>
          {!loading && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PageHeader
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PageTitle>Detailed Outfit Analysis</PageTitle>
                <PageSubtitle>Powered by AI Vision · {gender} · {occasion}</PageSubtitle>
              </PageHeader>

              <TwoCol>
                {/* ══ LEFT COLUMN ══ */}
                <ImageCard
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {preview && <OutfitImg src={preview} alt="Your Outfit" />}
                  <RatingBadge>
                    <RatingNumber $color={ratingColor}>
                      {Number(analysis.overall_rating).toFixed(2)}
                    </RatingNumber>
                    <RatingLabel $color={ratingColor}>
                      {analysis.rating_label}
                    </RatingLabel>
                    <RatingSubline>Overall Rating / 10</RatingSubline>
                  </RatingBadge>
                </ImageCard>

                {/* ══ RIGHT COLUMN ══ */}
                <DetailsCol>

                  {/* Full Description */}
                  <InfoCard
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <SectionLabel>About This Outfit</SectionLabel>
                    <SectionTitle $color="#f8b4d9">
                      <FaTshirt style={{ marginRight: "0.5rem" }} />
                      {analysis.clothing_type}
                    </SectionTitle>
                    <DescText>{analysis.full_description}</DescText>
                  </InfoCard>

                  {/* Colors & Style */}
                  <InfoCard
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <SectionLabel>Color Palette</SectionLabel>
                    <ColorRow>
                      {(analysis.primary_colors || []).map((c, i) => (
                        <ColorChip key={i}>
                          <ColorDot color={colorToCSS(c)} />
                          {c}
                        </ColorChip>
                      ))}
                    </ColorRow>
                    <DescText style={{ marginTop: "0.8rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>
                      {analysis.color_harmony}
                    </DescText>

                    <SectionLabel style={{ marginTop: "1.2rem" }}>Style Tags</SectionLabel>
                    <TagRow>
                      <Tag>{analysis.style_category}</Tag>
                      {analysis.fabric_estimate && <Tag>🧵 {analysis.fabric_estimate}</Tag>}
                      {analysis.fit_assessment && <Tag>📐 {analysis.fit_assessment.split(",")[0]}</Tag>}
                    </TagRow>
                  </InfoCard>

                  {/* Occasion Suitability */}
                  <InfoCard
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <SectionLabel>Occasion Suitability — {occasion}</SectionLabel>
                    <BarLabel>
                      <span>Match Score</span>
                      <span>{analysis.occasion_suitability}/10</span>
                    </BarLabel>
                    <BarTrack>
                      <BarFill $pct={(analysis.occasion_suitability / 10) * 100} />
                    </BarTrack>
                    <DescText style={{ marginTop: "0.8rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.65)" }}>
                      {analysis.occasion_verdict}
                    </DescText>
                  </InfoCard>

                  {/* Pros & Cons */}
                  <InfoCard
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <SectionLabel>What's Working</SectionLabel>
                    {(analysis.pros || []).map((p, i) => (
                      <ListItem key={i}>
                        <FaCheckCircle color="#00b894" />
                        {p}
                      </ListItem>
                    ))}

                    <SectionLabel style={{ marginTop: "1.2rem" }}>Room for Improvement</SectionLabel>
                    {(analysis.cons || []).map((c, i) => (
                      <ListItem key={i}>
                        <FaTimesCircle color="#ff6b6b" />
                        {c}
                      </ListItem>
                    ))}
                  </InfoCard>

                </DetailsCol>
              </TwoCol>

              {/* ── Stylist Tip Banner ── */}
              {analysis.stylist_tip && (
                <TipBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ marginTop: "2rem" }}
                >
                  <TipIcon><FaLightbulb color="#ffd32a" /></TipIcon>
                  <div>
                    <SectionLabel>Stylist's Personal Tip</SectionLabel>
                    <TipText>"{analysis.stylist_tip}"</TipText>
                  </div>
                </TipBox>
              )}

              {/* Bottom action */}
              <div style={{ textAlign: "center", marginTop: "3rem", marginBottom: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={downloadReportCard}
                  style={{
                    padding: "1rem 2.5rem",
                    background: "transparent",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderRadius: "50px",
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  <FaDownload /> Download Story
                </button>
                <button
                  onClick={() => navigate("/try")}
                  style={{
                    padding: "1rem 3rem",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    border: "none",
                    borderRadius: "50px",
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(245,87,108,0.35)",
                  }}
                >
                  ✨ Try Another Outfit
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Page>
  );
}
