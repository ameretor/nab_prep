/**
 * LIVE CODING — Modal with React Portal + Accessibility
 *
 * TASK: Build a reusable Modal component that:
 *   1. Uses a React Portal (renders outside the app root)
 *   2. Closes on Escape key
 *   3. Closes on backdrop click (but NOT on modal content click)
 *   4. Is accessible (role, aria-modal, focus trap consideration)
 */

import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    // Backdrop — clicking it closes the modal
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      style={overlayStyle}
    >
      {/* Modal content — stop click from bubbling to backdrop */}
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
        style={dialogStyle}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 id="modal-title">{title}</h2>
          <button onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle = {
  background: '#fff',
  borderRadius: 8,
  padding: 24,
  minWidth: 320,
  maxWidth: '90vw',
};

/**
 * Usage:
 *
 * const [open, setOpen] = useState(false);
 * <button onClick={() => setOpen(true)}>Open Modal</button>
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 */
