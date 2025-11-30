import React, { useState } from 'react';
import { Note } from '../types';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';

interface HangingNoteProps {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (id: string, skipConfirm?: boolean) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onViewImage: (imageUrl: string) => void;
}

const HangingNote: React.FC<HangingNoteProps> = ({ note, index, onEdit, onDelete, onDragStart, onDragEnd, onViewImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useDragControls();

  // Random slight rotation for realism
  const rotation = note.rotation || (Math.random() * 6 - 3);

  return (
    <Reorder.Item
      value={note}
      id={note.id}
      drag
      dragControls={controls}
      dragSnapToOrigin
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
      onDragStart={() => {
        setIsDragging(true);
        onDragStart();
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        onDragEnd();

        // Check if dropped in trash zone (bottom center)
        const trashZoneY = window.innerHeight - 150;
        const centerX = window.innerWidth / 2;
        const thresholdX = 100; // Width of drop zone radius

        if (info.point.y > trashZoneY && Math.abs(info.point.x - centerX) < thresholdX) {
          // Skip confirmation for drag-and-drop delete
          onDelete(note.id, true);
        }
      }}
      className="relative flex flex-col items-center group cursor-grab active:cursor-grabbing"
      style={{
        zIndex: isDragging ? 100 : 10,
        height: 'auto'
      }}
    >
      {/* Sway Wrapper - Separated from Layout/Drag */}
      <div className={`${!isDragging ? `sway-${note.swaySpeed}` : ''} flex flex-col items-center`}>

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
          className="relative bg-white p-3 shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:z-50 flex flex-col items-center group/card"
          style={{
            width: '140px',
            minHeight: '170px',
            transform: isDragging ? 'none' : `rotate(${rotation}deg)`,
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Action Buttons - Visible on Hover */}
          <div className={`absolute -right-8 top-0 flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 ${isDragging ? 'hidden' : ''}`}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(note); }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-500 transition-colors"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            {note.image && (
              <button
                onClick={(e) => { e.stopPropagation(); onViewImage(note.image!); }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-green-50 text-green-500 transition-colors"
                title="Lihat Foto"
              >
                <Eye size={14} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
              title="Hapus"
            >
              <Trash2 size={14} />
            </button>
          </div>

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
    </Reorder.Item>
  );
};

export default HangingNote;