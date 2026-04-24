
import React, { useState, useContext } from "react";
import { createPost } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaCloudUploadAlt } from "react-icons/fa";

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);

  @media (max-width: 640px) {
    margin: 16px;
    padding: 1.2rem;
    border-radius: 8px;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
`;

const UploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  background: #f9f9f9;
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    background: #f1f1f1;
    border-color: #999;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  min-height: 120px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #000;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gender, setGender] = useState("male");
  const [occasion, setOccasion] = useState("casual");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  async function submit(e) {
    e.preventDefault();
    if (!user) return alert("Please login first");
    if (!file) return alert("Please upload an image");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("gender", gender);
      formData.append("occasion", occasion);
      formData.append("file", file);

      const res = await createPost(formData);
      alert("Post created successfully!");
      nav(`/post/${res.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Title>Create New Look</Title>
      <form onSubmit={submit}>
        <Input
          placeholder="Give your look a title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <UploadZone>
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <>
              <FaCloudUploadAlt size={40} color="#ccc" />
              <span style={{ color: "#888", marginTop: 8 }}>Click to upload image</span>
            </>
          )}
          <input type="file" hidden accept="image/*" onChange={handleFile} />
        </UploadZone>
        <div style={{ marginTop: 8, marginBottom: 16, fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
          Supported: JPG, PNG
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            style={{ flex: '1 1 120px', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={occasion}
            onChange={e => setOccasion(e.target.value)}
            style={{ flex: '1 1 140px', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="prom">Prom</option>
            <option value="wedding">Wedding</option>
            <option value="gym">Gym</option>
          </select>
        </div>

        <TextArea
          placeholder="Describe your outfit details..."
          value={caption}
          onChange={e => setCaption(e.target.value)}
          required
        />

        <Button disabled={loading}>
          {loading ? "Publishing..." : "Publish Look"}
        </Button>
      </form>
    </Container>
  );
}
