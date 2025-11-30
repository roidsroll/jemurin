import React from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
                >
                    <X size={20} />
                </button>

                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <Trash2 size={32} />
                    </div>

                    <h2 className="text-xl font-display font-bold text-gray-800 mb-2">
                        Hapus Kenangan?
                    </h2>
                    <p className="text-sm text-gray-600 font-sans mb-6">
                        Apakah Anda yakin ingin menghapus kenangan ini? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm shadow-md"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmDialog;
