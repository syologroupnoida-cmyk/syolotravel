// app/kyc-wizard/page.jsx - KYC Wizard Form
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Paper,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person,
  Business,
  LocationCity,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  TravelExplore,
  Badge,
  Home,
  Store,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const steps = ['Personal Info', 'Business Details', 'Documents', 'Review'];

export default function KYCWizard() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    panNumber: '',
    aadharNumber: '',
    // Business Details
    businessName: '',
    businessType: '',
    gstNumber: '',
    businessAddress: '',
    businessCity: '',
    businessPincode: '',
    // Documents
    panCard: null,
    aadharCard: null,
    gstCertificate: null,
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    // Agreement
    agreeTerms: false,
    declareTrue: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('isAuthenticated');
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
      // Pre-fill email from sign in
      const userEmail = localStorage.getItem('userEmail');
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          fullName: parsedData.fullName || '',
          businessName: parsedData.companyName || '',
          businessCity: parsedData.cityName || '',
        }));
      }
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value, checked, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
      if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        newErrors.panNumber = 'Invalid PAN number format';
      }
      if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
      if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
        newErrors.aadharNumber = 'Aadhar number must be 12 digits';
      }
    } else if (activeStep === 1) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.gstNumber) newErrors.gstNumber = 'GST number is required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
      if (!formData.businessCity) newErrors.businessCity = 'City is required';
      if (!formData.businessPincode) newErrors.businessPincode = 'Pincode is required';
    } else if (activeStep === 2) {
      if (!formData.panCard) newErrors.panCard = 'PAN card document is required';
      if (!formData.aadharCard) newErrors.aadharCard = 'Aadhar card document is required';
      if (formData.businessType !== 'TRAVEL AGENT' && !formData.gstCertificate) {
        newErrors.gstCertificate = 'GST certificate is required';
      }
      if (!formData.accountHolderName) newErrors.accountHolderName = 'Account holder name is required';
      if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
      if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
    } else if (activeStep === 3) {
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
      if (!formData.declareTrue) newErrors.declareTrue = 'You must declare the information is true';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Save KYC data
      localStorage.setItem('kycData', JSON.stringify(formData));
      alert('KYC submitted successfully! Our team will review your application within 24 hours.');
      router.push('/dashboard');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Number *"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  error={!!errors.panNumber}
                  helperText={errors.panNumber || 'Format: ABCDE1234F'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Aadhar Number *"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  error={!!errors.aadharNumber}
                  helperText={errors.aadharNumber || '12 digit number'}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Business Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Name *"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  error={!!errors.businessName}
                  helperText={errors.businessName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!errors.businessType}>
                  <FormLabel component="legend">Business Type *</FormLabel>
                  <RadioGroup
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel value="TRAVEL AGENT" control={<Radio />} label="TRAVEL AGENT" />
                    <FormControlLabel value="HOTEL" control={<Radio />} label="HOTEL" />
                    <FormControlLabel value="DMC" control={<Radio />} label="DMC" />
                    <FormControlLabel value="TRANSPORT" control={<Radio />} label="TRANSPORT" />
                    <FormControlLabel value="FLIGHTS" control={<Radio />} label="FLIGHTS" />
                  </RadioGroup>
                  {errors.businessType && (
                    <Typography color="error" variant="caption">
                      {errors.businessType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="GST Number *"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  error={!!errors.gstNumber}
                  helperText={errors.gstNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address *"
                  name="businessAddress"
                  multiline
                  rows={2}
                  value={formData.businessAddress}
                  onChange={handleChange}
                  error={!!errors.businessAddress}
                  helperText={errors.businessAddress}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City *"
                  name="businessCity"
                  value={formData.businessCity}
                  onChange={handleChange}
                  error={!!errors.businessCity}
                  helperText={errors.businessCity}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode *"
                  name="businessPincode"
                  value={formData.businessPincode}
                  onChange={handleChange}
                  error={!!errors.businessPincode}
                  helperText={errors.businessPincode}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Document Upload & Bank Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Documents
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Upload PAN Card *
                  <input
                    type="file"
                    name="panCard"
                    hidden
                    accept=".pdf,.jpg,.png"
                    onChange={handleChange}
                  />
                </Button>
                {formData.panCard && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    ✓ {formData.panCard.name}
                  </Typography>
                )}
                {errors.panCard && (
                  <Typography color="error" variant="caption">
                    {errors.panCard}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Upload Aadhar Card *
                  <input
                    type="file"
                    name="aadharCard"
                    hidden
                    accept=".pdf,.jpg,.png"
                    onChange={handleChange}
                  />
                </Button>
                {formData.aadharCard && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    ✓ {formData.aadharCard.name}
                  </Typography>
                )}
                {errors.aadharCard && (
                  <Typography color="error" variant="caption">
                    {errors.aadharCard}
                  </Typography>
                )}
              </Grid>
              {formData.businessType !== 'TRAVEL AGENT' && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Upload GST Certificate *
                    <input
                      type="file"
                      name="gstCertificate"
                      hidden
                      accept=".pdf,.jpg,.png"
                      onChange={handleChange}
                    />
                  </Button>
                  {formData.gstCertificate && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                      ✓ {formData.gstCertificate.name}
                    </Typography>
                  )}
                  {errors.gstCertificate && (
                    <Typography color="error" variant="caption">
                      {errors.gstCertificate}
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Bank Account Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Holder Name *"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  error={!!errors.accountHolderName}
                  helperText={errors.accountHolderName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number *"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IFSC Code *"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bank Name *"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  error={!!errors.bankName}
                  helperText={errors.bankName}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Review & Agreement
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your information before submitting
            </Alert>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Name:</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">{formData.fullName}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">PAN:</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">{formData.panNumber}</Typography></Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Business Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Business Name:</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">{formData.businessName}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Type:</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">{formData.businessType}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">GST:</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">{formData.gstNumber}</Typography></Grid>
              </Grid>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
              }
              label="I agree to the Terms and Conditions of Tripclap®"
            />
            {errors.agreeTerms && (
              <Typography color="error" variant="caption" display="block">
                {errors.agreeTerms}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  name="declareTrue"
                  checked={formData.declareTrue}
                  onChange={handleChange}
                />
              }
              label="I declare that all the information provided is true and correct"
            />
            {errors.declareTrue && (
              <Typography color="error" variant="caption" display="block">
                {errors.declareTrue}
              </Typography>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', boxShadow: 1, py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TravelExplore sx={{ color: '#667eea', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold">
                tr@plap®
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                KYC Verification
              </Typography>
            </Box>
            <Button variant="outlined" color="error" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Grid container>
            {/* Left Side - Image/Branding */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 4,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mb: 3,
                }}
              >
                <Badge sx={{ fontSize: 50 }}>✓</Badge>
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Complete Your KYC
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                Verify your identity to start selling travel packages
              </Typography>
              <Box sx={{ mt: 3, textAlign: 'left', width: '100%' }}>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  ✓ Fast verification
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  ✓ Secure document handling
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✓ Get approved within 24 hours
                </Typography>
              </Box>
            </Grid>

            {/* Right Side - Wizard Form */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 4 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ mt: 2 }}>
                  {getStepContent(activeStep)}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                          },
                        }}
                      >
                        Submit KYC
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                          },
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}