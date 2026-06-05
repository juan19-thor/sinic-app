import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { unidadesConstruccionApi } from '../../services/api'
import { UnidadConstruccion } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const MapEditor = lazy(() => import('../../components/MapEditor'))

const TIPOS_CONST = ['Convencional', 'No_Convencional']
const USO = ['Residencial', 'Comercial', 'Industrial', 'Dotacional', 'Mixto']
const ESTADO_CONS = ['Bueno', 'Regular', 'Malo', 'Ruinoso']

const EMPTY = { terreno_id: undefined, tipo_construccion: 'Convencional', numero_pisos: 1, area_construida: undefined, uso: 'Residencial', estado_conservacion: 'Bueno', identificador: '', geom: null, observaciones: '' }

export default function UnidadesConstruccionPage() {
  const [items, setItems] = useState<UnidadConstruccion[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<UnidadConstruccion | null>(null)
  const [viewing, setViewing] = useState<UnidadConstruccion | null>(null)
  const [deleting, setDeleting] = useState<UnidadConstruccion | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showGeojsonInput, setShowGeojsonInput] = useState(false)
  const [geojsonText, setGeojsonText] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await unidadesConstruccionApi.list({ page, size: 15 })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (showGeojsonInput && geojsonText) {
      try { setForm((p: any) => ({ ...p, geom: JSON.parse(geojsonText) })) }
      catch { toast.error('GeoJSON inválido'); return }
    }
    setSaving(true)
    try {
      if (editing) { await unidadesConstruccionApi.update(editing.t_id, form); toast.success('Actualizado') }
      else { await unidadesConstruccionApi.create(form); toast.success('Creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await unidadesConstruccionApi.delete(deleting.t_id); toast.success('Eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Unidad Espacial</div>
        <h2>Unidades de Construcción (CR_UnidadConstruccion)</h2>
        <p>Construcciones asociadas a terrenos con geometría MultiPolygon</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">🏗️ Unidades de Construcción</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(EMPTY); setGeojsonText(''); setShowGeojsonInput(false); setShowForm(true) }}>+ Nueva UC</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">🏗️</div><p>Sin unidades de construcción</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Terreno</th><th>Tipo</th><th>Pisos</th><th>Área</th><th>Uso</th><th>Estado Conserv.</th><th>Geom</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((uc) => (
                    <tr key={uc.t_id}>
                      <td>{uc.t_id}</td>
                      <td>{uc.terreno_id ? <span className="badge badge-blue">{uc.terreno_id}</span> : '—'}</td>
                      <td>{uc.tipo_construccion || '—'}</td>
                      <td>{uc.numero_pisos ?? '—'}</td>
                      <td>{uc.area_construida ? `${Number(uc.area_construida).toFixed(2)} m²` : '—'}</td>
                      <td>{uc.uso || '—'}</td>
                      <td><span className={`badge ${uc.estado_conservacion === 'Bueno' ? 'badge-green' : uc.estado_conservacion === 'Regular' ? 'badge-yellow' : 'badge-red'}`}>{uc.estado_conservacion || '—'}</span></td>
                      <td>{uc.geom ? <span className="badge badge-green">✓</span> : <span className="badge badge-gray">—</span>}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(uc)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(uc); setForm({ ...uc }); setGeojsonText(uc.geom ? JSON.stringify(uc.geom, null, 2) : ''); setShowGeojsonInput(false); setShowForm(true) }}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(uc)}>🗑</button>
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
        <Modal title={editing ? `Editar UC #${editing.t_id}` : 'Nueva Unidad de Construcción'} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group"><label>ID Terreno (opcional)</label><input type="number" value={form.terreno_id ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, terreno_id: e.target.value ? Number(e.target.value) : undefined }))} /></div>
            <div className="form-group">
              <label>Tipo Construcción</label>
              <select value={form.tipo_construccion || 'Convencional'} onChange={(e) => setForm((p: any) => ({ ...p, tipo_construccion: e.target.value }))}>
                {TIPOS_CONST.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>N° Pisos</label><input type="number" min="1" value={form.numero_pisos ?? 1} onChange={(e) => setForm((p: any) => ({ ...p, numero_pisos: Number(e.target.value) }))} /></div>
            <div className="form-group"><label>Área Construida (m²)</label><input type="number" step="0.01" value={form.area_construida ?? ''} onChange={(e) => setForm((p: any) => ({ ...p, area_construida: e.target.value ? Number(e.target.value) : undefined }))} /></div>
            <div className="form-group">
              <label>Uso</label>
              <select value={form.uso || 'Residencial'} onChange={(e) => setForm((p: any) => ({ ...p, uso: e.target.value }))}>
                {USO.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Estado Conservación</label>
              <select value={form.estado_conservacion || 'Bueno'} onChange={(e) => setForm((p: any) => ({ ...p, estado_conservacion: e.target.value }))}>
                {ESTADO_CONS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Identificador</label><input value={form.identificador || ''} onChange={(e) => setForm((p: any) => ({ ...p, identificador: e.target.value }))} /></div>
            <div className="form-group full-width"><label>Observaciones</label><textarea value={form.observaciones || ''} onChange={(e) => setForm((p: any) => ({ ...p, observaciones: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Geometría (MultiPolygon, EPSG:4326)</strong>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGeojsonInput(!showGeojsonInput)}>{showGeojsonInput ? 'Usar Mapa' : 'Ingresar GeoJSON'}</button>
            </div>
            {showGeojsonInput ? (
              <textarea className="geojson-textarea" rows={6} value={geojsonText} onChange={(e) => setGeojsonText(e.target.value)} placeholder='{"type":"MultiPolygon","coordinates":[[[[lng,lat],...]]]}'
                style={{ width: '100%', padding: 8, border: '1.5px solid var(--border)', borderRadius: 6 }} />
            ) : (
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={form.geom} onChange={(g) => setForm((p: any) => ({ ...p, geom: g }))} geometryType="polygon" />
              </Suspense>
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`UC #${viewing.t_id}`} onClose={() => setViewing(null)} size="lg"
          footer={<button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>}
        >
          <div className="detail-grid">
            {[['ID', viewing.t_id], ['Terreno', viewing.terreno_id || '—'], ['Tipo', viewing.tipo_construccion || '—'],
              ['Pisos', viewing.numero_pisos || '—'], ['Área', viewing.area_construida ? `${viewing.area_construida} m²` : '—'],
              ['Uso', viewing.uso || '—'], ['Conservación', viewing.estado_conservacion || '—'],
              ['Identificador', viewing.identificador || '—']].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
          {viewing.geom && (
            <div style={{ marginTop: 16 }}>
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={viewing.geom} readOnly geometryType="polygon" />
              </Suspense>
            </div>
          )}
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar UC #${deleting.t_id}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
