import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { tramitesApi } from '../../services/api'
import { TramiteCatastral } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const TIPOS = ['Actualización Catastral', 'Incorporación', 'Englobe', 'Desenglobe',
  'Identificación', 'Legalización', 'Corrección', 'Cancelación', 'Otro']
const ESTADOS = ['Activo', 'Cerrado', 'Anulado']

const EMPTY = { predio_id: 0, tipo_tramite: 'Actualización Catastral', numero_tramite: '', fecha_tramite: '', fecha_inscripcion: '', descripcion: '', estado_tramite: 'Activo' }

export default function TramitesPage() {
  const [items, setItems] = useState<TramiteCatastral[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filterPredio, setFilterPredio] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TramiteCatastral | null>(null)
  const [deleting, setDeleting] = useState<TramiteCatastral | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tramitesApi.list({ page, size: 15, predio_id: filterPredio || undefined })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page, filterPredio])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.predio_id || form.predio_id <= 0) errs.predio_id = 'ID de predio requerido (número positivo)'
    if (!form.tipo_tramite) errs.tipo_tramite = 'Requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        await tramitesApi.update(editing.t_id, form)
        toast.success('Trámite actualizado')
      } else {
        await tramitesApi.create(form)
        toast.success('Trámite creado')
      }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await tramitesApi.delete(deleting.t_id); toast.success('Trámite eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Unidad Administrativa</div>
        <h2>Trámites Catastrales (CR_TramiteCatastral)</h2>
        <p>Registro de trámites y mutaciones catastrales asociados a predios</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="toolbar">
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input placeholder="Filtrar por ID de predio..." value={filterPredio}
                onChange={(e) => { setFilterPredio(e.target.value); setPage(1) }} type="number" min="0" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setErrors({}); setShowForm(true) }}>+ Nuevo Trámite</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">📋</div><p>Sin trámites registrados</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Predio</th><th>Tipo Trámite</th><th>N° Trámite</th><th>Fecha Trámite</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.t_id}>
                      <td>{t.t_id}</td><td><span className="badge badge-blue">{t.predio_id}</span></td>
                      <td>{t.tipo_tramite}</td><td>{t.numero_tramite || '—'}</td>
                      <td>{t.fecha_tramite || '—'}</td>
                      <td><span className={`badge ${t.estado_tramite === 'Activo' ? 'badge-green' : t.estado_tramite === 'Cerrado' ? 'badge-gray' : 'badge-red'}`}>{t.estado_tramite}</span></td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(t); setForm({ ...t }); setErrors({}); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(t)}>🗑</button>
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
        <Modal title={editing ? `Editar Trámite #${editing.t_id}` : 'Nuevo Trámite'} onClose={() => setShowForm(false)} size="md"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>ID Predio <span className="required">*</span></label>
              <input type="number" min="1" value={form.predio_id || ''} onChange={(e) => setForm((p: any) => ({ ...p, predio_id: Number(e.target.value) }))} className={errors.predio_id ? 'error' : ''} />
              {errors.predio_id && <span className="field-error">{errors.predio_id}</span>}
            </div>
            <div className="form-group">
              <label>Tipo Trámite <span className="required">*</span></label>
              <select value={form.tipo_tramite} onChange={(e) => setForm((p: any) => ({ ...p, tipo_tramite: e.target.value }))}>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>N° Trámite</label><input value={form.numero_tramite} onChange={(e) => setForm((p: any) => ({ ...p, numero_tramite: e.target.value }))} /></div>
            <div className="form-group"><label>Fecha Trámite</label><input type="date" value={form.fecha_tramite} onChange={(e) => setForm((p: any) => ({ ...p, fecha_tramite: e.target.value }))} /></div>
            <div className="form-group"><label>Fecha Inscripción</label><input type="date" value={form.fecha_inscripcion} onChange={(e) => setForm((p: any) => ({ ...p, fecha_inscripcion: e.target.value }))} /></div>
            <div className="form-group">
              <label>Estado</label>
              <select value={form.estado_tramite} onChange={(e) => setForm((p: any) => ({ ...p, estado_tramite: e.target.value }))}>
                {ESTADOS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group full-width"><label>Descripción</label><textarea value={form.descripcion} onChange={(e) => setForm((p: any) => ({ ...p, descripcion: e.target.value }))} /></div>
          </div>
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar trámite #${deleting.t_id}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
