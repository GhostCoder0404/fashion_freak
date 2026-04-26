import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { findSimilarProducts, buildImageUrl, addWardrobeItem } from "../services/api";
import { FaArrowLeft, FaExternalLinkAlt, FaMagic, FaSearch, FaTag, FaGoogle, FaAmazon, FaPinterest, FaPlus, FaCheck } from "react-icons/fa";

// --- Animations ---
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #1a0533 0%, #0a0a0a 60%);
  color: white;
  padding-bottom: 80px;
`;

const HeroSection = styled.div`
  padding: 60px 0 40px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
  margin: 0 auto 40px;

  &:hover {
    background: rgba(255,255,255,0.15);
    transform: translateX(-3px);
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff 0%, #c084fc 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PageSubtitle = styled(motion.p)`
  color: rgba(255,255,255,0.55);
  font-size: 1.1rem;
  margin-bottom: 0;
`;

const ContentArea = styled.div`
  width: min(1200px, 94%);
  margin: 0 auto;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// --- Left: Image + Metadata ---
const ImageCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 90px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
`;

const MetaBox = styled.div`
  padding: 20px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.span`
  color: rgba(255,255,255,0.4);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Value = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Tag = styled.span`
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #c084fc;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const QueryBadge = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);

  svg { color: #c084fc; flex-shrink: 0; }
`;

const AIBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(240,147,251,0.2));
  border: 1px solid rgba(168,85,247,0.4);
  color: #c084fc;
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-top: 12px;
  animation: ${float} 3s ease-in-out infinite;
`;

// --- Right: Shopping Cards ---
const RightPanel = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;

  svg { color: #c084fc; }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 24px 20px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(168, 85, 247, 0.4);
    background: rgba(255,255,255,0.06);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ItemEmoji = styled.div`
  font-size: 1.8rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemCategory = styled.span`
  color: #c084fc;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: white;
  line-height: y;
`;

const ItemPrice = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
`;

const StoreLinksRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const StoreBtn = styled.a`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${p => p.$color}22;
  border: 1px solid ${p => p.$color}55;
  color: ${p => p.$color};
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    background: ${p => p.$color}44;
    transform: translateY(-2px);
  }
`;

const MyntraLogo = () => (
  <span style={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: 'linear-gradient(135deg, #FF3F6C, #F94D63)', 
    color: 'white', 
    fontWeight: '900', 
    fontSize: '0.9em',
    width: '1.4em',
    height: '1.4em',
    borderRadius: '4px'
  }}>M</span>
);

const SaveToClosetBtn = styled.button`
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #a855f7, #f093fb);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
  }

  &:disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

// --- Loading Skeleton ---
const SkeletonPulse = styled.div`
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 12px;
`;

const LoadingOverlay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
`;

const SpinnerRing = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(168,85,247,0.2);
  border-top-color: #c084fc;
`;

// --- Main Component ---
export default function FindProduct() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("Analyzing your outfit with AI...");
  const [savingItem, setSavingItem] = useState(null);
  const [savedItems, setSavedItems] = useState({});

  const handleSaveToCloset = async (item, index) => {
    try {
      setSavingItem(index);
      const typeLower = (item.type || "").toLowerCase();
      let category = "accessory";
      if (typeLower.includes("top") || typeLower.includes("shirt") || typeLower.includes("jacket")) category = "top";
      else if (typeLower.includes("bottom") || typeLower.includes("pants") || typeLower.includes("jeans") || typeLower.includes("trouser")) category = "bottom";
      else if (typeLower.includes("shoe") || typeLower.includes("footwear") || typeLower.includes("sneaker")) category = "footwear";

      const formData = new FormData();
      formData.append("category", category);
      formData.append("color", data.color || ""); // Fallback to outfit color
      formData.append("brand", item.name || ""); // Use item name as generic brand/title
      formData.append("image_url", data.image_url);

      await addWardrobeItem(formData);
      setSavedItems(prev => ({ ...prev, [index]: true }));
    } catch (err) {
      console.error("Failed to save to closet", err);
      alert("Failed to save item to wardrobe. Please try again.");
    } finally {
      setSavingItem(null);
    }
  };

  useEffect(() => {
    const msgs = [
      "Analyzing your outfit with AI...",
      "Detecting clothing type & colors...",
      "Crafting your perfect search query...",
      "Finding the best shopping platforms...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 1800);

    findSimilarProducts(postId)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not analyze this outfit. Please try again.");
        setLoading(false);
      });

    return () => clearInterval(interval);
  }, [postId]);

  return (
    <PageWrapper>
      <HeroSection>
        <ContentArea>
          <BackBtn onClick={() => navigate(-1)}>
            <FaArrowLeft size={14} /> Back to Post
          </BackBtn>

          <PageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Similar Products
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            AI-powered fashion discovery across the internet
          </PageSubtitle>
        </ContentArea>
      </HeroSection>

      <ContentArea>
        <AnimatePresence mode="wait">

          {/* Loading State */}
          {loading && (
            <LoadingOverlay
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SpinnerRing
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p
                key={loadingMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", textAlign: "center" }}
              >
                {loadingMsg}
              </motion.p>
              <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: 10 }}>
                <SkeletonPulse style={{ height: 12 }} />
                <SkeletonPulse style={{ height: 12, width: "70%" }} />
                <SkeletonPulse style={{ height: 12, width: "85%" }} />
              </div>
            </LoadingOverlay>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "80px 20px", color: "#ff6b6b" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>😔</div>
              <h2>{error}</h2>
              <button
                onClick={() => navigate(-1)}
                style={{ marginTop: 20, padding: "12px 24px", background: "#fff", color: "#000", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer" }}
              >
                Go Back
              </button>
            </motion.div>
          )}

          {/* Results State */}
          {data && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TwoCol>
                {/* LEFT: Image + AI Metadata */}
                <ImageCard
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PostImage
                    src={buildImageUrl(data.image_url)}
                    alt="Your outfit"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <MetaBox>
                    {data.clothing_type && (
                      <MetaRow>
                        <Label>Clothing Type</Label>
                        <Value>{data.clothing_type}</Value>
                      </MetaRow>
                    )}
                    {data.color && (
                      <MetaRow>
                        <Label>Colors</Label>
                        <Value>{data.color}</Value>
                      </MetaRow>
                    )}
                    {data.style && (
                      <MetaRow>
                        <Label>Style</Label>
                        <Value>{data.style}</Value>
                      </MetaRow>
                    )}
                    {data.fabric && (
                      <MetaRow>
                        <Label>Fabric</Label>
                        <Value>{data.fabric}</Value>
                      </MetaRow>
                    )}

                    {data.tags?.length > 0 && (
                      <>
                        <Label>Style Tags</Label>
                        <TagsRow style={{ marginTop: 8 }}>
                          {data.tags.map(t => <Tag key={t}>{t}</Tag>)}
                        </TagsRow>
                      </>
                    )}


                  </MetaBox>
                </ImageCard>

                {/* RIGHT: Display Distinct Items */}
                <RightPanel>
                  <SectionTitle>
                    <FaTag /> Identified Items in Outfit
                  </SectionTitle>

                  <ItemGrid>
                    {data.detected_items?.map((item, i) => {
                      const typeLower = (item.type || "").toLowerCase();
                      let emoji = "🛍️";
                      if (typeLower.includes("top") || typeLower.includes("shirt") || typeLower.includes("jacket")) emoji = "👕";
                      else if (typeLower.includes("bottom") || typeLower.includes("pants") || typeLower.includes("jeans") || typeLower.includes("trouser")) emoji = "👖";
                      else if (typeLower.includes("shoe") || typeLower.includes("footwear") || typeLower.includes("sneaker")) emoji = "👟";
                      else if (typeLower.includes("dress")) emoji = "👗";
                      else if (typeLower.includes("hat") || typeLower.includes("cap")) emoji = "🧢";
                      else if (typeLower.includes("watch") || typeLower.includes("accessory")) emoji = "⌚";

                      return (
                        <ItemCard
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07, duration: 0.4 }}
                        >
                          <ItemHeader>
                            <ItemEmoji>{emoji}</ItemEmoji>
                            <div>
                              <ItemCategory>{item.type}</ItemCategory>
                            </div>
                          </ItemHeader>

                          <div>
                            <ItemName>{item.name}</ItemName>
                            {item.price_estimate && (
                              <ItemPrice>Est. Price: {item.price_estimate}</ItemPrice>
                            )}
                          </div>

                          <StoreLinksRow>
                            <StoreBtn
                              href={item.shop_links?.google || `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.search_query || item.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              $color="#4285F4"
                            >
                              <FaGoogle size={14} /> Google Shop
                            </StoreBtn>
                            <StoreBtn
                              href={item.shop_links?.amazon || `https://www.amazon.com/s?k=${encodeURIComponent(item.search_query || item.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              $color="#FF9900"
                            >
                              <FaAmazon size={14} /> Amazon
                            </StoreBtn>
                            <StoreBtn
                              href={item.shop_links?.myntra || `https://www.myntra.com/${encodeURIComponent(item.search_query || item.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              $color="#FF3F6C"
                            >
                              <MyntraLogo /> Myntra
                            </StoreBtn>
                            <StoreBtn
                              href={item.shop_links?.pinterest || `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(item.search_query || item.name)}+outfit`}
                              target="_blank"
                              rel="noopener noreferrer"
                              $color="#E60023"
                            >
                              <FaPinterest size={14} /> Pinterest
                            </StoreBtn>
                          </StoreLinksRow>
                          
                          <SaveToClosetBtn 
                            onClick={() => handleSaveToCloset(item, i)}
                            disabled={savingItem === i || savedItems[i]}
                          >
                            {savedItems[i] ? (
                              <><FaCheck /> Saved to Closet</>
                            ) : savingItem === i ? (
                              "Saving..."
                            ) : (
                              <><FaPlus /> Save to Closet</>
                            )}
                          </SaveToClosetBtn>
                        </ItemCard>
                      );
                    })}
                  </ItemGrid>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                      marginTop: 32,
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "0.82rem",
                      textAlign: "center"
                    }}
                  >
                    Clicking on a store button will open a search specifically tuned for that clothing item.
                  </motion.p>
                </RightPanel>
              </TwoCol>
            </motion.div>
          )}

        </AnimatePresence>
      </ContentArea>
    </PageWrapper>
  );
}
