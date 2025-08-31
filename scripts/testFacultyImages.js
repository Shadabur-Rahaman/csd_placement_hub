const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFacultyImages() {
  try {
    console.log('Fetching faculty data from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'faculty'));
    
    console.log('\nFaculty Members:');
    console.log('----------------');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\nName: ${data.name}`);
      console.log(`Image URL: ${data.imageUrl}`);
      console.log(`Designation: ${data.designation}`);
      console.log(`Department: ${data.department}`);
      console.log('----------------');
    });
    
    console.log('\nTesting local image paths:');
    const testPaths = [
      '/faculty/images/dr-pramod.jpg',
      '/faculty/images/ayisha-khanum.jpg',
      '/faculty/images/manjunatha-g.png',
      '/faculty/images/harish-m.jpg',
      '/faculty/images/kavya-s.jpg'
    ];
    
    console.log('\nTest these paths in your browser:');
    testPaths.forEach(path => {
      console.log(`http://localhost:3000${path}`);
    });
    
  } catch (error) {
    console.error('Error testing faculty images:', error);
  } finally {
    process.exit(0);
  }
}

testFacultyImages();
