// app/page.jsx - Landing/Sign In Page
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  TravelExplore,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import SignUp from './SignUp';

const signInImage =
  'linear-gradient(180deg, rgba(12, 23, 42, 0.22), rgba(12, 23, 42, 0.72)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80")';

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo authentication
    if (formData.email && formData.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      router.push('/kyc');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        background: 'white',
      }}
    >
            {/* Left Side - Branding */}
            <Box
              sx={{
                backgroundImage: signInImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                p: { xs: 3, sm: 5, md: 8 },
                height: { xs: 260, sm: 320, md: '100vh' },
                minHeight: { xs: 260, md: '100vh' },
                width: '100%',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                textAlign: 'left',
              }}
            >
              <TravelExplore sx={{ fontSize: 80, mb: 3 }} />
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                tr@plap®
              </Typography>
              <Typography variant="h5" gutterBottom>
                Get Started with your Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                The simplest and fastest way to manage your travel business
              </Typography>
            </Box>

            {/* Right Side - Sign In Form */}
            <Box
              sx={{
                minHeight: { xs: 'auto', md: '100vh' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 620,
                  p: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box
                    component="img"
                    src="/globe.svg"
                    alt="Logo"
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                      display: 'block',
                    }}
                  />
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    Sign in to your account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Welcome back. Enter your details to continue.
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    width: '100%',
                    maxWidth: 420,
                    mx: 'auto',
                  }}
                >
                  <TextField
                    fullWidth
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="dense"
                    required
                    size="small"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="dense"
                    required
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              title={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword((current) => !current)}
                              onMouseDown={(event) => event.preventDefault()}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                    Note: If you are facing login issues, Please clear cookies and try again.
                  </Alert>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                      },
                    }}
                  >
                    Sign in
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link href="/forgot-password" variant="body2" sx={{ display: 'block', mb: 1 }}>
                      Lost your password?
                    </Link>
                    <Link 
                      href="/sign-up" 
                      variant="body2"
                    >
                      Not a member yet? Signup now.
                    </Link>
                  </Box>

                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                    © 2020-2026 All Rights Reserved. Tripclap® is a registered trademark of Digiclap, Tripclap Technology Private Limited.
                  </Typography>
                </Box>
              </Box>
            </Box>
    </Box>
  );
}
