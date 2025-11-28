import React from 'react';
import { Note } from '../types';

interface HangingNoteProps {
  note: Note;
  index: number;
}

const HangingNote: React.FC<HangingNoteProps> = ({ note, index }) => {
  // Random slight rotation for realism
  const rotation = note.rotation || (Math.random() * 6 - 3);

  return (
    <div 
      className={`absolute top-0 flex flex-col items-center group cursor-pointer sway-${note.swaySpeed}`}
      style={{ 
        left: `${index * 160 + 40}px`, // Adjusted spacing for mobile
        zIndex: 10,
        height: 'auto' // Let content define height
      }}
    >
      {/* Wooden Peg / Jepitan */}
      <div className="absolute -top-4 z-30 flex flex-col items-center w-full pointer-events-none">
         {/* The clip grip */}
         <div className="w-2 h-3 bg-amber-900 rounded-sm"></div>
         {/* The main clip body */}
         <div className="w-4 h-10 bg-amber-700 rounded-sm shadow-md border-b-2 border-amber-900 flex flex-col items-center justify-end pb-1">
            <div className="w-3 h-4 bg-amber-800/50 rounded-sm"></div>
         </div>
      </div>
      
      {/* The Thread Connection point (Invisible, just for alignment) */}
      <div className="h-4 w-1"></div>

      {/* The Photo Frame (Polaroid Style) */}
      <div 
        className="relative bg-white p-3 shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:z-50 flex flex-col items-center"
        style={{ 
          width: '140px',
          minHeight: '170px',
          transform: `rotate(${rotation}deg)`,
          border: '1px solid #e5e7eb',
        }}
      >
        {/* The "Image" Area - Colored by sentiment */}
        <div 
          className="w-full h-32 mb-3 flex items-center justify-center p-2 text-center overflow-hidden relative"
          style={{ 
            backgroundColor: note.color,
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05)'
          }}
        >
           {/* Texture overlay */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
           
           <p className="font-hand text-gray-800 text-sm leading-tight break-words relative z-10 line-clamp-5">
            "{note.text}"
          </p>
        </div>

        {/* The Caption Area (Bottom of Polaroid) */}
        <div className="w-full px-1">
          <div className="flex justify-between items-end border-t border-gray-100 pt-2">
            <span className="text-[10px] text-gray-400 font-sans tracking-wider">
              {new Date(note.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[10px] text-gray-400 font-sans">
              {new Date(note.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {note.sentiment && (
            <div className="mt-1 text-center">
               <span className="text-[10px] font-script text-gray-500 opacity-60">
                 #{note.sentiment}
               </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HangingNote;