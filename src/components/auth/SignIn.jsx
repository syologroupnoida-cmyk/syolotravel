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
  Visibility,
  VisibilityOff,
  TravelExplore,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
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
      router.push('/kyc-wizard');
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
                minHeight: { xs: 280, md: '100vh' },
                display: 'flex',
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
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Sign in to your account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Welcome back. Enter your details to continue.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
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
                    <Link href="#" variant="body2" sx={{ display: 'block', mb: 1 }}>
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
                </form>
              </Box>
            </Box>
    </Box>
  );
}
