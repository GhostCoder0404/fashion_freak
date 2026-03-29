import React, { useState, useContext } from "react";
import { login as apiLogin } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
    PageContainer, SplitWrapper, LeftPanel, RightPanel,
    LeftContent, Title, SubTitle, FormWrapper, InputGroup,
    Input, Button, SwitchText
} from "../styles/AuthStyles";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const nav = useNavigate();

    // Clear storage on mount to ensure fresh state as requested
    React.useEffect(() => {
        localStorage.removeItem("ff_token");
        // apiSetToken(null); // cant import this easily here without refactor, but localstorage clear acts as intent
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData(e.target);
            const userParams = formData.get("username");
            const passParams = formData.get("password");

            const payload = { password: passParams };
            if (userParams.includes("@")) payload.email = userParams;
            else payload.username = userParams;

            console.log("DEBUG: Login Payload:", JSON.stringify(payload));

            // apiLogin returns the parsed body directly on success, or throws on failure
            const data = await apiLogin(payload);
            await login(data.access_token);

            // Decode token or just use the input if we know it (better to decode usually, but for now we rely on backend)
            // Actually, we can just use the user param if provided, BUT if email was used we need username.
            // Let's rely on api/me or decoded token. Since `login()` in context fetches `me()`, 
            // we should wait for that or just fetch it here.
            // Simpler: use the username from payload if not email, else ... 

            // To be safe, the context `login` function sets the user. We can read it?
            // Actually `login` is async in our context? Let's check. 
            // If not, we might need to fetch me() manually to get username.
            // Or simplest: The login response often contains user info?
            // Our backend login only returns access_token.
            // So we need to fetch user profile to redirect correctly.

            // Let's assume the context handles fetching `me`? 
            // Looking at AuthContext usually it does. But `login` might just set token.
            // If we want to be safe:
            // The `login` from context likely fetches the user.

            // Assuming `login` (context) calls `updateUser` which fetches `/me`
            // We can just query `me()` here quickly to get username for redirect.

            const { me } = await import("../services/api");
            const userProfile = await me();
            nav(`/profile/${userProfile.username}`);
        } catch (err) {
            console.error(err);
            // api.js throws { status, body }
            setError(err?.body?.detail || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageContainer>
            <SplitWrapper>
                <LeftPanel>
                    <LeftContent>
                        <Title>Welcome Back</Title>
                        <SubTitle>
                            Sign in to continue your style journey. Review your past looks and see what's trending.
                        </SubTitle>
                    </LeftContent>
                </LeftPanel>

                <RightPanel>
                    <FormWrapper
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 style={{ fontSize: '2rem', marginBottom: 30 }}>Login</h2>

                        {error && <div style={{ color: '#ff6b6b', marginBottom: 20 }}>{error}</div>}

                        <form onSubmit={onSubmit}>
                            <InputGroup>
                                <Input
                                    name="username"
                                    placeholder="Username or Email"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>

                            <Button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>

                        <SwitchText>
                            New Member? <Link to="/signup">Sign up here</Link>
                        </SwitchText>
                    </FormWrapper>
                </RightPanel>
            </SplitWrapper>
        </PageContainer>
    );
}
