# QR Code Verification System for MigrantConnect

## Overview

The QR Code Verification System allows migrant workers to scan authority QR codes to instantly verify if their documents meet the requirements for various services. This reverse verification approach puts control in the hands of migrant workers, allowing them to check their eligibility before approaching authorities.

## Features

### 🔍 **Reverse QR Verification**
- Migrant workers scan authority QR codes
- Instant verification of document eligibility
- Real-time status updates
- Location tracking for audit purposes

### 📱 **Mobile-First Design**
- Camera-based QR scanning
- Manual QR code input option
- Responsive design for all devices
- Offline-capable verification

### 📊 **Comprehensive Results**
- Document status overview (verified/missing)
- Authority information display
- Additional requirements listing
- Verification history tracking

### 🎯 **Multiple Authority Types**
- **Employers**: Job application verification
- **Government**: Benefits and services
- **Healthcare**: Medical service access
- **Housing**: Rental application verification

## System Architecture

### Backend Components

#### Models
- **Authority Model**: Stores authority information and QR codes
- **Document Model**: Manages user documents with verification status
- **Verification Model**: Tracks verification attempts and results

#### APIs
- `POST /api/authorities` - Create new authorities
- `GET /api/authorities` - List all authorities
- `POST /api/documents` - Upload user documents
- `GET /api/documents/:userId` - Get user documents
- `POST /api/verify-qr` - Verify QR code and check eligibility
- `GET /api/verifications/:userId` - Get verification history

### Frontend Components

#### Core Components
- **QRScanner**: Camera-based QR code scanning
- **VerificationResult**: Display verification results
- **QRVerification**: Main verification interface
- **VerificationHistory**: View past verifications

#### Integration
- Integrated into Dashboard under "Digital Identity & Documents"
- Accessible via "Scan QR Code" and "View History" buttons

## Installation & Setup

### 1. Backend Setup

```bash
cd migrant/backend

# Install dependencies
npm install

# Create .env file with MongoDB URI
echo "MONGO_URI=your_mongodb_connection_string" > .env

# Populate database with sample data
node test-data.js

# Start the server
npm start
```

### 2. Frontend Setup

```bash
cd migrant/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Database Population

Run the test data script to populate sample authorities and documents:

```bash
cd migrant/backend
node test-data.js
```

This will create:
- 4 sample authorities (employer, government, healthcare, housing)
- 3 sample documents for testing
- Test QR codes for verification

## Usage Guide

### For Migrant Workers

1. **Access QR Verification**
   - Login to MigrantConnect
   - Go to "Digital Identity & Documents" section
   - Click "Scan QR Code" button

2. **Scan Authority QR Code**
   - Point camera at authority's QR code
   - Or manually enter QR code
   - System will verify your documents

3. **View Results**
   - See which documents are verified (green ✓)
   - See which documents are missing (red ✗)
   - Check overall eligibility status
   - View additional requirements

4. **View History**
   - Click "View History" to see past verifications
   - Track verification attempts and results
   - Monitor document status over time

### For Authorities

1. **Generate QR Code**
   - Contact system administrator
   - Provide authority details and requirements
   - Receive unique QR code

2. **Display QR Code**
   - Print QR code on ID cards, posters, or screens
   - Make it easily accessible to migrant workers
   - Update requirements as needed

## Test QR Codes

Use these QR codes for testing:

1. **techcorp_employer_2024** - Employment verification
   - Requires: Aadhaar, Work Permit, Skill Certificate, Medical Certificate
   - Additional: 2 years experience, background verification

2. **mumbai_govt_2024** - Government services
   - Requires: Aadhaar, Address Proof, Income Proof
   - Additional: Mumbai resident for 1+ year

3. **delhi_hospital_2024** - Healthcare services
   - Requires: Aadhaar (Medical Certificate optional)
   - Additional: Emergency contact information

4. **pune_housing_2024** - Housing verification
   - Requires: Aadhaar, Address Proof, Income Proof
   - Additional: Security deposit, character certificate

## Document Types

The system supports these document types:

- **aadhaar**: Aadhaar Card
- **workPermit**: Work Permit
- **skillCertificate**: Skill Certificate
- **medicalCertificate**: Medical Certificate
- **addressProof**: Address Proof
- **incomeProof**: Income Proof

## Verification Status

### Overall Status
- **Eligible**: All required documents verified
- **Partial**: Some documents verified, some missing
- **Ineligible**: No required documents verified

### Document Status
- **Verified**: Document uploaded and verified
- **Pending**: Document uploaded, awaiting verification
- **Rejected**: Document rejected during verification
- **Missing**: Document not uploaded

## Security Features

- **Location Tracking**: Records scan location for audit
- **Device Information**: Logs device details for security
- **Verification History**: Complete audit trail
- **Secure QR Codes**: Unique, non-guessable QR codes
- **User Privacy**: Migrant controls when to share data

## API Documentation

### Verify QR Code
```javascript
POST /api/verify-qr
{
  "qrCode": "techcorp_employer_2024",
  "userId": "user123",
  "scannedLocation": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Android"
  }
}
```

### Response
```javascript
{
  "authority": {
    "name": "TechCorp Solutions",
    "organization": "TechCorp Solutions Pvt Ltd",
    "authorityType": "employer",
    "location": "Bangalore, Karnataka"
  },
  "verificationResult": {
    "isEligible": true,
    "missingDocuments": [],
    "verifiedDocuments": ["aadhaar", "workPermit", "skillCertificate"],
    "overallStatus": "eligible",
    "requiredDocuments": [...],
    "additionalRequirements": [...]
  }
}
```

## Troubleshooting

### Common Issues

1. **Camera Not Working**
   - Ensure HTTPS connection (required for camera access)
   - Check browser permissions
   - Use manual input as fallback

2. **QR Code Not Recognized**
   - Verify QR code is valid and active
   - Check internet connection
   - Try manual input option

3. **Documents Not Showing**
   - Ensure documents are uploaded and verified
   - Check user ID matches
   - Contact support if issues persist

### Error Messages

- **"Invalid QR code"**: QR code doesn't exist or is inactive
- **"Camera access denied"**: Browser permissions required
- **"Verification failed"**: Network or server error

## Future Enhancements

- **Real-time QR Code Generation**: Authorities can generate QR codes on-demand
- **Offline Verification**: Work without internet connection
- **Multi-language Support**: Interface in multiple languages
- **Biometric Integration**: Fingerprint/face verification
- **Blockchain Integration**: Immutable verification records
- **SMS Notifications**: Alert authorities of verification attempts

## Support

For technical support or questions:
- Check the troubleshooting section
- Review API documentation
- Contact the development team

---

**Note**: This system is designed to empower migrant workers by giving them control over their document verification process. It reduces waiting times and improves service access efficiency. 