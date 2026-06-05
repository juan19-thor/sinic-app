import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { puntosLinderoApi } from '../../services/api'
import { PuntoLindero } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const MapEditor = lazy(() => import('../../components/MapEditor'))

const TIPOS = ['Catastro.Poste', 'Catastro.Construccion', 'Catastro.Punto_Dinamico',
  'Catastro.Elemento_Natural', 'Catastro.Piedra', 'Catastro.Sin_Materializacion',
  'Catastro.Mojon', 'Catastro.Incrustacion', 'Catastro.Pilastra', 'Control']

const EMPTY = { tipo_punto: 'Catastro.Mojon', descripcion: '', exactitud_horizontal: undefined, exactitud_vertical: undefined, geom: null }

export default function PuntosLinderoPage() {
  const [items, setItems] = useState<PuntoLindero[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PuntoLindero | null>(null)
  const [viewing, setViewing] = useState<PuntoLindero | null>(null)
  const [deleting, setDeleting] = useState<PuntoLindero | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [geojsonText, setGeojsonText] = useState('')
  const [showGeojson, setShowGeojson] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await puntosLinderoApi.list({ page, size: 15 })
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
      if (editing) { await puntosLinderoApi.update(editing.t_id, form); toast.success('Actualizado') }
      else { await puntosLinderoApi.create(form); toast.success('Creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await puntosLinderoApi.delete(deleting.t_id); toast.success('Eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Topografía y Representación</div>
        <h2>Puntos de Lindero (CR_PuntoLindero)</h2>
        <p>Puntos topográficos que conforman los linderos prediales (Point, EPSG:4326)</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📍 Puntos de Lindero</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setGeojsonText(''); setShowGeojson(false); setShowForm(true) }}>+ Nuevo Punto</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">📍</div><p>Sin puntos de lindero</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Tipo Punto</th><th>Descripción</th><th>Exactitud H</th><th>Geom</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.t_id}>
                      <td>{p.t_id}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{p.tipo_punto || '—'}</span></td>
                      <td>{p.descripcion || '—'}</td>
                      <td>{p.exactitud_horizontal ? `±${p.exactitud_horizontal} m` : '—'}</td>
                      <td>{p.geom ? <span className="badge badge-green">✓</span> : <span className="badge badge-gray">—</span>}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(p)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(p); setForm({ ...p }); setGeojsonText(p.geom ? JSON.stringify(p.geom, null, 2) : ''); setShowGeojson(false); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(p)}>🗑</button>
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
        <Modal title={editing ? `Editar Punto #${editing.t_id}` : 'Nuevo Punto de Lindero'} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo Punto</label>
              <select value={form.tipo_punto || 'Catastro.Mojon'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_punto: e.target.value }))}>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Exactitud Horizontal (m)</label><input type="number" step="0.001" value={form.exactitud_horizontal ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, exactitud_horizontal: e.target.value ? Number(e.target.value) : undefined }))} /></div>
            <div className="form-group"><label>Exactitud Vertical (m)</label><input type="number" step="0.001" value={form.exactitud_vertical ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, exactitud_vertical: e.target.value ? Number(e.target.value) : undefined }))} /></div>
            <div className="form-group full-width"><label>Descripción</label><textarea value={form.descripcion || ''} onChange={(e) => setForm((p: any) => ({ ...p, descripcion: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Geometría (Point, EPSG:4326)</strong>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGeojson(!showGeojson)}>{showGeojson ? 'Usar Mapa' : 'GeoJSON'}</button>
            </div>
            {showGeojson ? (
              <textarea className="geojson-textarea" rows={3} value={geojsonText} onChange={(e) => setGeojsonText(e.target.value)} placeholder='{"type":"Point","coordinates":[-74.0762, 4.6000]}' style={{ width: '100%', padding: 8, border: '1.5px solid var(--border)', borderRadius: 6 }} />
            ) : (
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={form.geom} onChange={(g) => setForm((p: any) => ({ ...p, geom: g }))} geometryType="point" height={300} />
              </Suspense>
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`Punto Lindero #${viewing.t_id}`} onClose={() => setViewing(null)} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[['ID', viewing.t_id], ['Tipo', viewing.tipo_punto || '—'], ['Exactitud H', viewing.exactitud_horizontal ? `±${viewing.exactitud_horizontal} m` : '—'], ['Descripción', viewing.descripcion || '—']].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
          {viewing.geom && <Suspense fallback={<div className="spinner" />}><MapEditor geom={viewing.geom} readOnly geometryType="point" height={280} /></Suspense>}
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar punto lindero #${deleting.t_id}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
