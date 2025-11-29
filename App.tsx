import React, { useState, useEffect, useRef } from 'react';
import { Plus, CloudSun, MoonStar, Info, Trash2 } from 'lucide-react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import HangingNote from './components/HangingNote';
import AddNoteDialog from './components/AddNoteDialog';
import { Note } from './types';
import * as db from './services/db';
import * as gemini from './services/gemini';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load notes on mount
  useEffect(() => {
    const init = async () => {
      try {
        const savedNotes = await db.getAllNotes();
        // Strictly only load saved notes, NO dummy data generation
        setNotes(savedNotes);
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSaveNote = async (text: string) => {
    // 1. Analyze sentiment via Gemini
    const analysis = await gemini.analyzeSentiment(text);

    if (editingNote) {
      // Update existing note
      const updatedNote: Note = {
        ...editingNote,
        text,
        sentiment: analysis.sentiment,
        color: analysis.colorHex,
      };

      await db.saveNote(updatedNote);
      setNotes(prev => prev.map(n => n.id === editingNote.id ? updatedNote : n));
      setEditingNote(null);
    } else {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        text,
        timestamp: Date.now(),
        author: 'user',
        sentiment: analysis.sentiment,
        color: analysis.colorHex,
        rotation: (Math.random() * 6) - 3,
        swaySpeed: ['slow', 'medium', 'fast'][Math.floor(Math.random() * 3)] as any
      };

      // 2. Save to DB
      await db.saveNote(newNote);

      // 3. Update State (prepend to list)
      setNotes(prev => [newNote, ...prev]);

      // 4. Scroll to start to see new note
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  const handleDeleteNote = async (id: string, skipConfirm?: boolean) => {
    // If dragging, we skip confirm as per user request
    if (skipConfirm || window.confirm('Apakah Anda yakin ingin menghapus kenangan ini?')) {
      try {
        await db.deleteNote(id);
        setNotes(prev => prev.filter(n => n.id !== id));
      } catch (err) {
        console.error("Failed to delete note", err);
      }
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  // Calculate total width based on number of notes to ensure line stretches
  // Mobile adjustment: narrower spacing
  const spacing = 160;
  const containerWidth = Math.max(window.innerWidth, (notes.length * spacing) + 200);

  // Background Styles
  const bgGradient = theme === 'day'
    ? 'bg-gradient-to-br from-slate-100 via-red-50 to-orange-50'
    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-black';

  // Explicit "Benang Merah" (Red Thread) color
  const threadColor = '#dc2626'; // red-600

  return (
    <div className={`h-screen w-screen flex flex-col relative overflow-hidden transition-colors duration-1000 ${bgGradient}`}>

      {/* Header / HUD */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className={`text-2xl md:text-4xl font-display font-bold ${theme === 'day' ? 'text-red-800' : 'text-red-400'} drop-shadow-sm`}>
            Arsip Kita
          </h1>
          <p className={`text-xs md:text-sm ${theme === 'day' ? 'text-gray-600' : 'text-gray-400'} font-sans mt-1 max-w-[200px] md:max-w-none`}>
            Semua perasaanmu, abadi di sini.
          </p>
        </div>

        <div className="flex gap-2 md:gap-4 pointer-events-auto">
          <button
            onClick={() => setTheme(prev => prev === 'day' ? 'night' : 'day')}
            className={`p-2 md:p-3 rounded-full backdrop-blur-md shadow-md transition-all active:scale-95 ${theme === 'day' ? 'bg-white/60 text-orange-600' : 'bg-white/10 text-yellow-300'}`}
            aria-label="Toggle theme"
          >
            {theme === 'day' ? <CloudSun size={20} /> : <MoonStar size={20} />}
          </button>
          <button
            onClick={() => {
              setEditingNote(null);
              setIsDialogOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white p-2 md:px-5 md:py-3 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden md:inline font-semibold text-sm">Arsipkan Rasa</span>
          </button>
        </div>
      </div>

      {/* Trash Zone */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-6 bg-red-100/80 backdrop-blur-md rounded-full border-2 border-red-400 text-red-600 shadow-2xl flex flex-col items-center gap-2"
          >
            <Trash2 size={48} />
            <span className="font-hand font-bold text-lg">Drop untuk Hapus</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="h-full relative min-w-max" style={{ width: `${containerWidth}px` }}>

          {/* The Red Thread (Benang Merah) */}
          {/* We position it lower on screen to clear header on mobile */}
          <svg className="absolute top-28 md:top-32 left-0 w-full h-[100px] z-0 pointer-events-none overflow-visible">
            {/* Main thread with slight sag */}
            <path
              d={`M 0 10 Q ${containerWidth / 2} 40 ${containerWidth} 10`}
              fill="none"
              stroke={threadColor}
              strokeWidth="2"
              className="drop-shadow-sm opacity-80"
            />
          </svg>

          {/* Hanging Notes Container - Reorder Group */}
          <Reorder.Group
            as="ul"
            axis="x"
            values={notes}
            onReorder={setNotes}
            className="absolute top-28 md:top-32 left-0 w-full h-full pt-2 flex items-start pl-10 gap-5"
          >
            {loading ? (
              <div className="absolute left-1/2 -translate-x-1/2 top-20 text-red-400 font-hand text-xl animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                Memuat arsip...
              </div>
            ) : (
              notes.map((note, index) => (
                <HangingNote
                  key={note.id}
                  note={note}
                  index={index}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                />
              ))
            )}

            {/* Empty State */}
            {!loading && notes.length === 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-20 text-center px-6">
                <div className="w-1 h-20 border-l-2 border-dashed border-red-200 mx-auto mb-4"></div>
                <p className="font-hand text-xl text-gray-400 mb-2">Benang merah ini masih kosong.</p>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="text-red-500 font-semibold text-sm hover:underline"
                >
                  Mulai gantungkan kenanganmu
                </button>
              </div>
            )}
          </Reorder.Group>

          <AddNoteDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingNote(null);
            }}
            onSubmit={handleSaveNote}
            initialText={editingNote?.text}
          />
        </div>
      </div>
    </div>
  );
};

export default App;