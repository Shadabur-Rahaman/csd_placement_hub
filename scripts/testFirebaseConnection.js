const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

console.log('Testing Firebase connection...');
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Check for missing required config
const requiredConfig = ['apiKey', 'projectId', 'appId'];
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  console.error('Missing required Firebase configuration:', missingConfig.join(', '));
  process.exit(1);
}

console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  try {
    console.log('\nTesting Firestore connection...');
    const facultyRef = collection(db, 'faculty');
    console.log('Collection reference created');
    
    console.log('Attempting to fetch documents...');
    const querySnapshot = await getDocs(facultyRef);
    
    console.log(`\nSuccess! Found ${querySnapshot.size} faculty documents`);
    
    if (querySnapshot.size > 0) {
      console.log('\nFirst document data:');
      const firstDoc = querySnapshot.docs[0].data();
      console.log(JSON.stringify(firstDoc, null, 2));
      
      if (firstDoc.imageUrl) {
        console.log('\nImage URL:', firstDoc.imageUrl);
      } else {
        console.log('\nNo imageUrl found in document');
      }
    }
    
  } catch (error) {
    console.error('\nError testing Firebase connection:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.code === 'permission-denied') {
      console.error('\n⚠️  Permission denied. Check your Firestore security rules.');
    } else if (error.code === 'unavailable') {
      console.error('\n⚠️  Could not reach Firestore. Check your internet connection.');
    }
    
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testConnection();
