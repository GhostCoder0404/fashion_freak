import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./context/AuthContext";
import CustomThemeProvider from "./context/ThemeContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Search from "./pages/Search";
import TryOutfit from "./pages/TryOutfit";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FindProduct from "./pages/FindProduct";
import OutfitAnalysis from "./pages/OutfitAnalysis";

export default function App() {
  return (
    <CustomThemeProvider>
      <GlobalStyle />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/try" element={<TryOutfit />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/find-product/:postId" element={<FindProduct />} />
            <Route path="/outfit-analysis" element={<OutfitAnalysis />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
