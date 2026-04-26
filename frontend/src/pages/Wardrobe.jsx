import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getWardrobe, addWardrobeItem, deleteWardrobeItem, buildImageUrl } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FaPlus, FaTimes, FaTrash, FaTshirt, FaShoePrints } from "react-icons/fa";

// --- Styled Components ---
const PageContainer = styled.div`
  padding: 40px 24px;
  min-height: 80vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media(max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  font-family: ${p => p.theme.fonts.title};
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 10px;
  &::-webkit-scrollbar { display: none; }
`;

const Tab = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  border: 1px solid ${p => p.$active ? p.theme.colors.text : p.theme.colors.border};
  background: ${p => p.$active ? p.theme.colors.text : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.bg : p.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 2rem;
`;

const ItemCard = styled(motion.div)`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: ${p => p.theme.colors.panel};
  border: 1px solid ${p => p.theme.colors.border};
  group: hover;
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const ItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ItemOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
`;

const DeleteBtn = styled.button`
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover { background: red; transform: scale(1.1); }
`;

const FAB = styled(motion.button)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #f093fb);
  color: white;
  border: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(168, 85, 247, 0.4);
  z-index: 100;
  
  @media(max-width: 600px) {
    bottom: 80px;
    right: 20px;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${p => p.theme.colors.bg};
  border-radius: 24px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  border: 1px solid ${p => p.theme.colors.border};
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  color: ${p => p.theme.colors.muted};
  cursor: pointer;
  font-size: 1.2rem;
`;

const SelectBox = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${p => p.theme.colors.panel};
  border: 1px solid ${p => p.theme.colors.border};
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const UploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed ${p => p.theme.colors.border};
  border-radius: 16px;
  cursor: pointer;
  color: ${p => p.theme.colors.muted};
  overflow: hidden;
  position: relative;
  
  &:hover { border-color: #a855f7; color: #a855f7; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: ${p => p.theme.colors.text};
  color: ${p => p.theme.colors.bg};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function Wardrobe() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Upload state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("top");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = () => {
    getWardrobe().then(setItems).catch(console.error);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);
    
    try {
      const newItem = await addWardrobeItem(fd);
      setItems(prev => [newItem, ...prev]);
      setIsModalOpen(false);
      setFile(null);
      setPreview(null);
    } catch (e) {
      console.error(e);
      alert("Failed to upload item");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteWardrobeItem(id);
      setItems(prev => prev.filter(it => it.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete item");
    }
  };

  const filteredItems = items.filter(it => filter === "all" || it.category === filter);
  const categories = [
    { id: "all", label: "All Items" },
    { id: "top", label: "Tops" },
    { id: "bottom", label: "Bottoms" },
    { id: "footwear", label: "Footwear" },
    { id: "accessory", label: "Accessories" }
  ];

  if (!user) return <div className="container" style={{padding: 40}}>Please login to access your wardrobe.</div>;

  return (
    <PageContainer className="container">
      <Header>
        <Title>My Closet</Title>
      </Header>

      <Tabs>
        {categories.map(cat => (
          <Tab 
            key={cat.id} 
            $active={filter === cat.id} 
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </Tab>
        ))}
      </Tabs>

      <Grid>
        <AnimatePresence>
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <ItemImg src={buildImageUrl(item.image_url)} alt={item.category} />
              <ItemOverlay className="overlay">
                <DeleteBtn onClick={() => handleDelete(item.id)}><FaTrash /></DeleteBtn>
              </ItemOverlay>
            </ItemCard>
          ))}
        </AnimatePresence>
      </Grid>
      
      {filteredItems.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <FaTshirt size={40} style={{ opacity: 0.2, marginBottom: 16 }} />
          <h3>Your closet is empty</h3>
          <p>Tap the + button to add your first clothing item.</p>
        </div>
      )}

      <FAB 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus />
      </FAB>

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <CloseBtn onClick={() => setIsModalOpen(false)}><FaTimes /></CloseBtn>
              <h2 style={{ marginTop: 0 }}>Add New Item</h2>
              
              <UploadBox>
                {preview ? (
                  <img src={preview} alt="preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <>
                    <FaPlus size={30} style={{marginBottom: 10}} />
                    <span>Upload Photo</span>
                  </>
                )}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </UploadBox>

              <SelectBox value={category} onChange={e => setCategory(e.target.value)}>
                <option value="top">Top (Shirt, Jacket, etc)</option>
                <option value="bottom">Bottom (Pants, Jeans, Skirt)</option>
                <option value="footwear">Footwear (Shoes, Sneakers)</option>
                <option value="accessory">Accessory (Hat, Watch, Bag)</option>
              </SelectBox>

              <SubmitBtn onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? "Adding..." : "Add to Closet"}
              </SubmitBtn>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
