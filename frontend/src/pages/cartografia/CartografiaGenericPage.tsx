import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { CartografiaItem } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const MapEditor = lazy(() => import('../../components/MapEditor'))

interface CartografiaApi {
  list: (params?: object) => Promise<any>
  get: (id: number) => Promise<any>
  create: (data: object) => Promise<any>
  update: (id: number, data: object) => Promise<any>
  delete: (id: number) => Promise<any>
}

interface CartografiaGenericPageProps {
  title: string
  subtitle: string
  icon: string
  api: CartografiaApi
  geometryType: 'polygon' | 'line' | 'point' | 'any'
  extraFields?: { key: string; label: string; type?: string }[]
}

const EMPTY_BASE = { codigo: '', nombre: '', departamento: '', municipio: '', observacion: '', geom: null }

export default function CartografiaGenericPage({ title, subtitle, icon, api, geometryType, extraFields = [] }: CartografiaGenericPageProps) {
  const [items, setItems] = useState<CartografiaItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterDep, setFilterDep] = useState('')
  const [filterMun, setFilterMun] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CartografiaItem | null>(null)
  const [viewing, setViewing] = useState<CartografiaItem | null>(null)
  const [deleting, setDeleting] = useState<CartografiaItem | null>(null)
  const [form, setForm] = useState<any>(EMPTY_BASE)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [geojsonText, setGeojsonText] = useState('')
  const [showGeojson, setShowGeojson] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.list({ page, size: 15, search: search || undefined, departamento: filterDep || undefined, municipio: filterMun || undefined })
      setItems(res.data.items); setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page, search, filterDep, filterMun])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.codigo) errs.codigo = 'El código es requerido'
    if (!form.nombre) errs.nombre = 'El nombre es requerido'
    if (!form.departamento || !/^\d{2}$/.test(form.departamento)) errs.departamento = 'Debe tener 2 dígitos'
    if (!form.municipio || !/^\d{3}$/.test(form.municipio)) errs.municipio = 'Debe tener 3 dígitos'
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
      const payload = { ...form }
      if (editing) { await api.update(editing.t_id, payload); toast.success('Registro actualizado') }
      else { await api.create(payload); toast.success('Registro creado') }
      setShowForm(false); setEditing(null); setForm(EMPTY_BASE); load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await api.delete(deleting.t_id); toast.success('Eliminado'); setDeleting(null); load() }
    catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: CartografiaItem) => {
    setEditing(item)
    setForm({ ...item, geom: item.geom || null })
    setGeojsonText(item.geom ? JSON.stringify(item.geom, null, 2) : '')
    setShowGeojson(false)
    setErrors({})
    setShowForm(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY_BASE, ...Object.fromEntries(extraFields.map((f) => [f.key, ''])) })
    setGeojsonText('')
    setShowGeojson(false)
    setErrors({})
    setShowForm(true)
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Cartografía Catastral</div>
        <h2>{icon} {title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="toolbar">
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input placeholder="Buscar por nombre o código..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <input placeholder="Depto (2 digs)" value={filterDep} onChange={(e) => { setFilterDep(e.target.value); setPage(1) }} maxLength={2} style={{ width: 110, padding: '8px 10px', borderRadius: 6, border: '1.5px solid var(--border)' }} />
            <input placeholder="Mpio (3 digs)" value={filterMun} onChange={(e) => { setFilterMun(e.target.value); setPage(1) }} maxLength={3} style={{ width: 110, padding: '8px 10px', borderRadius: 6, border: '1.5px solid var(--border)' }} />
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Nuevo</button>
        </div>

        {loading ? <div className="loading-wrap"><div className="spinner" /></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon">{icon}</div><p>Sin registros</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Código</th><th>Nombre</th><th>Depto</th><th>Mpio</th>
                    {extraFields.map((f) => <th key={f.key}>{f.label}</th>)}
                    <th>Geom</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.t_id}>
                      <td>{item.t_id}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{item.codigo}</span></td>
                      <td>{item.nombre}</td>
                      <td>{item.departamento}</td>
                      <td>{item.municipio}</td>
                      {extraFields.map((f) => <td key={f.key}>{(item as any)[f.key] || '—'}</td>)}
                      <td>{item.geom ? <span className="badge badge-green">✓</span> : <span className="badge badge-gray">—</span>}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setViewing(item)}>👁</button>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(item)}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(item)}>🗑</button>
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
        <Modal title={editing ? `Editar ${title} #${editing.t_id}` : `Nuevo: ${title}`} onClose={() => setShowForm(false)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Código <span className="required">*</span></label>
              <input value={form.codigo || ''} onChange={(e) => setForm((p: any) => ({ ...p, codigo: e.target.value }))} className={errors.codigo ? 'error' : ''} />
              {errors.codigo && <span className="field-error">{errors.codigo}</span>}
            </div>
            <div className="form-group">
              <label>Nombre <span className="required">*</span></label>
              <input value={form.nombre || ''} onChange={(e) => setForm((p: any) => ({ ...p, nombre: e.target.value }))} className={errors.nombre ? 'error' : ''} />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Departamento <span className="required">*</span></label>
              <input value={form.departamento || ''} onChange={(e) => setForm((p: any) => ({ ...p, departamento: e.target.value }))} maxLength={2} placeholder="ej: 11" className={errors.departamento ? 'error' : ''} />
              {errors.departamento && <span className="field-error">{errors.departamento}</span>}
            </div>
            <div className="form-group">
              <label>Municipio <span className="required">*</span></label>
              <input value={form.municipio || ''} onChange={(e) => setForm((p: any) => ({ ...p, municipio: e.target.value }))} maxLength={3} placeholder="ej: 001" className={errors.municipio ? 'error' : ''} />
              {errors.municipio && <span className="field-error">{errors.municipio}</span>}
            </div>
            {extraFields.map((f) => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <input type={f.type || 'text'} value={(form as any)[f.key] || ''} onChange={(e) => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group full-width"><label>Observación</label><textarea value={form.observacion || ''} onChange={(e) => setForm((p: any) => ({ ...p, observacion: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Geometría (EPSG:4326)</strong>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGeojson(!showGeojson)}>{showGeojson ? 'Usar Mapa' : 'Ingresar GeoJSON'}</button>
            </div>
            {showGeojson ? (
              <textarea className="geojson-textarea" rows={6} value={geojsonText} onChange={(e) => setGeojsonText(e.target.value)} style={{ width: '100%', padding: 8, border: '1.5px solid var(--border)', borderRadius: 6 }} placeholder='{"type":"MultiPolygon","coordinates":[[[[lng,lat],[],...]]]}' />
            ) : (
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={form.geom} onChange={(g) => setForm((p: any) => ({ ...p, geom: g }))} geometryType={geometryType} />
              </Suspense>
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title={`${icon} ${viewing.nombre}`} onClose={() => setViewing(null)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => { setViewing(null); openEdit(viewing) }}>Editar</button>
            <button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>
          </>}
        >
          <div className="detail-grid">
            {[['ID', viewing.t_id], ['Código', viewing.codigo], ['Nombre', viewing.nombre],
              ['Departamento', viewing.departamento], ['Municipio', viewing.municipio],
              ...extraFields.map((f) => [f.label, (viewing as any)[f.key] || '—']),
              ['Observación', viewing.observacion || '—'],
              ['Creado', new Date(viewing.created_at).toLocaleString('es-CO')]
            ].map(([l, v]) => (
              <div key={String(l)} className="detail-item"><label>{l}</label><p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p></div>
            ))}
          </div>
          {viewing.geom && (
            <div style={{ marginTop: 16 }}>
              <Suspense fallback={<div className="spinner" />}>
                <MapEditor geom={viewing.geom} readOnly geometryType={geometryType} />
              </Suspense>
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 13, color: '#6b7280' }}>Ver GeoJSON</summary>
                <pre style={{ fontSize: 11, background: '#f3f4f6', padding: 10, borderRadius: 6, overflow: 'auto', maxHeight: 200, marginTop: 6 }}>{JSON.stringify(viewing.geom, null, 2)}</pre>
              </details>
            </div>
          )}
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`¿Eliminar "${deleting.nombre}" (#${deleting.t_id})?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  )
}
