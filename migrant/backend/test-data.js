const mongoose = require('mongoose');
const { Authority, Document } = require('./models');
require('dotenv').config();

// Sample authorities data
const sampleAuthorities = [
  {
    name: "TechCorp Solutions",
    authorityType: "employer",
    organization: "TechCorp Solutions Pvt Ltd",
    location: "Bangalore, Karnataka",
    contactNumber: "+91-9876543210",
    email: "hr@techcorp.com",
    qrCode: "techcorp_employer_2024",
    requiredDocuments: [
      {
        documentType: "aadhaar",
        isRequired: true,
        description: "Aadhaar card for identity verification"
      },
      {
        documentType: "workPermit",
        isRequired: true,
        description: "Valid work permit for employment"
      },
      {
        documentType: "skillCertificate",
        isRequired: true,
        description: "Relevant skill certification"
      },
      {
        documentType: "medicalCertificate",
        isRequired: true,
        description: "Medical fitness certificate"
      }
    ],
    additionalRequirements: [
      {
        requirement: "Minimum 2 years experience",
        isRequired: true
      },
      {
        requirement: "Background verification",
        isRequired: true
      }
    ]
  },
  {
    name: "City Government Office",
    authorityType: "government",
    organization: "Municipal Corporation",
    location: "Mumbai, Maharashtra",
    contactNumber: "+91-9876543211",
    email: "info@municipal.gov.in",
    qrCode: "mumbai_govt_2024",
    requiredDocuments: [
      {
        documentType: "aadhaar",
        isRequired: true,
        description: "Aadhaar card for citizen verification"
      },
      {
        documentType: "addressProof",
        isRequired: true,
        description: "Valid address proof"
      },
      {
        documentType: "incomeProof",
        isRequired: true,
        description: "Income certificate for benefits"
      }
    ],
    additionalRequirements: [
      {
        requirement: "Resident of Mumbai for minimum 1 year",
        isRequired: true
      }
    ]
  },
  {
    name: "City General Hospital",
    authorityType: "healthcare",
    organization: "City General Hospital",
    location: "Delhi, NCR",
    contactNumber: "+91-9876543212",
    email: "admin@cityhospital.com",
    qrCode: "delhi_hospital_2024",
    requiredDocuments: [
      {
        documentType: "aadhaar",
        isRequired: true,
        description: "Aadhaar card for patient registration"
      },
      {
        documentType: "medicalCertificate",
        isRequired: false,
        description: "Previous medical records (if available)"
      }
    ],
    additionalRequirements: [
      {
        requirement: "Emergency contact information",
        isRequired: true
      }
    ]
  },
  {
    name: "Metro Housing Society",
    authorityType: "housing",
    organization: "Metro Housing Society",
    location: "Pune, Maharashtra",
    contactNumber: "+91-9876543213",
    email: "admin@metrohousing.com",
    qrCode: "pune_housing_2024",
    requiredDocuments: [
      {
        documentType: "aadhaar",
        isRequired: true,
        description: "Aadhaar card for tenant verification"
      },
      {
        documentType: "addressProof",
        isRequired: true,
        description: "Current address proof"
      },
      {
        documentType: "incomeProof",
        isRequired: true,
        description: "Income proof for rent eligibility"
      }
    ],
    additionalRequirements: [
      {
        requirement: "Security deposit equivalent to 2 months rent",
        isRequired: true
      },
      {
        requirement: "Character certificate from previous landlord",
        isRequired: false
      }
    ]
  }
];

// Sample documents data
const sampleDocuments = [
  {
    userId: "default-user-id",
    documentType: "aadhaar",
    documentNumber: "1234-5678-9012",
    documentName: "Aadhaar Card",
    fileUrl: "https://example.com/aadhaar.pdf",
    verificationStatus: "verified",
    verifiedBy: "UIDAI",
    verifiedAt: new Date("2024-01-15"),
    metadata: {
      issuingAuthority: "UIDAI",
      issueDate: new Date("2020-06-15"),
      additionalInfo: "Valid Aadhaar card"
    }
  },
  {
    userId: "default-user-id",
    documentType: "workPermit",
    documentNumber: "WP-2024-001",
    documentName: "Work Permit",
    fileUrl: "https://example.com/work-permit.pdf",
    verificationStatus: "verified",
    verifiedBy: "Ministry of Labour",
    verifiedAt: new Date("2024-02-01"),
    expiryDate: new Date("2025-02-01"),
    metadata: {
      issuingAuthority: "Ministry of Labour",
      issueDate: new Date("2024-02-01"),
      additionalInfo: "Valid work permit for Karnataka"
    }
  },
  {
    userId: "default-user-id",
    documentType: "skillCertificate",
    documentNumber: "SC-2024-001",
    documentName: "IT Skills Certificate",
    fileUrl: "https://example.com/skill-cert.pdf",
    verificationStatus: "verified",
    verifiedBy: "NASSCOM",
    verifiedAt: new Date("2024-01-20"),
    metadata: {
      issuingAuthority: "NASSCOM",
      issueDate: new Date("2024-01-20"),
      additionalInfo: "Certified in Full Stack Development"
    }
  }
];

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Authority.deleteMany({});
    await Document.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert sample authorities
    const authorities = await Authority.insertMany(sampleAuthorities);
    console.log(`✅ Inserted ${authorities.length} authorities`);

    // Insert sample documents
    const documents = await Document.insertMany(sampleDocuments);
    console.log(`✅ Inserted ${documents.length} documents`);

    console.log('\n📋 Sample Data Summary:');
    console.log('Authorities:');
    authorities.forEach(auth => {
      console.log(`  - ${auth.name} (${auth.authorityType}) - QR: ${auth.qrCode}`);
    });

    console.log('\nDocuments:');
    documents.forEach(doc => {
      console.log(`  - ${doc.documentName} (${doc.documentType}) - Status: ${doc.verificationStatus}`);
    });

    console.log('\n🎯 Test QR Codes:');
    console.log('1. techcorp_employer_2024 - For employment verification');
    console.log('2. mumbai_govt_2024 - For government services');
    console.log('3. delhi_hospital_2024 - For healthcare services');
    console.log('4. pune_housing_2024 - For housing verification');

    console.log('\n✅ Database populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

// Run the script
populateDatabase(); 