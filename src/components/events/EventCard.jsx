import React from 'react';
import { DraggableCardContainer, DraggableCardBody } from '../ui/draggable-card';

const EventCard = ({ event, onSelect, index, isDraggable = false }) => {
  const getCardStyle = () => {
    if (!isDraggable) return {};
    
    const positions = [
      { top: '10%', left: '20%', rotate: -5 },
      { top: '40%', left: '25%', rotate: -7 },
      { top: '5%', left: '40%', rotate: 8 },
      { top: '32%', left: '55%', rotate: 10 },
      { top: '20%', right: '35%', rotate: 2 },
      { top: '24%', left: '45%', rotate: -7 },
      { top: '8%', left: '30%', rotate: 4 },
    ];

    const position = positions[index % positions.length] || { top: '20%', left: '40%', rotate: 0 };

    return {
      className: `absolute ${position.top} ${
        position.left ? `left-[${position.left}]` : ''
      } ${
        position.right ? `right-[${position.right}]` : ''
      } rotate-[${position.rotate}deg]`
    };
  };

  const cardContent = (
    <div className="relative h-full w-full">
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
        {(event.image || event.imageBase64) ? (
          <img
            src={event.image || event.imageBase64}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-600 dark:text-violet-400">
            {event.eventType}
          </span>
          {event.date && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {new Date(event.date).toLocaleDateString()}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
          {event.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {event.description}
        </p>
      </div>
    </div>
  );

  if (isDraggable) {
    const style = getCardStyle();
    return (
      <DraggableCardBody className={style.className}>
        {cardContent}
      </DraggableCardBody>
    );
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 cursor-pointer"
      onClick={() => onSelect(event)}
    >
      {cardContent}
    </div>
  );
};

export default EventCard; 