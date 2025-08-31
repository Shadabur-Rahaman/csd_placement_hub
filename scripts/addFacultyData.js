const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Updated faculty data with better structure
const faculties = [
  {
    name: 'Dr. Pramod',
    designation: 'Professor and HOD',
    email: 'hodcsd@pestrust.edu.in',
    qualification: 'Ph.D.',
    experience: '23 Years',
    department: 'Computer Science',
    isActive: true,
    order: 1,
    imageUrl: '/faculty/images/dr-pramod.jpg',
    bio: 'Dr. Pramod is a distinguished professor with over 23 years of experience in computer science education and research.',
    specializations: ['Machine Learning', 'Data Science', 'Software Engineering'],
    phone: '',
    office: 'CS Department, Block A'
  },
  {
    name: 'Mrs. Ayisha Khanum',
    designation: 'Assistant Professor',
    email: 'ayishak@pestrust.edu.in',
    qualification: 'B.E, M.Tech',
    experience: '9 Years',
    department: 'Computer Science',
    isActive: true,
    order: 2,
    imageUrl: '/faculty/images/ayisha-khanum.jpg',
    bio: 'Mrs. Ayisha Khanum is an experienced educator specializing in various areas of computer science.',
    specializations: ['Web Development', 'Database Management', 'Programming Languages'],
    phone: '',
    office: 'CS Department, Block A'
  },
  {
    name: 'Mr. Manjunatha G',
    designation: 'Assistant Professor', 
    email: 'manjunathag1830@pestrust.edu.in',
    qualification: 'DEC, B.E, M.Tech',
    experience: '10 Years',
    department: 'Computer Science',
    isActive: true,
    order: 3,
    imageUrl: '/faculty/images/manjunatha-g.png',
    bio: 'Mr. Manjunatha G brings extensive industry and academic experience to the department.',
    specializations: ['Network Security', 'Computer Networks', 'Cyber Security'],
    phone: '',
    office: 'CS Department, Block A'
  },
  {
    name: 'Mr. Harish M',
    designation: 'Assistant Professor',
    email: 'harishm1843@pestrust.edu.in', 
    qualification: 'B.E, M.Tech',
    experience: '8 Years',
    department: 'Computer Science',
    isActive: true,
    order: 4,
    imageUrl: '/faculty/images/harish-m.jpg',
    bio: 'Mr. Harish M is passionate about teaching and research in emerging technologies.',
    specializations: ['Mobile App Development', 'Software Testing', 'Cloud Computing'],
    phone: '',
    office: 'CS Department, Block A'
  },
  {
    name: 'Mrs. Kavya S',
    designation: 'Assistant Professor',
    email: 'kavyas1828@pestrust.edu.in',
    qualification: 'B.E, M.Tech', 
    experience: '10 Years',
    department: 'Computer Science',
    isActive: true,
    order: 5,
    imageUrl: '/faculty/images/kavya-s.jpg',
    bio: 'Mrs. Kavya S is dedicated to excellence in computer science education and student development.',
    specializations: ['Artificial Intelligence', 'Machine Learning', 'Data Structures'],
    phone: '',
    office: 'CS Department, Block A'
  }
];

async function addFaculties() {
  try {
    console.log('Starting faculty data update process...');
    
    // Clear existing faculty data
    console.log('Clearing existing faculty data...');
    const querySnapshot = await getDocs(collection(db, 'faculty'));
    
    if (querySnapshot.docs.length > 0) {
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`Cleared ${querySnapshot.docs.length} existing faculty records.`);
    } else {
      console.log('No existing faculty data to clear.');
    }
    
    // Add new faculty members
    console.log('Adding new faculty members...');
    
    const addPromises = faculties.map(async (faculty, index) => {
      console.log(`Adding ${faculty.name} (${index + 1}/${faculties.length})...`);
      
      const facultyData = {
        ...faculty,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Ensure all required fields are present
        bio: faculty.bio || `${faculty.name} is a dedicated member of our Computer Science faculty.`,
        specializations: faculty.specializations || [],
        phone: faculty.phone || '',
        office: faculty.office || 'CS Department'
      };
      
      return addDoc(collection(db, 'faculty'), facultyData);
    });
    
    await Promise.all(addPromises);
    
    console.log('✅ Successfully added all faculty members!');
    console.log(`Total faculty members added: ${faculties.length}`);
    
    // Verify the data was added
    const verifySnapshot = await getDocs(collection(db, 'faculty'));
    console.log(`✅ Verification: ${verifySnapshot.docs.length} faculty members now in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating faculty data:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the script
console.log('Firebase Faculty Data Update Script');
console.log('===================================');
addFaculties();