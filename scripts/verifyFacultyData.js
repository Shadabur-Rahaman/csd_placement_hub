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

async function verifyFacultyData() {
  try {
    console.log('Verifying faculty data in Firestore...');
    const querySnapshot = await getDocs(collection(db, 'faculty'));
    
    if (querySnapshot.empty) {
      console.log('No faculty documents found in Firestore.');
      return;
    }
    
    console.log('\nVerification Results:');
    console.log('===================');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\nFaculty: ${data.name || 'N/A'}`);
      console.log('-----------------------------------');
      
      // Check required fields
      const requiredFields = ['name', 'position', 'imageUrl'];
      requiredFields.forEach(field => {
        console.log(`${field}: ${data[field] ? '✅' : '❌'} ${data[field] || 'MISSING'}`);
      });
      
      // Check image URL format
      if (data.imageUrl) {
        const isValidUrl = typeof data.imageUrl === 'string' && 
                         (data.imageUrl.startsWith('/faculty/') || 
                          data.imageUrl.startsWith('http'));
        console.log(`Image URL format: ${isValidUrl ? '✅' : '❌'} ${data.imageUrl}`);
      }
      
      console.log('-----------------------------------');
    });
    
    console.log('\nVerification complete!');
    
  } catch (error) {
    console.error('Error verifying faculty data:', error);
  } finally {
    process.exit(0);
  }
}

verifyFacultyData();
