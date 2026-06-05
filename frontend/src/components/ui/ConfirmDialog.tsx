import Modal from './Modal'

interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      title="Confirmar acción"
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </>
      }
    >
      <p style={{ fontSize: '14px', color: '#374151' }}>{message}</p>
    </Modal>
  )
}
