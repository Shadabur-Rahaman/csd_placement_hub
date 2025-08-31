import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/client';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './faculty-styles.css';

// Animation variants
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FacultyDetail = () => {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [publications, setPublications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      try {
        // Fetch faculty details
        const facultyRef = doc(db, 'faculty', id);
        const facultySnap = await getDoc(facultyRef);
        
        if (facultySnap.exists()) {
          setFaculty({ id: facultySnap.id, ...facultySnap.data() });
          
          // Fetch faculty publications
          const publicationsQuery = query(
            collection(db, 'research'),
            where('facultyId', '==', id)
          );
          const publicationsSnap = await getDocs(publicationsQuery);
          const publicationsData = publicationsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPublications(publicationsData);

          // Fetch faculty achievements
          const achievementsQuery = query(
            collection(db, 'achievements'),
            where('facultyId', '==', id)
          );
          const achievementsSnap = await getDocs(achievementsQuery);
          const achievementsData = achievementsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAchievements(achievementsData);
        }
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacultyData();
    }
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `faculty/${faculty.id}/${file.name}`);
      
      // Upload the file
      const uploadTask = uploadBytes(storageRef, file);
      
      // Monitor upload progress
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
          setUploading(false);
        },
        async () => {
          // Get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Update the faculty document with the new image URL
          const facultyRef = doc(db, 'faculty', faculty.id);
          await updateDoc(facultyRef, {
            imageUrl: downloadURL,
            updatedAt: new Date().toISOString()
          });
          
          // Update local state
          setFaculty(prev => ({
            ...prev,
            imageUrl: downloadURL
          }));
          
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLight 
          ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
          : 'bg-[#030014] bg-grid-pattern'
      }`}>
        <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${
          isLight ? 'border-blue-600' : 'border-white'
        }`}></div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Faculty not found</h2>
          <Link to="/faculty" className="text-blue-500 hover:underline">
            Back to Faculty
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-24 ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 text-gray-900' 
        : 'bg-[#030014] bg-grid-pattern text-white'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariant}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0 relative group">
              <div className="h-64 md:h-full md:w-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <img 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  src={faculty.imageUrl || '/faculty/default-profile.svg'} 
                  alt={faculty.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/faculty/default-profile.svg';
                  }}
                />
                {currentUser && (
                  <label 
                    className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer ${uploading ? 'opacity-100' : ''}`}
                  >
                    <input 
                      type="file" 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="text-white text-center p-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p>Uploading... {Math.round(uploadProgress)}%</p>
                      </div>
                    ) : (
                      <div className="text-white text-center p-4">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="uppercase tracking-wide text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {faculty.designation}
                  </div>
                  <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                    {faculty.name}
                  </h1>
                  <p className="mt-1 text-gray-500 dark:text-gray-300">
                    <a href={`mailto:${faculty.email}`} className="hover:text-blue-500 hover:underline">
                      {faculty.email}
                    </a>
                  </p>
                </div>
                <Link 
                  to="/faculty" 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {faculty.qualification && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Educational Qualification</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{faculty.qualification}</p>
                  </div>
                )}
                
                {faculty.experience && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Experience</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{faculty.experience}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quote Section */}
        {faculty.quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-24 text-center mt-24"
          >
            <div className={`px-8 py-12 rounded-2xl relative ${
              isLight 
                ? 'bg-white/60 backdrop-blur-sm shadow-xl shadow-violet-100/30' 
                : 'bg-white/5 backdrop-blur-lg border border-white/10'
            }`}>
              <div className="absolute top-6 left-10 text-6xl opacity-30">
                <span className={isLight ? 'text-violet-300' : 'text-violet-600'}>❝</span>
              </div>
              <blockquote className={`text-3xl font-light italic z-10 relative ${
                isLight ? 'text-gray-700' : 'text-gray-300'
              }`}>
                "{faculty.quote}"
              </blockquote>
              <div className="absolute bottom-6 right-10 text-6xl opacity-30">
                <span className={isLight ? 'text-violet-300' : 'text-violet-600'}>❞</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Publications Section */}
        {publications.length > 0 && (
          <motion.div
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className={`text-3xl font-bold mb-12 ${
              isLight 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>Research Publications</h2>
            
            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {publications.map((pub) => (
                <motion.div
                  key={pub.id}
                  variants={fadeInUpVariant}
                  className={`rounded-xl p-6 transition-all duration-300 h-full ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isLight ? 'text-violet-800' : 'text-violet-300'
                  }`}>{pub.title}</h3>
                  
                  <p className={`mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{pub.description}</p>
                  
                  {pub.date && (
                    <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                      Published: {new Date(pub.date).toLocaleDateString()}
                    </p>
                  )}
                  
                  {pub.link && (
                    <a 
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block mt-4 ${
                        isLight 
                          ? 'text-violet-600 hover:text-violet-700' 
                          : 'text-violet-400 hover:text-violet-300'
                      } transition-colors`}
                    >
                      Read Publication →
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <motion.div
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl font-bold mb-12 ${
              isLight 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>Achievements</h2>
            
            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={fadeInUpVariant}
                  className={`rounded-xl p-6 transition-all duration-300 h-full ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isLight ? 'text-cyan-800' : 'text-cyan-300'
                  }`}>
                    {achievement.title}
                  </h3>
                  
                  <p className={`mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.date && (
                    <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FacultyDetail;