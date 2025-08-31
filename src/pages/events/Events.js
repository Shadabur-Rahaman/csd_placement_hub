import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { DraggableCardContainer } from '../../components/ui/draggable-card';
import EventCard from '../../components/events/EventCard';
import DetailModal from '../../components/events/DetailModal';

const Events = () => {
  const { type } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(type?.toUpperCase() || 'ALL');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  useEffect(() => {
    if (type) {
      setActiveTab(type.toUpperCase());
    }
  }, [type]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let eventsQuery;
      
      if (activeTab === 'ALL') {
        eventsQuery = collection(db, 'events');
      } else {
        eventsQuery = query(
          collection(db, 'events'),
          where('eventType', '==', activeTab)
        );
      }
      
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      eventsData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'HACKATHON', label: 'Hackathons' },
    { id: 'TECHNICAL', label: 'Technical' },
    { id: 'SEMINAR', label: 'Seminars' },
    { id: 'SPORTS', label: 'Sports' },
    { id: 'CLUB', label: 'Clubs' },
    { id: 'INDUSTRIAL', label: 'Industrial Visits' },
  ];

  const renderEvents = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isLight ? 'border-violet-600' : 'border-violet-400'
          }`}></div>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-12">
          <p className={isLight ? 'text-gray-500' : 'text-gray-400'}>
            No events found for {activeTab === 'ALL' ? 'any category' : activeTab}.
          </p>
        </div>
      );
    }

    if (activeTab === 'ALL') {
      return (
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
          <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
            Explore our upcoming events
          </p>
          {events.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index}
              isDraggable={true}
              onSelect={(event) => {
                setSelectedEvent(event);
                setIsModalOpen(true);
              }}
            />
          ))}
        </DraggableCardContainer>
      );
    }

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            isDraggable={false}
            onSelect={(event) => {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${isLight 
      ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100' 
      : 'bg-[#030014] bg-grid-pattern'} overflow-x-hidden`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${
            isLight 
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-transparent bg-clip-text' 
              : 'bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text'
          }`}>
            Events
          </h1>
          <p className={`text-lg sm:text-xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Stay updated with the latest happenings in our department
          </p>
        </motion.div>

        {/* Event Type Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8 sm:mb-12 overflow-x-auto"
        >
          <nav className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 backdrop-blur-lg rounded-lg" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? isLight
                      ? 'bg-violet-100 text-violet-800 shadow-lg'
                      : 'bg-white/10 text-white shadow-lg'
                    : isLight
                      ? 'text-gray-600 hover:text-violet-800 hover:bg-violet-50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {renderEvents()}
      </div>

      {/* Modal */}
      <DetailModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLight={isLight}
      />

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

export default Events; 