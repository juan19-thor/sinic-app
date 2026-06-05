import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { agrupacionesApi } from '../../services/api'
import { AgrupacionInteresados } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const TIPOS = ['Grupo', 'Sociedad_Conyugal', 'Herencia']
const EMPTY = { nombre_agrupacion: '', tipo_agrupacion: 'Grupo', descripcion: '' }

export default function AgrupacionesPage() {
  const [items, setItems] = useState<AgrupacionInteresados[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AgrupacionInteresados | null>(null)
  const [deleting, setDeleting] = useState<AgrupacionInteresados | null>(null)
  const [viewing, setViewing] = useState<AgrupacionInteresados | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await agrupacionesApi.list({ page, size: 15 })
      setItems(res.data.items); setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.nombre_agrupacion) errs.nombre_agrupacion = 'El nombre es requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) { await agrupacionesApi.update(editing.t_id, form); toast.success('Agrupación actualizada') }
      else { await agrupacionesApi.create(form); toast.success('Agrupación creada') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await agrupacionesApi.delete(deleting.t_id); toast.success('Eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Interesados</div>
        <h2>Agrupaciones de Interesados (CR_AgrupacionInteresados)</h2>
        <p>Grupos, sociedades conyugales y herencias con múltiples interesados</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">👨‍👩‍👦 Agrupaciones</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setErrors({}); setShowForm(true) }}>+ Nueva Agrupación</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">👨‍👩‍👦</div><p>Sin agrupaciones registradas</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Nombre Agrupación</th><th>Tipo</th><th>Descripción</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a.t_id}>
                      <td>{a.t_id}</td>
                      <td><strong>{a.nombre_agrupacion}</strong></td>
                      <td><span className="badge badge-yellow">{a.tipo_agrupacion || '—'}</span></td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.descripcion || '—'}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(a)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(a); setForm({ ...a }); setErrors({}); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(a)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={page} total={total} size={15} onPage={setPage} />
            </div>
          )}
      </div>

      {showForm && (
        <Modal title={editing ? `Editar Agrupación #${editing.t_id}` : 'Nueva Agrupación'} onClose={() => setShowForm(false)} size="md"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nombre Agrupación <span className="required">*</span></label>
              <input value={form.nombre_agrupacion} onChange={(e) => setForm((p: any) => ({ ...p, nombre_agrupacion: e.target.value }))} className={errors.nombre_agrupacion ? 'error' : ''} />
              {errors.nombre_agrupacion && <span className="field-error">{errors.nombre_agrupacion}</span>}
            </div>
            <div className="form-group">
              <label>Tipo Agrupación</label>
              <select value={form.tipo_agrupacion || 'Grupo'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_agrupacion: e.target.value }))}>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group full-width"><label>Descripción</label><textarea value={form.descripcion || ''} onChange={(e) => setForm((p: any) => ({ ...p, descripcion: e.target.value }))} /></div>
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`Agrupación #${viewing.t_id}`} onClose={() => setViewing(null)} size="md"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[['Nombre', viewing.nombre_agrupacion], ['Tipo', viewing.tipo_agrupacion || '—'],
              ['Descripción', viewing.descripcion || '—'],
              ['Creado', new Date(viewing.created_at).toLocaleString('es-CO')]].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar agrupación "${deleting.nombre_agrupacion}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
