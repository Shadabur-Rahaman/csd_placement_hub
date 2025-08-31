import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { TextHoverEffect } from '../../components/ui/text-hover-effect';

// Animation variants for staggered cards
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      console.log('Fetching faculty data...');
      const facultyCollection = collection(db, 'faculty');
      const facultySnapshot = await getDocs(facultyCollection);
      
      if (facultySnapshot.empty) {
        console.warn('No faculty documents found');
        setFaculty([]);
        return;
      }

      console.log(`Found ${facultySnapshot.size} faculty members`);
      
      const facultyData = facultySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Processing faculty: ${data.name || 'Unnamed'} (ID: ${doc.id})`);
        console.log('Raw data:', data);
        
        return {
          id: doc.id,
          ...data,
          name: data.name || 'Unknown',
          position: data.position || data.designation || 'Faculty Member',
          imageUrl: data.imageUrl || null
        };
      });
      
      // Sort by name
      facultyData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      
      console.log('Processed faculty data:', facultyData);
      setFaculty(facultyData);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(faculty.map(f => f.department).filter(Boolean))];

  // Filter faculty based on search term and department
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = !searchTerm || 
      (f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.specialization && f.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === 'all' || f.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className={`min-h-screen py-24 ${
      isLight 
        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 text-gray-900' 
        : 'bg-[#030014] bg-grid-pattern text-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="mx-auto mb-6">
            <TextHoverEffect text="Faculty" duration={0.3} />
          </div>
          <p className={`text-xl max-w-3xl mx-auto ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
            Meet our exceptional faculty members who are dedicated to shaping the future of Computer Science & Design education.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  isLight 
                    ? 'bg-white border border-gray-200 focus:ring-violet-500 text-gray-800 placeholder-gray-400 shadow-sm' 
                    : 'bg-white/5 border border-white/10 focus:ring-violet-400 text-white placeholder-gray-400'
                }`}
              />
            </div>
            
            {departments.length > 0 && (
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={`w-full md:w-auto px-6 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  isLight 
                    ? 'bg-white border border-gray-200 focus:ring-violet-500 text-gray-800' 
                    : 'bg-white/5 border border-white/10 focus:ring-violet-400 text-white'
                }`}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}
          </div>
        </motion.div>

        {/* Faculty Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${
              isLight ? 'border-violet-600' : 'border-violet-400'
            }`}></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((member, index) => (
              <motion.div
                key={member.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link to={`/faculty/${member.id}`}>
                  <div className={`rounded-2xl p-8 transition-all duration-300 overflow-hidden ${
                    isLight 
                      ? 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm' 
                      : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                  }`}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-6 relative">
                      {member.imageUrl ? (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/faculty/default-profile.svg';
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 ${
                          isLight 
                            ? 'bg-gradient-to-br from-violet-100 to-cyan-100' 
                            : 'bg-gradient-to-br from-violet-900/50 to-cyan-900/50'
                        }`}>
                          <span className={`text-6xl font-bold ${
                            isLight ? 'text-violet-400' : 'text-white/80'
                          }`}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-500/60 to-cyan-500/30 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors ${
                      isLight ? 'text-gray-800' : 'text-white'
                    }`}>
                      {member.name}
                    </h3>
                    
                    <p className={`mb-4 ${
                      isLight ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {member.position}
                    </p>
                    
                    <p className={`text-sm mb-6 line-clamp-2 ${
                      isLight ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <span className={isLight ? 'text-violet-700' : 'text-violet-300'}>Specialization:</span> {member.specialization}
                    </p>
                    
                    <div className="flex gap-4">
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`}
                          className={`rounded-full p-2 transition-colors ${
                            isLight
                              ? 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                              : 'text-gray-400 hover:text-violet-400 hover:bg-violet-900/20'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                          title="Email"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      )}
                      {member.phone && (
                        <a 
                          href={`tel:${member.phone}`}
                          className={`rounded-full p-2 transition-colors ${
                            isLight
                              ? 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                              : 'text-gray-400 hover:text-violet-400 hover:bg-violet-900/20'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                          title="Phone"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredFaculty.length === 0 && (
          <div className={`text-center py-12 rounded-lg ${
            isLight ? 'bg-white/50 backdrop-blur-sm' : 'bg-white/5 backdrop-blur-sm'
          }`}>
            <h3 className={`text-2xl font-semibold mb-4 ${
              isLight ? 'text-gray-800' : 'text-white'
            }`}>
              No Faculty Found
            </h3>
            <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
      
      {/* Add styles for animations */}
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Faculty; 