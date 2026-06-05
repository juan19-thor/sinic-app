import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { prediosApi } from '../../services/api'
import { Predio } from '../../types'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const TIPO_PREDIO = ['NPH', 'PH', 'Condominio', 'Parque_Cementerio', 'Via', 'Bien_Baldio', 'Paramo']
const CONDICION = ['Formalidad', 'Informalidad_Posesion', 'Informalidad_Ocupacion',
  'Informalidad_Titulo_Sin_Registrar', 'Informalidad_Sucesion', 'Informalidad_Posesion_Hecho']
const DESTINACION = ['Habitacional', 'Comercial', 'Industrial', 'Agropecuario', 'Minero',
  'Cultural', 'Recreacional', 'Salubridad', 'Institucional', 'Educativo',
  'Religioso', 'Servicios_Especiales', 'Lote', 'En_Construccion']
const ESTADOS = ['Activo', 'Cancelado', 'Inactivo']

const EMPTY: Partial<Predio> = {
  departamento: '', municipio: '', numero_predial_nacional: '', nupre: '',
  codigo_orip: '', matricula_inmobiliaria: '', tipo_predio: 'NPH',
  condicion_predio: 'Formalidad', destinacion_economica: 'Habitacional',
  area_catastral_terreno: undefined, area_registral_m2: undefined,
  direccion: '', estado: 'Activo', observaciones: '',
}

function estadoBadge(estado: string) {
  const cls = estado === 'Activo' ? 'badge-green' : estado === 'Cancelado' ? 'badge-red' : 'badge-gray'
  return <span className={`badge ${cls}`}>{estado}</span>
}

export default function PrediosPage() {
  const [items, setItems] = useState<Predio[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Predio | null>(null)
  const [viewing, setViewing] = useState<Predio | null>(null)
  const [deleting, setDeleting] = useState<Predio | null>(null)
  const [form, setForm] = useState<Partial<Predio>>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await prediosApi.list({ page, size: 15, search: search || undefined, estado: filterEstado || undefined })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }, [page, search, filterEstado])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.departamento || !/^\d{2}$/.test(form.departamento)) errs.departamento = 'Debe tener 2 dígitos numéricos'
    if (!form.municipio || !/^\d{3}$/.test(form.municipio)) errs.municipio = 'Debe tener 3 dígitos numéricos'
    if (form.numero_predial_nacional && !/^\d{30}$/.test(form.numero_predial_nacional))
      errs.numero_predial_nacional = 'El NPN debe tener exactamente 30 dígitos'
    if (!form.tipo_predio) errs.tipo_predio = 'Requerido'
    if (!form.condicion_predio) errs.condicion_predio = 'Requerido'
    if (!form.estado) errs.estado = 'Requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        await prediosApi.update(editing.t_id, form)
        toast.success('Predio actualizado')
      } else {
        await prediosApi.create(form)
        toast.success('Predio creado')
      }
      setShowForm(false)
      setEditing(null)
      setForm(EMPTY)
      load()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleEdit = (p: Predio) => { setEditing(p); setForm({ ...p }); setErrors({}); setShowForm(true) }
  const handleNew = () => { setEditing(null); setForm({ ...EMPTY }); setErrors({}); setShowForm(true) }
  const handleDelete = async () => {
    if (!deleting) return
    try {
      await prediosApi.delete(deleting.t_id)
      toast.success('Predio eliminado')
      setDeleting(null)
      load()
    } catch (e: any) { toast.error(e.message) }
  }

  const F = (field: keyof Predio) => ({
    value: (form[field] ?? '') as string,
    onChange: (e: any) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
    className: errors[field] ? 'error' : '',
  })

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Modelo de Datos SINIC › Unidad Administrativa</div>
        <h2>Predios (SINIC_Predio)</h2>
        <p>Gestión de predios conforme al Modelo de Aplicación LADM_COL SINIC V1.0</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="toolbar">
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input placeholder="Buscar por NPN, NUPRE, matrícula..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <select value={filterEstado} onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }} style={{ padding: '8px 10px', borderRadius: 6, border: '1.5px solid var(--border)' }}>
              <option value="">Todos los estados</option>
              {ESTADOS.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleNew}>+ Nuevo Predio</button>
        </div>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /><span>Cargando predios...</span></div>
        ) : items.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🏛️</div><p>No hay predios registrados</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>NPN</th><th>Depto/Mpio</th><th>Tipo Predio</th>
                  <th>Condición</th><th>Área Catastral</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.t_id}>
                    <td>{p.t_id}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.numero_predial_nacional || '—'}</td>
                    <td>{p.departamento}-{p.municipio}</td>
                    <td><span className="badge badge-blue">{p.tipo_predio}</span></td>
                    <td><span style={{ fontSize: 12 }}>{p.condicion_predio}</span></td>
                    <td>{p.area_catastral_terreno ? `${Number(p.area_catastral_terreno).toFixed(2)} m²` : '—'}</td>
                    <td>{estadoBadge(p.estado)}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-secondary btn-sm btn-icon" title="Ver" onClick={() => setViewing(p)}>👁</button>
                        <button className="btn btn-secondary btn-sm btn-icon" title="Editar" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Eliminar" onClick={() => setDeleting(p)}>🗑</button>
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

      {/* Form Modal */}
      {showForm && (
        <Modal
          title={editing ? `Editar Predio #${editing.t_id}` : 'Nuevo Predio'}
          onClose={() => { setShowForm(false); setEditing(null) }}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Predio'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Departamento <span className="required">*</span></label>
              <input {...F('departamento')} placeholder="ej: 11" maxLength={2} />
              {errors.departamento && <span className="field-error">{errors.departamento}</span>}
            </div>
            <div className="form-group">
              <label>Municipio <span className="required">*</span></label>
              <input {...F('municipio')} placeholder="ej: 001" maxLength={3} />
              {errors.municipio && <span className="field-error">{errors.municipio}</span>}
            </div>
            <div className="form-group full-width">
              <label>Número Predial Nacional (NPN)</label>
              <input {...F('numero_predial_nacional')} placeholder="30 dígitos numéricos" maxLength={30} style={{ fontFamily: 'monospace' }} />
              {errors.numero_predial_nacional && <span className="field-error">{errors.numero_predial_nacional}</span>}
              <span style={{ fontSize: 11, color: '#6b7280' }}>Estructura: Dpto(2)+Mpio(3)+Zona(2)+Sector(2)+Comuna(2)+Barrio(2)+Manzana(4)+Terreno(4)+Condicion(1)+Torre(2)+Piso(2)+Unidad(4)</span>
            </div>
            <div className="form-group"><label>NUPRE</label><input {...F('nupre')} placeholder="ej: NUPRE-001-2025" /></div>
            <div className="form-group"><label>Código ORIP</label><input {...F('codigo_orip')} /></div>
            <div className="form-group"><label>Matrícula Inmobiliaria</label><input {...F('matricula_inmobiliaria')} /></div>
            <div className="form-group">
              <label>Tipo Predio <span className="required">*</span></label>
              <select value={form.tipo_predio || 'NPH'} onChange={(e) => setForm((p) => ({ ...p, tipo_predio: e.target.value }))} className={errors.tipo_predio ? 'error' : ''}>
                {TIPO_PREDIO.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.tipo_predio && <span className="field-error">{errors.tipo_predio}</span>}
            </div>
            <div className="form-group">
              <label>Condición Predio <span className="required">*</span></label>
              <select value={form.condicion_predio || 'Formalidad'} onChange={(e) => setForm((p) => ({ ...p, condicion_predio: e.target.value }))} className={errors.condicion_predio ? 'error' : ''}>
                {CONDICION.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Destinación Económica</label>
              <select value={form.destinacion_economica || ''} onChange={(e) => setForm((p) => ({ ...p, destinacion_economica: e.target.value }))}>
                <option value="">— Seleccione —</option>
                {DESTINACION.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Área Catastral Terreno (m²)</label>
              <input type="number" step="0.01" value={form.area_catastral_terreno ?? ''} onChange={(e) => setForm((p) => ({ ...p, area_catastral_terreno: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
            <div className="form-group">
              <label>Área Registral (m²)</label>
              <input type="number" step="0.01" value={form.area_registral_m2 ?? ''} onChange={(e) => setForm((p) => ({ ...p, area_registral_m2: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
            <div className="form-group">
              <label>Fecha Inscripción Catastral</label>
              <input type="date" value={form.fecha_inscripcion_catastral || ''} onChange={(e) => setForm((p) => ({ ...p, fecha_inscripcion_catastral: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Vigencia Actualización Catastral</label>
              <input type="date" value={form.vigencia_actualizacion_catastral || ''} onChange={(e) => setForm((p) => ({ ...p, vigencia_actualizacion_catastral: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Estado <span className="required">*</span></label>
              <select value={form.estado || 'Activo'} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))} className={errors.estado ? 'error' : ''}>
                {ESTADOS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group full-width"><label>Dirección</label><input {...F('direccion')} /></div>
            <div className="form-group full-width"><label>Observaciones</label><textarea value={form.observaciones || ''} onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))} /></div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal title={`Predio #${viewing.t_id}`} onClose={() => setViewing(null)} size="lg"
          footer={<>
            <button className="btn btn-secondary" onClick={() => { setViewing(null); handleEdit(viewing) }}>Editar</button>
            <button className="btn btn-secondary" onClick={() => setViewing(null)}>Cerrar</button>
          </>}
        >
          <div className="detail-grid">
            {[
              ['ID', viewing.t_id], ['NPN', viewing.numero_predial_nacional || '—'],
              ['Departamento', viewing.departamento], ['Municipio', viewing.municipio],
              ['NUPRE', viewing.nupre || '—'], ['Código ORIP', viewing.codigo_orip || '—'],
              ['Matrícula', viewing.matricula_inmobiliaria || '—'],
              ['Tipo Predio', viewing.tipo_predio], ['Condición', viewing.condicion_predio],
              ['Destinación', viewing.destinacion_economica || '—'],
              ['Área Catastral', viewing.area_catastral_terreno ? `${viewing.area_catastral_terreno} m²` : '—'],
              ['Área Registral', viewing.area_registral_m2 ? `${viewing.area_registral_m2} m²` : '—'],
              ['Estado', viewing.estado], ['Dirección', viewing.direccion || '—'],
              ['Fecha Inscripción', viewing.fecha_inscripcion_catastral || '—'],
              ['Creado', new Date(viewing.created_at).toLocaleString('es-CO')],
            ].map(([l, v]) => (
              <div key={String(l)} className="detail-item">
                <label>{l}</label>
                <p className={!v || v === '—' ? 'empty' : ''}>{String(v)}</p>
              </div>
            ))}
            {viewing.observaciones && (
              <div className="detail-item full-width">
                <label>Observaciones</label>
                <p>{viewing.observaciones}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          message={`¿Eliminar el predio #${deleting.t_id} (NPN: ${deleting.numero_predial_nacional || 'sin NPN'})? Se realizará un borrado lógico.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
