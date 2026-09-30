import Modal from './Modal.ui';
import Button from './Button.ui';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  const messageStyles = {
    marginBottom: '24px',
    fontSize: '14px',
    color: '#4b5563',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={messageStyles}>{message}</div>
      <div style={buttonContainerStyles}>
        <Button onClick={onClose} variant="outline">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} variant={variant}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
