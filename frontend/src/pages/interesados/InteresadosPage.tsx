import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { interesadosApi } from '../../services/api'
import { Interesado } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const TIPOS_INT = ['Persona_Natural', 'Persona_Juridica']
const TIPOS_DOC = ['CC', 'CE', 'NIT', 'PA', 'RC', 'TI', 'NUIP', 'Secuencial']

const EMPTY = { tipo_interesado: 'Persona_Natural', tipo_documento: 'CC', numero_documento: '', primer_nombre: '', segundo_nombre: '', primer_apellido: '', segundo_apellido: '', razon_social: '', correo: '', telefono: '', direccion_notificacion: '' }

export default function InteresadosPage() {
  const [items, setItems] = useState<Interesado[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Interesado | null>(null)
  const [viewing, setViewing] = useState<Interesado | null>(null)
  const [deleting, setDeleting] = useState<Interesado | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await interesadosApi.list({ page, size: 15, search: search || undefined, tipo: filterTipo || undefined })
      setItems(res.data.items); setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page, search, filterTipo])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.tipo_interesado) errs.tipo_interesado = 'Requerido'
    if (form.tipo_interesado === 'Persona_Natural') {
      if (!form.primer_nombre) errs.primer_nombre = 'Requerido para Persona Natural'
      if (!form.primer_apellido) errs.primer_apellido = 'Requerido para Persona Natural'
    }
    if (form.tipo_interesado === 'Persona_Juridica' && !form.razon_social)
      errs.razon_social = 'Requerido para Persona Jurídica'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form }
      if (form.tipo_interesado === 'Persona_Juridica') { payload.primer_nombre = undefined; payload.primer_apellido = undefined }
      if (form.tipo_interesado === 'Persona_Natural') { payload.razon_social = undefined }
      if (editing) { await interesadosApi.update(editing.t_id, payload); toast.success('Interesado actualizado') }
      else { await interesadosApi.create(payload); toast.success('Interesado creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await interesadosApi.delete(deleting.t_id); toast.success('Interesado eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  const nombre = (i: Interesado) => i.tipo_interesado === 'Persona_Juridica' ? i.razon_social || '—'
    : [i.primer_nombre, i.segundo_nombre, i.primer_apellido, i.segundo_apellido].filter(Boolean).join(' ') || '—'

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Interesados</div>
        <h2>Interesados (CR_Interesado)</h2>
        <p>Personas naturales, jurídicas y agrupaciones vinculadas a predios</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="toolbar">
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input placeholder="Buscar por nombre, documento, razón social..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <select value={filterTipo} onChange={(e) => { setFilterTipo(e.target.value); setPage(1) }} style={{ padding: '8px 10px', borderRadius: 6, border: '1.5px solid var(--border)' }}>
              <option value="">Todos los tipos</option>
              {TIPOS_INT.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setErrors({}); setShowForm(true) }}>+ Nuevo Interesado</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">👥</div><p>Sin interesados registrados</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Tipo</th><th>Nombre / Razón Social</th><th>Documento</th><th>Correo</th><th>Teléfono</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.t_id}>
                      <td>{i.t_id}</td>
                      <td><span className={`badge ${i.tipo_interesado === 'Persona_Natural' ? 'badge-blue' : 'badge-yellow'}`}>{i.tipo_interesado === 'Persona_Natural' ? 'Natural' : 'Jurídica'}</span></td>
                      <td>{nombre(i)}</td>
                      <td>{i.tipo_documento && i.numero_documento ? `${i.tipo_documento}: ${i.numero_documento}` : '—'}</td>
                      <td>{i.correo || '—'}</td>
                      <td>{i.telefono || '—'}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(i)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(i); setForm({ ...i }); setErrors({}); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(i)}>🗑</button>
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
        <Modal title={editing ? `Editar Interesado #${editing.t_id}` : 'Nuevo Interesado'} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo Interesado <span className="required">*</span></label>
              <select value={form.tipo_interesado} onChange={(e) => setForm((p: any) => ({ ...p, tipo_interesado: e.target.value }))}>
                {TIPOS_INT.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Tipo Documento</label><select value={form.tipo_documento || 'CC'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_documento: e.target.value }))}>{TIPOS_DOC.map((d) => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label>Número Documento</label><input value={form.numero_documento || ''} onChange={(e) => setForm((p: any) => ({ ...p, numero_documento: e.target.value }))} /></div>

            {form.tipo_interesado === 'Persona_Natural' ? (
              <>
                <div className="form-group">
                  <label>Primer Nombre <span className="required">*</span></label>
                  <input value={form.primer_nombre || ''} onChange={(e) => setForm((p: any) => ({ ...p, primer_nombre: e.target.value }))} className={errors.primer_nombre ? 'error' : ''} />
                  {errors.primer_nombre && <span className="field-error">{errors.primer_nombre}</span>}
                </div>
                <div className="form-group"><label>Segundo Nombre</label><input value={form.segundo_nombre || ''} onChange={(e) => setForm((p: any) => ({ ...p, segundo_nombre: e.target.value }))} /></div>
                <div className="form-group">
                  <label>Primer Apellido <span className="required">*</span></label>
                  <input value={form.primer_apellido || ''} onChange={(e) => setForm((p: any) => ({ ...p, primer_apellido: e.target.value }))} className={errors.primer_apellido ? 'error' : ''} />
                  {errors.primer_apellido && <span className="field-error">{errors.primer_apellido}</span>}
                </div>
                <div className="form-group"><label>Segundo Apellido</label><input value={form.segundo_apellido || ''} onChange={(e) => setForm((p: any) => ({ ...p, segundo_apellido: e.target.value }))} /></div>
              </>
            ) : (
              <div className="form-group full-width">
                <label>Razón Social <span className="required">*</span></label>
                <input value={form.razon_social || ''} onChange={(e) => setForm((p: any) => ({ ...p, razon_social: e.target.value }))} className={errors.razon_social ? 'error' : ''} />
                {errors.razon_social && <span className="field-error">{errors.razon_social}</span>}
              </div>
            )}
            <div className="form-group"><label>Correo</label><input type="email" value={form.correo || ''} onChange={(e) => setForm((p: any) => ({ ...p, correo: e.target.value }))} /></div>
            <div className="form-group"><label>Teléfono</label><input value={form.telefono || ''} onChange={(e) => setForm((p: any) => ({ ...p, telefono: e.target.value }))} /></div>
            <div className="form-group full-width"><label>Dirección de Notificación</label><input value={form.direccion_notificacion || ''} onChange={(e) => setForm((p: any) => ({ ...p, direccion_notificacion: e.target.value }))} /></div>
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`Interesado #${viewing.t_id}`} onClose={() => setViewing(null)} size="md"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[['Tipo', viewing.tipo_interesado], ['Nombre/Razón', nombre(viewing)],
              ['Documento', `${viewing.tipo_documento || ''} ${viewing.numero_documento || ''}`.trim() || '—'],
              ['Correo', viewing.correo || '—'], ['Teléfono', viewing.telefono || '—'],
              ['Dirección', viewing.direccion_notificacion || '—'],
              ['Creado', new Date(viewing.created_at).toLocaleString('es-CO')]].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar interesado #${deleting.t_id} (${nombre(deleting)})?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
