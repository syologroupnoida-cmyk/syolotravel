// components/SignUp.jsx
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  TravelExplore,
  Person,
  Business,
  LocationCity,
  Email,
  Phone,
  Lock,
} from '@mui/icons-material';

const signUpImage =
  'linear-gradient(180deg, rgba(12, 23, 42, 0.18), rgba(12, 23, 42, 0.78)), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80")';

export default function SignUp({ onBackToSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    cityName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    agreeTerms: false,
    whatsappUpdates: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const businessTypes = ['TRAVEL AGENT', 'HOTEL', 'DMC', 'TRANSPORT', 'FLIGHTS'];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.cityName) newErrors.cityName = 'City name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (formData.mobileNumber.length !== 10) newErrors.mobileNumber = 'Mobile number must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6 || formData.password.length > 16) {
      newErrors.password = 'Password must be 6-16 characters';
    }
    if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number and one special character';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.businessType) newErrors.businessType = 'Please select a business type';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save user data
      localStorage.setItem('userData', JSON.stringify(formData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/kyc';
      }, 2000);
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
                backgroundImage: signUpImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                p: { xs: 3, sm: 5, md: 8 },
                height: { xs: 260, sm: 320, md: '100vh' },
                minHeight: { xs: 260, md: '100vh' },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                textAlign: 'left',
              }}
            >
              <TravelExplore sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Join tr@plap®
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                Create your account and start your journey with us
              </Typography>
              <Box sx={{ mt: 4, textAlign: 'left', width: '100%' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  ✓ Sell travel packages worldwide
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  ✓ Earn high commissions
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✓ 24/7 customer support
                </Typography>
              </Box>
            </Box>

            {/* Right Side - Sign Up Form */}
            <Box
              sx={{
                minHeight: { xs: 'auto', md: '100vh' },
                bgcolor: 'white',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 720,
                  mx: 'auto',
                  p: { xs: 2, sm: 2.5, md: 3 },
                  '& .MuiFormHelperText-root': {
                    mt: 0.25,
                  },
                  '& .MuiInputBase-input': {
                    py: 0.9,
                  },
                  '& .MuiInputAdornment-root svg': {
                    fontSize: 20,
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box
                    component="img"
                    src="/globe.svg"
                    alt="Logo"
                    sx={{
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 1.5,
                      display: 'block',
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Sign Up
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please fill the below details to SIGN UP
                  </Typography>
                </Box>

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                      gap: { xs: 1.25, sm: 1.5 },
                    }}
                  >
                    <Box>
                      <TextField
                        fullWidth
                        label="Your Name *"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Company Name *"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        error={!!errors.companyName}
                        helperText={errors.companyName}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="City Name *"
                        name="cityName"
                        value={formData.cityName}
                        onChange={handleChange}
                        error={!!errors.cityName}
                        helperText={errors.cityName}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationCity />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Email Address *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Mobile Number *"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Create Password *"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Confirm Password *"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Business Type *
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: 'repeat(2, minmax(0, 1fr))',
                            sm: 'repeat(5, minmax(0, 1fr))',
                          },
                          gap: 0.25,
                        }}
                      >
                        {businessTypes.map((type) => (
                          <FormControlLabel
                            key={type}
                            control={
                              <Checkbox
                                size="small"
                                name="businessType"
                                checked={formData.businessType === type}
                                onChange={() => setFormData({ ...formData, businessType: type })}
                                sx={{ p: 0.5 }}
                              />
                            }
                            label={type}
                            sx={{
                              m: 0,
                              minWidth: 0,
                              '& .MuiFormControlLabel-label': {
                                fontSize: '0.72rem',
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap',
                              },
                            }}
                          />
                        ))}
                      </Box>
                      {errors.businessType && (
                        <Typography color="error" variant="caption">
                          {errors.businessType}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            sx={{ p: 0.5 }}
                          />
                        }
                        label="I AGREE TO TERMS & GET UPDATE ON WHATSAPP"
                        sx={{
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.75rem',
                            lineHeight: 1.3,
                          },
                        }}
                      />
                      {errors.agreeTerms && (
                        <Typography color="error" variant="caption" display="block">
                          {errors.agreeTerms}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="whatsappUpdates"
                            checked={formData.whatsappUpdates}
                            onChange={handleChange}
                            sx={{ p: 0.5 }}
                          />
                        }
                        label="I AGREE TO GET UPDATE ON WHATSAPP"
                        sx={{
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.75rem',
                            lineHeight: 1.3,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                          },
                        }}
                      >
                        SIGN UP
                      </Button>
                      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        You have an account?{' '}
                        <Link
                          href="/"
                          underline="hover"
                          fontWeight={600}
                          onClick={(event) => {
                            if (onBackToSignIn) {
                              event.preventDefault();
                              onBackToSignIn();
                            }
                          }}
                        >
                          Sign In
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Box>
    </Box>
  );
}
