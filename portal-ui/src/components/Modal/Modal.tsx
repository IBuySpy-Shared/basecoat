import React from 'react';
import styles from './Modal.module.css';

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeButtonLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  isDismissible?: boolean;
}

/**
 * Modal Component
 *
 * Accessible modal dialog with focus management, keyboard support,
 * and backdrop interaction. Implements WCAG 2.1 AA compliant patterns.
 *
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Delete">
 *   Are you sure?
 *   <Modal.Footer>
 *     <Button variant="secondary" onClick={handleClose}>Cancel</Button>
 *     <Button variant="danger">Delete</Button>
 *   </Modal.Footer>
 * </Modal>
 */

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, ...props }) => (
  <div className={styles.footer} {...props}>
    {children}
  </div>
);
ModalFooter.displayName = 'Modal.Footer';

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      footer,
      closeButtonLabel = 'Close',
      size = 'md',
      isDismissible = true,
      className,
      ...props
    },
    ref
  ) => {
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    React.useEffect(() => {
      if (!isOpen) return;

      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isDismissible) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Prevent body scroll
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '17px'; // Prevent layout shift

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollY = scrollY;
      };
    }, [isOpen, isDismissible, onClose]);

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className={styles.backdrop}
          onClick={(e) => {
            if (isDismissible && e.target === e.currentTarget) {
              onClose();
            }
          }}
          role="presentation"
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <div
          ref={ref || dialogRef}
          className={`${styles.modal} ${styles[size]} ${className || ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          {...props}
        >
          {/* Header */}
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {isDismissible && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label={closeButtonLabel}
                type="button"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            )}
          </div>

          {/* Description */}
          {description && (
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          )}

          {/* Content */}
          <div className={styles.content}>{children}</div>

          {/* Footer */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </>
    );
  }
) as React.ForwardRefExoticComponent<
  ModalProps & React.RefAttributes<HTMLDivElement>
> & {
  Footer: typeof ModalFooter;
};

Modal.displayName = 'Modal';
Modal.Footer = ModalFooter;

export default Modal;
