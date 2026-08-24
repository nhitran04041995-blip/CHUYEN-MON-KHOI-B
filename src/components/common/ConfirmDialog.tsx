import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  isDangerous = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            isDangerous ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/60 pt-4">
        <button
          id="btn-confirm-dialog-cancel"
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white shadow-xs transition-all"
        >
          {cancelText}
        </button>
        <button
          id="btn-confirm-dialog-submit"
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-sm active:scale-95 transition-all ${
            isDangerous ? 'bg-rose-600 shadow-rose-300/40 hover:bg-rose-700' : 'bg-blue-600 shadow-blue-300/40 hover:bg-blue-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
