import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "@/scenes/Navbar/Navbar";
import Home from "./scenes/Home/Home";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import Login from "./scenes/Login/Login";
import React from 'react'


const App: React.FC = () => {
    const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <AuthProvider
                        authName="_auth"
                        authType="cookie"
                        cookieDomain={window.location.hostname}
                        cookieSecure={false}
                    >
                        <BrowserRouter>
                            <Box width="100%" height="100%" p="1rem 0.5rem 4rem 0.5rem">
                                <Navbar />
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <RequireAuth loginPath="/login">
                                                <Home />
                                            </RequireAuth>
                                        }
                                    />
                                    <Route path="/login" element={<Login />} />
                                </Routes>
                            </Box>
                        </BrowserRouter>
                    </AuthProvider>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
