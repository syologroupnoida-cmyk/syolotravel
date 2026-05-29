// app/forgot-password/page.jsx - Request Password Reset Email
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import {
  Email,
  TravelExplore,
  Send,
  CheckCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

const forgotImage =
  'linear-gradient(180deg, rgba(12, 23, 42, 0.22), rgba(12, 23, 42, 0.72)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80")';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate email
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // Simulate API call to send reset link
    try {
      // In real application, this would be an API call to your backend
      // await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
      
      // Store reset token in localStorage for demo
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(`reset_token_${email}`, resetToken);
      localStorage.setItem(`reset_expiry_${email}`, Date.now() + 3600000); // 1 hour expiry
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      setSnackbar({
        open: true,
        message: `Password reset link sent to ${email}. Check your email!`,
        severity: 'success'
      });
      
      // In development, show the reset link in console
      console.log(`Reset link: ${window.location.origin}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`);
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to send reset email. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (emailSent) {
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
            backgroundImage: forgotImage,
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
            Check Your Email
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
            We&apos;ve sent a password reset link to your email
          </Typography>
        </Box>

        {/* Right Side - Success Message */}
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
              textAlign: 'center',
            }}
          >
            <Send sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Reset Link Sent!
            </Typography>
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Please check your email inbox and click on the link to reset your password.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Didn&apos;t receive the email? Check your spam folder or try again.
            </Typography>
            
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              sx={{ mb: 2 }}
            >
              Try Again with Different Email
            </Button>
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => router.push('/')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                },
              }}
            >
              Back to Sign In
            </Button>
          </Box>
        </Box>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
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
          backgroundImage: forgotImage,
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
          Forgot Password?
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
          Don&apos;t worry! We&apos;ll send you a link to reset your password
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'left', width: '100%' }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            📧 Enter your registered email address
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            🔗 Click on the reset link in the email
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🔒 Create a new strong password
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Forgot Password Form */}
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
              Enter your email address and we&apos;ll send you a password reset link
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
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="dense"
              required
              size="small"
              variant="outlined"
              placeholder="your@email.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>What happens next?</strong>
                <br />
                1. We&apos;ll send a password reset link to your email
                <br />
                2. Click the link to verify your identity
                <br />
                3. Create a new password for your account
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
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
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
