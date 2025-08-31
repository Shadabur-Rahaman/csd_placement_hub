const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: 'https://dept-csd.firebaseio.com'
});

const db = admin.firestore();

// Faculty data to add
const faculties = [
  {
    name: 'Dr. John Doe',
    email: 'john.doe@example.com',
    designation: 'Professor',
    department: 'Computer Science',
    phone: '+1234567890',
    isActive: true
  },
  {
    name: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    designation: 'Associate Professor',
    department: 'Computer Science',
    phone: '+1987654321',
    isActive: true
  },
  {
    name: 'Dr. Robert Johnson',
    email: 'robert.johnson@example.com',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    phone: '+1122334455',
    isActive: true
  }
];

// Add faculties to Firestore
async function addFaculties() {
  try {
    const batch = db.batch();
    const facultiesRef = db.collection('faculties');
    
    faculties.forEach(faculty => {
      const newFacultyRef = facultiesRef.doc();
      batch.set(newFacultyRef, faculty);
    });
    
    await batch.commit();
    console.log('Successfully added 3 faculties to Firestore!');
  } catch (error) {
    console.error('Error adding faculties: ', error);
  } finally {
    process.exit();
  }
}

addFaculties();
