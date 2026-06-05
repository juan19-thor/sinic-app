import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { terrenosApi } from '../../services/api'
import { Terreno } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const MapEditor = lazy(() => import('../../components/MapEditor'))

const CONDICION = ['Formalidad', 'Informalidad_Posesion', 'Informalidad_Ocupacion',
  'Informalidad_Titulo_Sin_Registrar', 'Informalidad_Sucesion', 'Informalidad_Posesion_Hecho']
const TIPO_TERRENO = ['Publico', 'Privado', 'Mixto']

const EMPTY = { area_geometrica: undefined, area_catastral: undefined, condicion_predio: 'Formalidad', tipo_terreno: 'Privado', geom: null, observaciones: '' }

export default function TerrenosPage() {
  const [items, setItems] = useState<Terreno[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Terreno | null>(null)
  const [viewing, setViewing] = useState<Terreno | null>(null)
  const [deleting, setDeleting] = useState<Terreno | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [showGeojsonInput, setShowGeojsonInput] = useState(false)
  const [geojsonText, setGeojsonText] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await terrenosApi.list({ page, size: 15 })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (showGeojsonInput && geojsonText) {
      try {
        const parsed = JSON.parse(geojsonText)
        setForm((p: any) => ({ ...p, geom: parsed }))
      } catch { toast.error('GeoJSON inválido'); return }
    }
    setSaving(true)
    try {
      const payload = { ...form }
      if (editing) { await terrenosApi.update(editing.t_id, payload); toast.success('Terreno actualizado') }
      else { await terrenosApi.create(payload); toast.success('Terreno creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await terrenosApi.delete(deleting.t_id); toast.success('Terreno eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (t: Terreno) => {
    setEditing(t)
    setForm({ ...t, geom: t.geom || null })
    setGeojsonText(t.geom ? JSON.stringify(t.geom, null, 2) : '')
    setShowGeojsonInput(false)
    setErrors({})
    setShowForm(true)
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Unidad Espacial</div>
        <h2>Terrenos (CR_Terreno)</h2>
        <p>Unidades espaciales de tipo terreno con geometría MultiPolygon</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📍 Listado de Terrenos</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setGeojsonText(''); setShowGeojsonInput(false); setErrors({}); setShowForm(true) }}>+ Nuevo Terreno</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">🗺️</div><p>Sin terrenos registrados</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Área Geométrica</th><th>Área Catastral</th><th>Condición</th><th>Tipo Terreno</th><th>Geometría</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.t_id}>
                      <td>{t.t_id}</td>
                      <td>{t.area_geometrica ? `${Number(t.area_geometrica).toFixed(2)} m²` : '—'}</td>
                      <td>{t.area_catastral ? `${Number(t.area_catastral).toFixed(2)} m²` : '—'}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{t.condicion_predio || '—'}</span></td>
                      <td>{t.tipo_terreno || '—'}</td>
                      <td>{t.geom ? <span className="badge badge-green">✓ Geom</span> : <span className="badge badge-gray">Sin geom</span>}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(t)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(t)}>✏️</button>
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
        <Modal title={editing ? `Editar Terreno #${editing.t_id}` : 'Nuevo Terreno'} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Área Geométrica (m²)</label>
              <input type="number" step="0.01" value={form.area_geometrica ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, area_geometrica: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
            <div className="form-group">
              <label>Área Catastral (m²)</label>
              <input type="number" step="0.01" value={form.area_catastral ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, area_catastral: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
            <div className="form-group">
              <label>Condición Predio</label>
              <select value={form.condicion_predio || 'Formalidad'} onChange={(e) => setForm((p: any) => ({ ...p, condicion_predio: e.target.value }))}>
                {CONDICION.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo Terreno</label>
              <select value={form.tipo_terreno || 'Privado'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_terreno: e.target.value }))}>
                {TIPO_TERRENO.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group full-width">
              <label>Observaciones</label>
              <textarea value={form.observaciones || ''} onChange={(e) => setForm((p: any) => ({ ...p, observaciones: e.target.value }))} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Geometría (MultiPolygon, EPSG:4326)</strong>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGeojsonInput(!showGeojsonInput)}>
                {showGeojsonInput ? 'Usar Mapa' : 'Ingresar GeoJSON'}
              </button>
            </div>
            {showGeojsonInput ? (
              <div className="form-group">
                <label>GeoJSON de la geometría</label>
                <textarea className="geojson-textarea" rows={8} value={geojsonText}
                  onChange={(e) => setGeojsonText(e.target.value)}
                  placeholder='{"type":"MultiPolygon","coordinates":[[[[lng,lat],...]]]}'
                />
              </div>
            ) : (
              <Suspense fallback={<div className="loading-wrap"><div className="spinner" /></div>}>
                <MapEditor geom={form.geom} onChange={(g) => setForm((p: any) => ({ ...p, geom: g }))} geometryType="polygon" />
              </Suspense>
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`Terreno #${viewing.t_id}`} onClose={() => setViewing(null)} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[
              ['ID', viewing.t_id],
              ['Área Geométrica', viewing.area_geometrica ? `${viewing.area_geometrica} m²` : '—'],
              ['Área Catastral', viewing.area_catastral ? `${viewing.area_catastral} m²` : '—'],
              ['Condición', viewing.condicion_predio || '—'],
              ['Tipo Terreno', viewing.tipo_terreno || '—'],
              ['Observaciones', viewing.observaciones || '—'],
            ].map(([l, v]) => (
              <div key={String(l)} className="detail-item">
                <label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p>
              </div>
            ))}
          </div>
          {viewing.geom && (
            <div style={{ marginTop: 16 }}>
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={viewing.geom} readOnly geometryType="polygon" />
              </Suspense>
              <div style={{ marginTop: 8 }}>
                <details>
                  <summary style={{ cursor: 'pointer', fontSize: 13, color: '#6b7280' }}>Ver GeoJSON</summary>
                  <pre style={{ fontSize: 11, background: '#f3f4f6', padding: 10, borderRadius: 6, overflow: 'auto', maxHeight: 200 }}>{JSON.stringify(viewing.geom, null, 2)}</pre>
                </details>
              </div>
            </div>
          )}
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar terreno #${deleting.t_id}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
