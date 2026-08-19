import React, { useState } from 'react';
import {
    Container, Paper, Box, Typography, Button, TextField, Stack, Avatar, Alert
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const SUPER_ADMIN_EMAIL = process.env.REACT_APP_SUPER_ADMIN_EMAIL || 'superadmin@apnaschool.com';
const SUPER_ADMIN_PASS = process.env.REACT_APP_SUPER_ADMIN_PASSWORD || 'admin123';

const SuperAdminLogin = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState(SUPER_ADMIN_EMAIL);
    const [password, setPassword] = useState(SUPER_ADMIN_PASS);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Super Admin Secret Login Check from process.env
        if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && password === SUPER_ADMIN_PASS) {
            onLoginSuccess();
        } else {
            setError(`Invalid Super Admin credentials.`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}>
            <Container maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: '#1e293b',
                        color: 'white',
                        border: '1px solid #334155',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: '#4f46e5', mb: 1.5 }}>
                            <SecurityIcon sx={{ fontSize: 32, color: '#fbbf24' }} />
                        </Avatar>
                        <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px">
                            SaaS Super Admin
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                            Control Panel Portal Access
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2.5, bgcolor: '#7f1d1d', color: '#fca5a5' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                required
                                label="Super Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                                InputProps={{ sx: { color: 'white', bgcolor: '#0f172a', borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth
                                required
                                type="password"
                                label="Secret Key Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                                InputProps={{ sx: { color: 'white', bgcolor: '#0f172a', borderRadius: 2 } }}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    py: 1.5,
                                    bgcolor: '#4f46e5',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    borderRadius: 2.5,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#4338ca' }
                                }}
                            >
                                Login to Control Center
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default SuperAdminLogin;
