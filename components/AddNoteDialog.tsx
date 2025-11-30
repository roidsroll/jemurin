import React, { useState } from 'react';
import { Loader2, Send, X, Image as ImageIcon, Trash2 } from 'lucide-react';

interface AddNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, image?: string) => Promise<void>;
  initialText?: string;
  initialImage?: string;
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ isOpen, onClose, onSubmit, initialText, initialImage }) => {
  const [text, setText] = useState(initialText || '');
  const [image, setImage] = useState<string | undefined>(initialImage);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isEditing = initialText !== undefined;

  // Reset text when dialog opens/closes or initialText changes
  React.useEffect(() => {
    if (isOpen) {
      setText(initialText || '');
      setImage(initialImage);
    }
  }, [isOpen, initialText, initialImage]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    setIsSubmitting(true);
    await onSubmit(text, image);
    setText('');
    setImage(undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={20} />
        </button>

        <div className="bg-red-50 p-6 pb-4 border-b border-red-100 text-center">
          <h2 className="text-2xl font-display font-bold text-red-800">
            {isEditing ? 'Sunting Kenangan' : 'Arsip Kita'}
          </h2>
          <p className="text-xs text-red-600/70 mt-1 font-sans">
            {isEditing ? 'Perbaiki ceritamu di sini.' : 'Gantungkan ceritamu di sini.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 p-4 text-lg font-hand bg-yellow-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:outline-none resize-none placeholder-gray-400 text-gray-800 leading-relaxed"
              placeholder="Hari ini aku merasa..."
              maxLength={250}
              autoFocus
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-sans bg-white/80 px-1 rounded">
              {text.length}/250
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              accept="image/*"
              className="hidden"
            />

            {image ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 group/image">
                <img src={image} alt="Preview" className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-all duration-200 border border-red-100 group"
              >
                <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
                <span>Tambahkan Foto</span>
              </button>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? 'Menyimpan...' : 'Menjemur...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {isEditing ? 'Simpan Perubahan' : 'Gantung Cerita'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteDialog;