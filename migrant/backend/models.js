const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  identifier: { type: String, required: true, unique: true }, // phone or email
  password: { type: String, required: true },
  language: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Authority Model
const authoritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  authorityType: { type: String, required: true }, // 'employer', 'government', 'healthcare', 'housing'
  organization: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  qrCode: { type: String, required: true, unique: true }, // Unique QR code identifier
  requiredDocuments: [{
    documentType: { type: String, required: true }, // 'aadhaar', 'workPermit', 'skillCertificate', 'medicalCertificate', 'addressProof', 'incomeProof'
    isRequired: { type: Boolean, default: true },
    description: { type: String, required: true }
  }],
  additionalRequirements: [{
    requirement: { type: String, required: true },
    isRequired: { type: Boolean, default: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Authority = mongoose.model('Authority', authoritySchema);

// Document Model
const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, required: true }, // 'aadhaar', 'workPermit', 'skillCertificate', 'medicalCertificate', 'addressProof', 'incomeProof'
  documentNumber: { type: String, required: true },
  documentName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  metadata: {
    issuingAuthority: { type: String },
    issueDate: { type: Date },
    additionalInfo: { type: String }
  }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

// Verification Model
const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Authority', required: true },
  authorityQrCode: { type: String, required: true },
  verificationDate: { type: Date, default: Date.now },
  verificationResult: {
    isEligible: { type: Boolean, required: true },
    missingDocuments: [{ type: String }],
    verifiedDocuments: [{ type: String }],
    overallStatus: { 
      type: String, 
      enum: ['eligible', 'ineligible', 'partial'], 
      required: true 
    }
  },
  scannedLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  deviceInfo: {
    userAgent: { type: String },
    platform: { type: String }
  }
}, { timestamps: true });

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = {
  User,
  Authority,
  Document,
  Verification
}; 