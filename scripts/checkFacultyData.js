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

async function checkFacultyData() {
  try {
    console.log('Fetching faculty data from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'faculty'));
    
    if (querySnapshot.empty) {
      console.log('No faculty documents found in Firestore.');
      return;
    }
    
    console.log('\nFound', querySnapshot.size, 'faculty members:');
    console.log('==========================================');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('\nID:', doc.id);
      console.log('Name:', data.name || 'N/A');
      console.log('Position:', data.position || data.designation || 'N/A');
      console.log('Image URL:', data.imageUrl || 'N/A');
      console.log('Image Base64:', data.imageBase64 ? '[EXISTS]' : 'N/A');
      console.log('Department:', data.department || 'N/A');
      console.log('Active:', data.isActive !== undefined ? data.isActive : 'N/A');
      console.log('==========================================');
    });
    
  } catch (error) {
    console.error('Error checking faculty data:', error);
  } finally {
    process.exit(0);
  }
}

checkFacultyData();
