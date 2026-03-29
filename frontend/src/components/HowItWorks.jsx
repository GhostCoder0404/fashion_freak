
import React from "react";
import styled from "styled-components";
import { FaGenderless, FaCloudUploadAlt, FaMagic } from "react-icons/fa";

const Wrap = styled.section` 
    padding: 80px 0;
    background: #f8fafc;
`;

const Title = styled.h3`
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 3rem;
    background: linear-gradient(to right, #000, #434343);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Grid = styled.div` 
    display: flex; 
    gap: 2rem; 
    max-width: 1100px; 
    margin: 0 auto; 
    
    @media(max-width: 900px){
        flex-direction: column;
        padding: 0 20px;
    }
`;

const Card = styled.div` 
    background: #fff; 
    padding: 2.5rem; 
    border-radius: 20px; 
    box-shadow: 0 10px 40px rgba(0,0,0,0.05); 
    flex: 1; 
    text-align: center;
    transition: transform 0.3s;
    
    &:hover {
        transform: translateY(-10px);
    }
`;

const IconWrapper = styled.div`
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #00c2b3 0%, #009e91 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: white;
    font-size: 2rem;
    box-shadow: 0 10px 20px rgba(0, 194, 179, 0.3);
`;

export default function HowItWorks() {
    return (
        <Wrap>
            <div className="container">
                <Title>How It Works</Title>
                <Grid>
                    <Card>
                        <IconWrapper><FaGenderless /></IconWrapper>
                        <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>1. Select</strong>
                        <div style={{ color: '#64748B' }}>Choose your style context</div>
                    </Card>
                    <Card>
                        <IconWrapper><FaCloudUploadAlt /></IconWrapper>
                        <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>2. Upload</strong>
                        <div style={{ color: '#64748B' }}>Snap a pic of your fit</div>
                    </Card>
                    <Card>
                        <IconWrapper><FaMagic /></IconWrapper>
                        <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>3. Get Rated</strong>
                        <div style={{ color: '#64748B' }}>AI delivers instant feedback</div>
                    </Card>
                </Grid>
            </div>
        </Wrap>
    );
}
