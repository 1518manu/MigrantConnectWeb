const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Authority, Document, Verification } = require('./models');

const router = express.Router();

// Authentication Routes
router.post('/register', async (req, res) => {
  const { name, identifier, password, language } = req.body;
  if (!name || !identifier || !password || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const existing = await User.findOne({ identifier });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, identifier, password: hashedPassword, language });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user._id,
        name: user.name, 
        identifier: user.identifier, 
        language: user.language 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Authority Management Routes
router.post('/authorities', async (req, res) => {
  try {
    const { name, authorityType, organization, location, contactNumber, email, requiredDocuments, additionalRequirements } = req.body;
    
    // Generate unique QR code
    const qrCode = crypto.randomBytes(16).toString('hex');
    
    const authority = new Authority({
      name,
      authorityType,
      organization,
      location,
      contactNumber,
      email,
      qrCode,
      requiredDocuments,
      additionalRequirements
    });
    
    await authority.save();
    res.json({ message: 'Authority created successfully', authority });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/authorities', async (req, res) => {
  try {
    const authorities = await Authority.find({ isActive: true });
    res.json(authorities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Document Management Routes
router.post('/documents', async (req, res) => {
  try {
    const { userId, documentType, documentNumber, documentName, fileUrl, expiryDate, metadata } = req.body;
    
    const document = new Document({
      userId,
      documentType,
      documentNumber,
      documentName,
      fileUrl,
      expiryDate,
      metadata
    });
    
    await document.save();
    res.json({ message: 'Document uploaded successfully', document });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/documents/:userId', async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.params.userId, isActive: true });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// QR Code Verification Route
router.post('/verify-qr', async (req, res) => {
  try {
    const { qrCode, userId, scannedLocation, deviceInfo } = req.body;
    
    // Find authority by QR code
    const authority = await Authority.findOne({ qrCode, isActive: true });
    if (!authority) {
      return res.status(404).json({ error: 'Invalid QR code or authority not found' });
    }
    
    // Get user's documents
    const userDocuments = await Document.find({ userId, isActive: true });
    
    // Check required documents
    const requiredDocTypes = authority.requiredDocuments
      .filter(doc => doc.isRequired)
      .map(doc => doc.documentType);
    
    const verifiedDocuments = [];
    const missingDocuments = [];
    
    requiredDocTypes.forEach(docType => {
      const userDoc = userDocuments.find(doc => 
        doc.documentType === docType && doc.verificationStatus === 'verified'
      );
      
      if (userDoc) {
        verifiedDocuments.push(docType);
      } else {
        missingDocuments.push(docType);
      }
    });
    
    // Determine overall status
    let overallStatus = 'eligible';
    if (missingDocuments.length === requiredDocTypes.length) {
      overallStatus = 'ineligible';
    } else if (missingDocuments.length > 0) {
      overallStatus = 'partial';
    }
    
    const isEligible = overallStatus === 'eligible';
    
    // Save verification record
    const verification = new Verification({
      userId,
      authorityId: authority._id,
      authorityQrCode: qrCode,
      verificationResult: {
        isEligible,
        missingDocuments,
        verifiedDocuments,
        overallStatus
      },
      scannedLocation,
      deviceInfo
    });
    
    await verification.save();
    
    res.json({
      authority: {
        name: authority.name,
        organization: authority.organization,
        authorityType: authority.authorityType,
        location: authority.location
      },
      verificationResult: {
        isEligible,
        missingDocuments,
        verifiedDocuments,
        overallStatus,
        requiredDocuments: authority.requiredDocuments,
        additionalRequirements: authority.additionalRequirements
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verification History Route
router.get('/verifications/:userId', async (req, res) => {
  try {
    const verifications = await Verification.find({ userId })
      .populate('authorityId', 'name organization authorityType')
      .sort({ verificationDate: -1 });
    res.json(verifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

module.exports = router; 