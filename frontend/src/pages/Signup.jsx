import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
    PageContainer, SplitWrapper, LeftPanel, RightPanel,
    LeftContent, Title, SubTitle, FormWrapper, InputGroup,
    Input, Button, SwitchText
} from "../styles/AuthStyles";

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", confirmPassword: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    async function submit(e) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await signup({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            alert("Signup successful! Please login.");
            nav("/login");
        } catch (err) {
            console.error(err);
            setError(err.body?.detail || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageContainer>
            <SplitWrapper>
                <LeftPanel>
                    <LeftContent>
                        <Title>Let's Get Started</Title>
                        <SubTitle>
                            Join our community of fashion enthusiasts. Rate outfits, get AI feedback, and discover new trends every day.
                        </SubTitle>
                    </LeftContent>
                </LeftPanel>

                <RightPanel>
                    <FormWrapper
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 style={{ fontSize: '2rem', marginBottom: 30 }}>Sign up</h2>

                        {error && <div style={{ color: '#ff6b6b', marginBottom: 20 }}>{error}</div>}

                        <form onSubmit={submit}>
                            <InputGroup>
                                <Input
                                    name="username"
                                    placeholder="Your Name"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    name="email"
                                    placeholder="Your Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    name="password"
                                    placeholder="Create Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    name="confirmPassword"
                                    placeholder="Repeat Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </InputGroup>

                            <Button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign up"}
                            </Button>
                        </form>

                        <SwitchText>
                            Already a Member? <Link to="/login">Sign in here</Link>
                        </SwitchText>
                    </FormWrapper>
                </RightPanel>
            </SplitWrapper>
        </PageContainer>
    );
}
