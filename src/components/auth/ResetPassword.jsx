// app/reset-password/page.jsx - Reset Password Form (after clicking email link)
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  TravelExplore,
  Warning,
} from '@mui/icons-material';

const resetImage =
  'linear-gradient(180deg, rgba(12, 23, 42, 0.22), rgba(12, 23, 42, 0.72)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80")';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [verifying, setVerifying] = useState(true);

  // Verify token validity
  useEffect(() => {
    const verifyResetToken = () => {
      setVerifying(true);
      
      if (!email || !token) {
        setValidToken(false);
        setVerifying(false);
        return;
      }
      
      // In production, this would be an API call to verify the token
      // For demo, check if token exists in localStorage
      const storedToken = localStorage.getItem(`reset_token_${email}`);
      const expiry = localStorage.getItem(`reset_expiry_${email}`);
      
      if (storedToken === token && expiry && Date.now() < parseInt(expiry)) {
        setValidToken(true);
      } else {
        setValidToken(false);
      }
      
      setVerifying(false);
    };
    
    verifyResetToken();
  }, [email, token]);

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 6) {
      errors.length = 'Password must be at least 6 characters';
    } else if (password.length > 16) {
      errors.length = 'Password must not exceed 16 characters';
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.special = 'Password must contain at least one special character (!@#$%^&*)';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Real-time password validation
    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        passwordLength: passwordErrors.length,
        passwordNumber: passwordErrors.number,
        passwordSpecial: passwordErrors.special,
      }));
    }
    
    // Real-time confirm password validation
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      const confirmValue = name === 'confirmPassword' ? value : formData.confirmPassword;
      const passwordValue = name === 'password' ? value : formData.password;
      
      if (confirmValue && passwordValue !== confirmValue) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate password requirements
    const passwordErrors = validatePassword(formData.password);
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...passwordErrors,
      }));
      setLoading(false);
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: 'Passwords do not match',
      });
      setLoading(false);
      return;
    }
    
    // Simulate API call to reset password
    setTimeout(() => {
      // Store the new password (in real app, this would be an API call)
      localStorage.setItem(`user_password_${email}`, formData.password);
      
      // Clear reset token
      localStorage.removeItem(`reset_token_${email}`);
      localStorage.removeItem(`reset_expiry_${email}`);
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1500);
  };

  // Show loading state while verifying token
  if (verifying) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>Verifying Reset Link...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Box>
    );
  }

  // Show error if token is invalid
  if (!validToken) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Warning sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="error">
            Invalid Reset Link
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This password reset link is invalid or has expired.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push('/forgot-password')}
            sx={{
              mt: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Request New Reset Link
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => router.push('/')}
            sx={{ mt: 1 }}
          >
            Back to Sign In
          </Button>
        </Paper>
      </Box>
    );
  }

  // Show success message
  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Password Reset Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your password has been changed. Redirecting to sign in...
          </Typography>
          <LinearProgress />
        </Paper>
      </Box>
    );
  }

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
          backgroundImage: resetImage,
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
        <TravelExplore sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          tr@plap®
        </Typography>
        <Typography variant="h5" gutterBottom>
          Create New Password
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
          {email ? `Set a new password for ${email}` : 'Set a new password for your account'}
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'left', width: '100%' }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            🔒 6-16 characters long
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            🔢 Contains at least one number
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            ✨ Contains at least one special character (!@#$%^&*)
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Reset Password Form */}
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
              Reset Your Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please enter your new password below
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              maxWidth: 420,
              mx: 'auto',
            }}
          >
            {/* New Password Field */}
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              required
              size="small"
              variant="outlined"
              error={!!(errors.length || errors.number || errors.special)}
              helperText={
                (errors.length || errors.number || errors.special) && (
                  <Box component="span" sx={{ display: 'block', fontSize: '0.75rem' }}>
                    {errors.length && `• ${errors.length}`}
                    {errors.number && `• ${errors.number}`}
                    {errors.special && `• ${errors.special}`}
                  </Box>
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="dense"
              required
              size="small"
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Password strength:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: formData.password.length >= 6 ? 'success.main' : 'grey.300',
                      borderRadius: 2,
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: /(?=.*\d)/.test(formData.password) ? 'success.main' : 'grey.300',
                      borderRadius: 2,
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: /(?=.*[!@#$%^&*])/.test(formData.password) ? 'success.main' : 'grey.300',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>Password requirements:</strong>
                <br />
                • 6-16 characters long
                <br />
                • At least one number (0-9)
                <br />
                • At least one special character (!@#$%^&*)
              </Typography>
            </Alert>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                },
              }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link 
                href="#" 
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/');
                }}
              >
                ← Back to Sign In
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

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}