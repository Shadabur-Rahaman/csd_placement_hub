import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useTheme } from '../../contexts/ThemeContext';

const FacultySection = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching faculty data from Firestore...');
        const facultyQuery = query(
          collection(db, 'faculty'),
          orderBy('name', 'asc')
        );
        const querySnapshot = await getDocs(facultyQuery);
        
        if (querySnapshot.empty) {
          console.warn('No faculty documents found in Firestore collection');
          setFaculty([]);
          return;
        }

        console.log(`Found ${querySnapshot.size} faculty documents`);
        
        const facultyData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`Processing faculty: ${data.name || 'Unnamed'} (ID: ${doc.id})`);
          console.log('Raw data:', JSON.stringify(data, null, 2));
          
          const facultyMember = {
            id: doc.id,
            ...data,
            name: data.name || 'Unknown',
            position: data.position || data.designation || 'Faculty Member',
            specialization: data.specialization || '',
            education: data.education || data.qualification || '',
            quote: data.quote || '',
            imageUrl: data.imageUrl || null
          };
          
          console.log('Processed data:', JSON.stringify(facultyMember, null, 2));
          return facultyMember;
        });

        console.log('Successfully processed faculty data:', facultyData.length, 'members');
        console.log('Sample faculty member:', JSON.stringify(facultyData[0], null, 2));
        setFaculty(facultyData);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`relative overflow-hidden py-20 ${isLight ? 'bg-transparent' : 'bg-[#030014]/50'}`}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isLight 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
            }`}
          >
            Our Faculty
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xl ${isLight ? 'text-gray-600' : 'text-gray-300'}`}
          >
            Meet our distinguished team of educators and researchers
          </motion.p>
        </div>

        {error && (
          <div className={`text-center py-8 ${isLight ? 'text-red-600' : 'text-red-400'}`}>
            <p>Error loading faculty data. Please try again later.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {!error && (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-8"
          >
            {faculty.map((member) => (
              <motion.div
                key={member.id}
                variants={item}
                className={`group relative overflow-hidden rounded-3xl ${
                  isLight 
                    ? 'bg-white/70 backdrop-blur-xl hover:bg-white/90' 
                    : 'bg-white/5 backdrop-blur-xl hover:bg-white/10'
                } shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(120,119,198,0.3)] transition-all duration-500 transform hover:-translate-y-2`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <div className="aspect-square relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/faculty/default-profile.svg';
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          isLight 
                            ? 'bg-gradient-to-br from-violet-100/80 via-purple-100/80 to-cyan-100/80' 
                            : 'bg-gradient-to-br from-violet-900/30 via-purple-900/30 to-cyan-900/30'
                        }`}>
                          <span className={`text-6xl font-bold ${
                            isLight ? 'text-violet-400' : 'text-white/50'
                          }`}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:w-2/3 p-8 relative">
                    {/* Decorative gradient line */}
                    <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${
                      isLight 
                        ? 'from-violet-500/20 via-purple-500/20 to-cyan-500/20' 
                        : 'from-violet-500/40 via-purple-500/40 to-cyan-500/40'
                    } group-hover:opacity-100 opacity-0 transition-opacity duration-500`}></div>
                    
                    <h3 className={`text-2xl font-bold mb-3 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    } group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-cyan-500 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300`}>
                      {member.name}
                    </h3>
                    <p className={`text-lg font-medium mb-6 ${
                      isLight ? 'text-violet-600' : 'text-violet-400'
                    } opacity-90 group-hover:opacity-100 transition-opacity duration-300`}>
                      {member.position}
                    </p>

                    <div className={`space-y-4 text-base ${
                      isLight ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {member.specialization && (
                        <p className="transform transition-all duration-300 group-hover:translate-x-2">
                          <span className={`font-medium ${
                            isLight ? 'text-violet-600/70' : 'text-violet-400/70'
                          }`}>Specialization:</span>{' '}
                          {member.specialization}
                        </p>
                      )}
                      {member.education && (
                        <p className="transform transition-all duration-300 group-hover:translate-x-2">
                          <span className={`font-medium ${
                            isLight ? 'text-violet-600/70' : 'text-violet-400/70'
                          }`}>Education:</span>{' '}
                          {member.education}
                        </p>
                      )}
                    </div>

                    {member.quote && (
                      <blockquote className={`mt-6 text-base italic relative ${
                        isLight 
                          ? 'text-gray-600' 
                          : 'text-gray-400'
                      } pl-6 group-hover:pl-8 transition-all duration-300`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                          isLight 
                            ? 'bg-gradient-to-b from-violet-500/30 to-cyan-500/30' 
                            : 'bg-gradient-to-b from-violet-500/50 to-cyan-500/50'
                        } group-hover:w-2 transition-all duration-300`}></div>
                        "{member.quote}"
                      </blockquote>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className={`animate-spin rounded-full h-16 w-16 border-4 border-violet-500/20 border-t-4 ${
              isLight ? 'border-t-violet-600' : 'border-t-violet-400'
            }`}></div>
          </div>
        )}

        {!loading && !error && faculty.length === 0 && (
          <div className="text-center py-12">
            <h3 className={`text-xl font-semibold mb-2 ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              No Faculty Found
            </h3>
            <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>
              Please check back later
            </p>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FacultySection; 