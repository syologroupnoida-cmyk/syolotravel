// app/kyc-wizard/page.jsx - KYC Wizard Form
'use client';

import { useState, useEffect, useRef } from 'react';
import {
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
  Alert,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import {
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const steps = ['Services', 'Destinations', 'About Company', 'E-KYC', 'Finish', 'Review Details'];

const serviceOptions = [
  'TRAVEL LEADS',
  'TRAVEL CRM',
  'TRAVEL WEBSITE',
  'ITINERARY BUILDER',
  'B2B FLIGHTS',
  'B2B HOTEL',
  'CHAT/CALL LEADS',
  'B2B PROMOTION',
  'PAYMENT GETWAY',
];

const stateOptions = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const companyTypes = [
  'Proprietorship Firm',
  'Partnership Firm',
  'Private Limited',
  'LLP',
  'Public Limited',
];

const sourceOptions = [
  'SEARCH ENGINE',
  'SOCIAL MEDIA',
  'FRIEND/FAMILY',
  'REFERENCE',
  'ADVERTISEMENT',
  'COMPETITOR',
  'OTHERS',
];

const slideData = [
  {
    title: 'Verified Travel Enquiries',
    subtitle: 'Access phone-verified travel enquiries ready for conversion.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=720&q=80',
  },
  {
    title: 'B2B Promotion',
    subtitle: 'Expand your network and connect with fellow travel agents.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=720&q=80',
  },
  {
    title: 'Complete Company Details',
    subtitle: 'Tell us about your office, company type, and online profile.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=720&q=80',
  },
  {
    title: 'E-KYC Verification',
    subtitle: 'Verify your key business documents to proceed further.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=720&q=80',
  },
];

const twoColumnGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  gap: { xs: 1.25, sm: 1.5 },
  '& > .MuiGrid-root': {
    width: '100%',
    maxWidth: '100%',
  },
};

const fullRowSx = {
  gridColumn: '1 / -1',
};

const actionButtonSx = {
  bgcolor: '#1785d4',
  '&:hover': {
    bgcolor: '#0f73ba',
  },
};

export default function KYCWizard() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verifiedDocs, setVerifiedDocs] = useState({});
  const [errors, setErrors] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const filePreviewUrls = useRef({});

  const [formData, setFormData] = useState({
    services: ['TRAVEL LEADS', 'B2B PROMOTION'],
    destinations: ['Kerala', 'Ladakh', 'Uttar Pradesh'],
    dailyLeadRequirement: '',
    businessName: '',
    officeAddress: '',
    officeCity: '',
    officeState: '',
    gstNumber: '',
    companySince: '',
    companyType: '',
    teamSize: '',
    facebookUrl: '',
    instagramUrl: '',
    profileUrl: '',
    companyLogo: null,
    panNumber: '',
    panDocument: null,
    gstinNumber: '',
    gstinDocument: null,
    cinNumber: '',
    cinDocument: null,
    aadharNumber: '',
    aadharDocument: null,
    referralSource: '',
    otherSource: '',
    marketplaceWorked: '',
    agreeTerms: false,
    declareTrue: false,
  });

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slideData.length);
    }, 4500);

    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (!auth) {
      router.push('/');
      return undefined;
    }

    const userData = localStorage.getItem('userData');
    const authTimer = window.setTimeout(() => {
      setIsAuthenticated(true);
      if (userData) {
        const parsedData = JSON.parse(userData);
        setFormData((prev) => ({
          ...prev,
          businessName: parsedData.companyName || prev.businessName,
          officeCity: parsedData.cityName || prev.officeCity,
          companyType: parsedData.businessType || prev.companyType,
        }));
      }
    }, 0);

    return () => window.clearTimeout(authTimer);
  }, [router]);

  useEffect(() => () => {
    Object.values(filePreviewUrls.current).forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
  }, []);

  const clearError = (name) => {
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type, files } = e.target;
    const file = files?.[0];

    if (type === 'file') {
      const currentPreview = filePreviewUrls.current[name];
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
        delete filePreviewUrls.current[name];
      }

      if (file?.type?.startsWith('image/')) {
        const nextPreview = URL.createObjectURL(file);
        filePreviewUrls.current[name] = nextPreview;
        setFilePreviews((prev) => ({
          ...prev,
          [name]: nextPreview,
        }));
      } else {
        setFilePreviews((prev) => {
          const nextPreviews = { ...prev };
          delete nextPreviews[name];
          return nextPreviews;
        });
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? file : value,
    }));
    clearError(name);
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const hasService = prev.services.includes(service);
      return {
        ...prev,
        services: hasService
          ? prev.services.filter((item) => item !== service)
          : [...prev.services, service],
      };
    });
    clearError('services');
  };

  const handleVerifyDocument = (field) => {
    if (!formData[field]) {
      setErrors((prev) => ({ ...prev, [field]: 'Enter this document number first' }));
      return;
    }

    setVerifiedDocs((prev) => ({
      ...prev,
      [field]: true,
    }));
    clearError(field);
    clearError('eKyc');
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (formData.services.length === 0) {
        newErrors.services = 'Select at least one service';
      }
    } else if (activeStep === 1) {
      if (formData.destinations.length === 0) newErrors.destinations = 'Destinations are required';
      if (!formData.dailyLeadRequirement) newErrors.dailyLeadRequirement = 'Daily lead requirement is required';
    } else if (activeStep === 2) {
      if (!formData.officeAddress.trim()) newErrors.officeAddress = 'Office address is required';
      if (!formData.officeCity.trim()) newErrors.officeCity = 'Office city is required';
      if (!formData.officeState) newErrors.officeState = 'Office state is required';
      if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
      if (!formData.companySince) newErrors.companySince = 'Company since is required';
      if (!formData.teamSize) newErrors.teamSize = 'Team size is required';
      if (!formData.companyType) newErrors.companyType = 'Company type is required';
    } else if (activeStep === 3) {
      if (!Object.values(verifiedDocs).some(Boolean)) {
        newErrors.eKyc = 'Verify at least one KYC document';
      }
    } else if (activeStep === 4) {
      if (!formData.referralSource) newErrors.referralSource = 'Select how you heard about syolo travel';
      if (formData.referralSource === 'OTHERS' && !formData.otherSource.trim()) {
        newErrors.otherSource = 'Enter source';
      }
      if (!formData.marketplaceWorked) newErrors.marketplaceWorked = 'Select an option';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
      if (!formData.declareTrue) newErrors.declareTrue = 'You must confirm the declaration';
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
      localStorage.setItem('kycData', JSON.stringify({ ...formData, verifiedDocs }));
      Swal.fire({
        title: 'Submitted!',
        text: 'KYC submitted successfully. Our team will review your application within 24 hours.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1785d4',
      }).then(() => {
        router.push('/admin/dashboard');
      });
    }
  };

  const renderFileReview = (label, field) => {
    const file = formData[field];
    const preview = filePreviews[field];

    if (!file) {
      return null;
    }

    return (
      <Paper key={field} variant="outlined" sx={{ p: 0.75, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.4 }}>
          {label}
        </Typography>
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt={label}
            sx={{
              width: '100%',
              height: 50,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 0.4,
            }}
          />
        ) : (
          <Box
            sx={{
              height: 50,
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 0.4,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Document uploaded
            </Typography>
          </Box>
        )}
        <Typography
          variant="caption"
          color="success.main"
          sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {file.name}
        </Typography>
      </Paper>
    );
  };

  const renderReviewValue = (label, value) => (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={600} sx={{ display: 'block', overflowWrap: 'anywhere' }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  const renderDocumentRow = (label, field, documentField) => (
    <Box
      key={field}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '0.7fr minmax(230px, 2fr) 82px 74px 92px' },
        gap: 0.75,
        alignItems: 'center',
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        name={field}
        value={formData[field]}
        onChange={(event) => {
          setVerifiedDocs((prev) => ({ ...prev, [field]: false }));
          handleChange(event);
        }}
        error={!!errors[field]}
        helperText={errors[field]}
        placeholder={`${label} Number`}
      />
      <Button
        variant="outlined"
        component="label"
        size="small"
        color={formData[documentField] ? 'success' : 'primary'}
        endIcon={formData[documentField] ? <CheckCircle fontSize="small" /> : null}
        sx={{
          px: 0.75,
          py: 0.55,
          minWidth: 0,
          fontSize: '0.68rem',
          '& .MuiButton-endIcon': { ml: 'auto' },
        }}
      >
        Upload
        <input
          type="file"
          name={documentField}
          hidden
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleChange}
        />
      </Button>
      <Typography
        variant="body2"
        color={verifiedDocs[field] ? 'success.main' : 'text.secondary'}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.35, fontSize: '0.75rem' }}
      >
        {verifiedDocs[field] && <CheckCircle sx={{ fontSize: 16 }} />}
        {verifiedDocs[field] ? 'Verified' : 'Pending'}
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={() => handleVerifyDocument(field)}
        disabled={verifiedDocs[field]}
        sx={{
          ...actionButtonSx,
          px: 0.75,
          py: 0.55,
          minWidth: 0,
          fontSize: '0.68rem',
        }}
      >
        {verifiedDocs[field] ? 'Done' : 'Verify Now'}
      </Button>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Services you want from us? *
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.25,
                mt: 2,
              }}
            >
              {serviceOptions.map((service) => (
                <FormControlLabel
                  key={service}
                  control={
                    <Checkbox
                      size="small"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                    />
                  }
                  label={service}
                  sx={{ m: 0 }}
                />
              ))}
            </Box>
            {errors.services && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {errors.services}
              </Typography>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grid container sx={twoColumnGridSx}>
              <Grid item xs={12} sx={fullRowSx}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={stateOptions}
                  value={formData.destinations}
                  onChange={(event, value) => {
                    setFormData((prev) => ({ ...prev, destinations: value }));
                    clearError('destinations');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      label="Search destinations in which you deal? *"
                      error={!!errors.destinations}
                      helperText={errors.destinations || 'Search and select multiple states'}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-tag': {
                      maxWidth: 180,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={fullRowSx}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="How many leads do you need daily? *"
                  name="dailyLeadRequirement"
                  value={formData.dailyLeadRequirement}
                  onChange={handleChange}
                  error={!!errors.dailyLeadRequirement}
                  helperText={errors.dailyLeadRequirement}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grid container sx={twoColumnGridSx}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Office Address City *"
                  name="officeCity"
                  value={formData.officeCity}
                  onChange={handleChange}
                  error={!!errors.officeCity}
                  helperText={errors.officeCity}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Office Address State *"
                  name="officeState"
                  value={formData.officeState}
                  onChange={handleChange}
                  error={!!errors.officeState}
                  helperText={errors.officeState}
                >
                  {stateOptions.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="GST Number *"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  error={!!errors.gstNumber}
                  helperText={errors.gstNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Company Since *"
                  name="companySince"
                  value={formData.companySince}
                  onChange={handleChange}
                  error={!!errors.companySince}
                  helperText={errors.companySince}
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Your Team Size *"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  error={!!errors.teamSize}
                  helperText={errors.teamSize}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Company Type *"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  error={!!errors.companyType}
                  helperText={errors.companyType}
                >
                  {companyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Facebook Url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Instagram Url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Profile URL"
                  name="profileUrl"
                  value={formData.profileUrl}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  color={formData.companyLogo ? 'success' : 'primary'}
                  endIcon={formData.companyLogo ? <CheckCircle fontSize="small" /> : null}
                  sx={{ py: 0.85, justifyContent: 'space-between' }}
                >
                  Upload Logo
                  <input
                    type="file"
                    name="companyLogo"
                    hidden
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleChange}
                  />
                </Button>
                {formData.companyLogo && (
                  <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                    {formData.companyLogo.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sx={fullRowSx}>
                <TextField
                  fullWidth
                  size="small"
                  label="Office Address *"
                  name="officeAddress"
                  multiline
                  rows={2}
                  value={formData.officeAddress}
                  onChange={handleChange}
                  error={!!errors.officeAddress}
                  helperText={errors.officeAddress}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              E-KYC
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Verify at least one KYC to proceed further and see the travel leads.
            </Typography>
            {errors.eKyc && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.eKyc}
              </Alert>
            )}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'grid' },
                  gridTemplateColumns: '0.7fr minmax(230px, 2fr) 82px 74px 92px',
                  gap: 0.75,
                  bgcolor: '#153451',
                  color: 'white',
                  px: 1.5,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  '& span': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              >
                <span>DOCUMENT TYPE</span>
                <span>DOCUMENT NUMBER</span>
                <span>UPLOAD</span>
                <span>STATUS</span>
                <span>ACTION</span>
              </Box>
              <Box sx={{ px: 1.5 }}>
                {renderDocumentRow('PAN', 'panNumber', 'panDocument')}
                {renderDocumentRow('GSTIN', 'gstinNumber', 'gstinDocument')}
                {renderDocumentRow('CIN', 'cinNumber', 'cinDocument')}
                {renderDocumentRow('AADHAR', 'aadharNumber', 'aadharDocument')}
              </Box>
            </Paper>
          </Box>
        );

      case 4:
        return (
          <Box>
            <FormControl component="fieldset" error={!!errors.referralSource} sx={{ width: '100%', mb: 1.25 }}>
              <FormLabel component="legend">How do you get to know about syolo travel?</FormLabel>
              <RadioGroup
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                  columnGap: 1.5,
                  rowGap: 0.75,
                  mt: 1,
                  '& .MuiFormControlLabel-root': {
                    m: 0,
                    minWidth: 0,
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              >
                {sourceOptions.map((source) => (
                  <FormControlLabel
                    key={source}
                    value={source}
                    control={<Radio size="small" />}
                    label={source}
                  />
                ))}
              </RadioGroup>
              {formData.referralSource === 'OTHERS' && (
                <TextField
                  size="small"
                  label="Other"
                  name="otherSource"
                  value={formData.otherSource}
                  onChange={handleChange}
                  error={!!errors.otherSource}
                  helperText={errors.otherSource}
                  sx={{ mt: 1, maxWidth: 260 }}
                />
              )}
              {errors.referralSource && (
                <Typography color="error" variant="caption">
                  {errors.referralSource}
                </Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" error={!!errors.marketplaceWorked} sx={{ width: '100%', mb: 2 }}>
              <FormLabel component="legend">Have you worked with any marketplace(s) before?</FormLabel>
              <RadioGroup
                row
                name="marketplaceWorked"
                value={formData.marketplaceWorked}
                onChange={handleChange}
                sx={{ gap: 8, mt: 1 }}
              >
                <FormControlLabel value="YES" control={<Radio size="small" />} label="YES" />
                <FormControlLabel value="NO" control={<Radio size="small" />} label="NO" />
              </RadioGroup>
              {errors.marketplaceWorked && (
                <Typography color="error" variant="caption">
                  {errors.marketplaceWorked}
                </Typography>
              )}
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
              }
              label="I agree to the Terms and Conditions"
              sx={{ display: 'block' }}
            />
            {errors.agreeTerms && (
              <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                {errors.agreeTerms}
              </Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  name="declareTrue"
                  checked={formData.declareTrue}
                  onChange={handleChange}
                />
              }
              label="I declare that all the information provided is true and correct"
              sx={{ display: 'block' }}
            />
            {errors.declareTrue && (
              <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                {errors.declareTrue}
              </Typography>
            )}
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Review Details
            </Typography>
            <Alert severity="info" sx={{ mb: 1 }}>
              Please review your filled details before submitting.
            </Alert>

            <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Services & Destinations
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 0.75 }}>
                {renderReviewValue('Services', formData.services.join(', '))}
                {renderReviewValue('Destinations', formData.destinations.join(', '))}
                {renderReviewValue('Daily Leads', formData.dailyLeadRequirement)}
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                About Company
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 0.75 }}>
                {renderReviewValue('Office City', formData.officeCity)}
                {renderReviewValue('Office State', formData.officeState)}
                {renderReviewValue('GST Number', formData.gstNumber)}
                {renderReviewValue('Company Since', formData.companySince)}
                {renderReviewValue('Team Size', formData.teamSize)}
                {renderReviewValue('Company Type', formData.companyType)}
                {renderReviewValue('Facebook Url', formData.facebookUrl)}
                {renderReviewValue('Instagram Url', formData.instagramUrl)}
                {renderReviewValue('Profile URL', formData.profileUrl)}
                <Box sx={fullRowSx}>
                  {renderReviewValue('Office Address', formData.officeAddress)}
                </Box>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                E-KYC Documents
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, minmax(0, 1fr))' }, gap: 0.75, mb: 1 }}>
                {renderReviewValue('PAN', `${formData.panNumber || '-'} (${verifiedDocs.panNumber ? 'Verified' : 'Pending'})`)}
                {renderReviewValue('GSTIN', `${formData.gstinNumber || '-'} (${verifiedDocs.gstinNumber ? 'Verified' : 'Pending'})`)}
                {renderReviewValue('CIN', `${formData.cinNumber || '-'} (${verifiedDocs.cinNumber ? 'Verified' : 'Pending'})`)}
                {renderReviewValue('AADHAR', `${formData.aadharNumber || '-'} (${verifiedDocs.aadharNumber ? 'Verified' : 'Pending'})`)}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, minmax(0, 1fr))' }, gap: 0.75 }}>
                {renderFileReview('Company Logo', 'companyLogo')}
                {renderFileReview('PAN Document', 'panDocument')}
                {renderFileReview('GSTIN Document', 'gstinDocument')}
                {renderFileReview('CIN Document', 'cinDocument')}
                {renderFileReview('AADHAR Document', 'aadharDocument')}
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Final Questions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0.75 }}>
                {renderReviewValue(
                  'How you heard about us',
                  formData.referralSource === 'OTHERS' ? formData.otherSource : formData.referralSource
                )}
                {renderReviewValue('Worked with marketplace before', formData.marketplaceWorked)}
              </Box>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const currentSlide = slideData[activeSlide];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: { md: '100vh' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1.08fr' },
        bgcolor: 'white',
        overflow: { md: 'hidden' },
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden',
          p: { md: 3.5, lg: 4 },
          bgcolor: '#fafafa',
          color: '#1f1f1f',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'center',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            bgcolor: '#c9302c',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.05rem',
            mb: 0.75,
          }}
        >
          SY
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#c9302c', letterSpacing: 0 }}>
          syolo travel
        </Typography>

        <Box
          sx={{
            width: '100%',
            maxWidth: 520,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: { md: 340, lg: 390 },
              height: { md: 220, lg: 250 },
              mx: 'auto',
              mb: 1.5,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              component="img"
              src={currentSlide.image}
              alt={currentSlide.title}
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            {currentSlide.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 430, mx: 'auto', lineHeight: 1.5 }}>
            {currentSlide.subtitle}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }}>
            {slideData.map((slide, index) => (
              <Box
                key={slide.title}
                component="button"
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                sx={{
                  width: 7,
                  height: 7,
                  border: 0,
                  borderRadius: '50%',
                  p: 0,
                  cursor: 'pointer',
                  bgcolor: index === activeSlide ? '#1f1f1f' : '#cfcfcf',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          minHeight: '100vh',
          height: { md: '100vh' },
          bgcolor: 'white',
          overflowY: { xs: 'visible', md: 'auto' },
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 760,
            mx: 'auto',
            p: { xs: 2, sm: 3, md: 4 },
            '& .MuiFormHelperText-root': { mt: 0.25 },
            '& .MuiInputBase-input': { py: 0.9 },
            '& .MuiFormControlLabel-label': { fontSize: '0.78rem', fontWeight: 600 },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Welcome syolo travel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              3 last step!!! Then you are good to go
            </Typography>
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 5,
              '& .MuiStep-root': { px: { xs: 0, sm: 0.5 } },
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.62rem', sm: '0.75rem' },
                lineHeight: 1.2,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 320 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: activeStep === 0 ? 'flex-end' : 'space-between', mt: 4 }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={<ArrowForward />}
                sx={{ ...actionButtonSx, minWidth: { xs: 180, sm: 420 }, py: 1.15 }}
              >
                Proceed
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ ...actionButtonSx, minWidth: { xs: 180, sm: 420 }, py: 1.15 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
