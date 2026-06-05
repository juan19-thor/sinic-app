import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { linderosApi } from '../../services/api'
import { Lindero } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const MapEditor = lazy(() => import('../../components/MapEditor'))
const TIPOS = ['Definido', 'No_Definido']
const EMPTY = { tipo_lindero: 'Definido', descripcion: '', longitud: undefined, geom: null }

export default function LinderosPage() {
  const [items, setItems] = useState<Lindero[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Lindero | null>(null)
  const [viewing, setViewing] = useState<Lindero | null>(null)
  const [deleting, setDeleting] = useState<Lindero | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [geojsonText, setGeojsonText] = useState('')
  const [showGeojson, setShowGeojson] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await linderosApi.list({ page, size: 15 })
      setItems(res.data.items); setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (showGeojson && geojsonText) {
      try { setForm((p: any) => ({ ...p, geom: JSON.parse(geojsonText) })) } catch { toast.error('GeoJSON inválido'); return }
    }
    setSaving(true)
    try {
      if (editing) { await linderosApi.update(editing.t_id, form); toast.success('Lindero actualizado') }
      else { await linderosApi.create(form); toast.success('Lindero creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await linderosApi.delete(deleting.t_id); toast.success('Lindero eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Topografía y Representación</div>
        <h2>Linderos (CR_Lindero)</h2>
        <p>Líneas reales o imaginarias que delimitan los predios (MultiLineString)</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📏 Linderos</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setGeojsonText(''); setShowGeojson(false); setShowForm(true) }}>+ Nuevo Lindero</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">📏</div><p>Sin linderos registrados</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Tipo</th><th>Descripción</th><th>Longitud</th><th>Geom</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((l) => (
                    <tr key={l.t_id}>
                      <td>{l.t_id}</td>
                      <td><span className={`badge ${l.tipo_lindero === 'Definido' ? 'badge-green' : 'badge-yellow'}`}>{l.tipo_lindero || '—'}</span></td>
                      <td>{l.descripcion || '—'}</td>
                      <td>{l.longitud ? `${Number(l.longitud).toFixed(2)} m` : '—'}</td>
                      <td>{l.geom ? <span className="badge badge-green">✓</span> : <span className="badge badge-gray">—</span>}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(l)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(l); setForm({ ...l }); setGeojsonText(l.geom ? JSON.stringify(l.geom, null, 2) : ''); setShowGeojson(false); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(l)}>🗑</button>
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
        <Modal title={editing ? `Editar Lindero #${editing.t_id}` : 'Nuevo Lindero'} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo Lindero</label>
              <select value={form.tipo_lindero || 'Definido'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_lindero: e.target.value }))}>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Longitud (m)</label><input type="number" step="0.01" value={form.longitud ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, longitud: e.target.value ? Number(e.target.value) : undefined }))} /></div>
            <div className="form-group full-width"><label>Descripción</label><textarea value={form.descripcion || ''} onChange={(e) => setForm((p: any) => ({ ...p, descripcion: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Geometría (MultiLineString, EPSG:4326)</strong>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGeojson(!showGeojson)}>{showGeojson ? 'Usar Mapa' : 'Ingresar GeoJSON'}</button>
            </div>
            {showGeojson ? (
              <textarea className="geojson-textarea" rows={5} value={geojsonText} onChange={(e) => setGeojsonText(e.target.value)} placeholder='{"type":"MultiLineString","coordinates":[[[lng,lat],[lng,lat]]]}' style={{ width: '100%', padding: 8, border: '1.5px solid var(--border)', borderRadius: 6 }} />
            ) : (
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={form.geom} onChange={(g) => setForm((p: any) => ({ ...p, geom: g }))} geometryType="line" />
              </Suspense>
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`Lindero #${viewing.t_id}`} onClose={() => setViewing(null)} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[['ID', viewing.t_id], ['Tipo', viewing.tipo_lindero || '—'], ['Longitud', viewing.longitud ? `${viewing.longitud} m` : '—'], ['Descripción', viewing.descripcion || '—']].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
          {viewing.geom && <Suspense fallback={<div className="spinner" />}><MapEditor geom={viewing.geom} readOnly geometryType="line" /></Suspense>}
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar lindero #${deleting.t_id}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
