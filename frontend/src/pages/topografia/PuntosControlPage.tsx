import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { puntosControlApi } from '../../services/api'
import { PuntoControl } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const MapEditor = lazy(() => import('../../components/MapEditor'))
const TIPOS = ['Control', 'Catastro.Mojon', 'Catastro.Pilastra', 'Catastro.Incrustacion']
const EMPTY = { codigo: '', tipo_punto_control: 'Control', descripcion: '', exactitud_horizontal: undefined, geom: null }

export default function PuntosControlPage() {
  const [items, setItems] = useState<PuntoControl[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PuntoControl | null>(null)
  const [viewing, setViewing] = useState<PuntoControl | null>(null)
  const [deleting, setDeleting] = useState<PuntoControl | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [geojsonText, setGeojsonText] = useState('')
  const [showGeojson, setShowGeojson] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await puntosControlApi.list({ page, size: 15, search: search || undefined })
      setItems(res.data.items); setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.codigo) errs.codigo = 'El código es requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    if (showGeojson && geojsonText) {
      try { setForm((p: any) => ({ ...p, geom: JSON.parse(geojsonText) })) } catch { toast.error('GeoJSON inválido'); return }
    }
    setSaving(true)
    try {
      if (editing) { await puntosControlApi.update(editing.t_id, form); toast.success('Actualizado') }
      else { await puntosControlApi.create(form); toast.success('Creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await puntosControlApi.delete(deleting.t_id); toast.success('Eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Topografía y Representación</div>
        <h2>Puntos de Control (CR_PuntoControl)</h2>
        <p>Puntos topográficos o geodésicos de amarre para el levantamiento catastral</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input placeholder="Buscar por código..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setErrors({}); setGeojsonText(''); setShowGeojson(false); setShowForm(true) }}>+ Nuevo Punto Control</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">🎯</div><p>Sin puntos de control</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Código</th><th>Tipo</th><th>Descripción</th><th>Exactitud H</th><th>Geom</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((pc) => (
                    <tr key={pc.t_id}>
                      <td>{pc.t_id}</td>
                      <td><strong style={{ fontFamily: 'monospace' }}>{pc.codigo}</strong></td>
                      <td><span className="badge badge-yellow">{pc.tipo_punto_control || '—'}</span></td>
                      <td>{pc.descripcion || '—'}</td>
                      <td>{pc.exactitud_horizontal ? `±${pc.exactitud_horizontal} m` : '—'}</td>
                      <td>{pc.geom ? <span className="badge badge-green">✓</span> : <span className="badge badge-gray">—</span>}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(pc)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(pc); setForm({ ...pc }); setGeojsonText(pc.geom ? JSON.stringify(pc.geom, null, 2) : ''); setShowGeojson(false); setErrors({}); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(pc)}>🗑</button>
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
        <Modal title={editing ? `Editar PC #${editing.t_id}` : 'Nuevo Punto de Control'} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Código <span className="required">*</span></label>
              <input value={form.codigo || ''} onChange={(e) => setForm((p: any) => ({ ...p, codigo: e.target.value }))} className={errors.codigo ? 'error' : ''} placeholder="ej: PC-BOG-001" />
              {errors.codigo && <span className="field-error">{errors.codigo}</span>}
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select value={form.tipo_punto_control || 'Control'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_punto_control: e.target.value }))}>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Exactitud Horizontal (m)</label><input type="number" step="0.001" value={form.exactitud_horizontal ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, exactitud_horizontal: e.target.value ? Number(e.target.value) : undefined }))} /></div>
            <div className="form-group full-width"><label>Descripción</label><textarea value={form.descripcion || ''} onChange={(e) => setForm((p: any) => ({ ...p, descripcion: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Geometría (Point, EPSG:4326)</strong>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGeojson(!showGeojson)}>{showGeojson ? 'Usar Mapa' : 'GeoJSON'}</button>
            </div>
            {showGeojson ? (
              <textarea className="geojson-textarea" rows={3} value={geojsonText} onChange={(e) => setGeojsonText(e.target.value)} placeholder='{"type":"Point","coordinates":[-74.08, 4.61]}' style={{ width: '100%', padding: 8, border: '1.5px solid var(--border)', borderRadius: 6 }} />
            ) : (
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={form.geom} onChange={(g) => setForm((p: any) => ({ ...p, geom: g }))} geometryType="point" height={300} />
              </Suspense>
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`Punto Control: ${viewing.codigo}`} onClose={() => setViewing(null)} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[['Código', viewing.codigo], ['Tipo', viewing.tipo_punto_control || '—'], ['Exactitud H', viewing.exactitud_horizontal ? `±${viewing.exactitud_horizontal} m` : '—'], ['Descripción', viewing.descripcion || '—']].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
          {viewing.geom && <div style={{ marginTop: 16 }}><Suspense fallback={<div className="spinner" />}><MapEditor geom={viewing.geom} readOnly geometryType="point" height={280} /></Suspense></div>}
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar punto control ${deleting.codigo}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
