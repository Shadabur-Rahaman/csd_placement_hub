import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentCard = ({ student }) => {
  if (!student) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center">
          {student.imageBase64 ? (
            <img
              src={student.imageBase64}
              alt={`${student.name}`}
              className="w-24 h-24 rounded-full object-cover mr-4 mb-4 md:mb-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mr-4 mb-4 md:mb-0">
              <span className="text-2xl text-gray-600">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </span>
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
            <p className="text-gray-600">{student.batch}</p>
            
            {student.email && (
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {student.email}
              </p>
            )}
          </div>
        </div>
        
        {student.interests && student.interests.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Interests</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {student.achievements && student.achievements.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Achievements</h4>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {student.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Link
            to={`/students/${student.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard; 