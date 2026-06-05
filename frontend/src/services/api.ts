import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Error de conexión con el servidor'
    return Promise.reject(new Error(typeof msg === 'string' ? msg : JSON.stringify(msg)))
  },
)

// ── Unidad Administrativa ─────────────────────────────────────────────────────
export const prediosApi = {
  list: (params?: object) => api.get('/api/unidad-administrativa/predios', { params }),
  get: (id: number) => api.get(`/api/unidad-administrativa/predios/${id}`),
  create: (data: object) => api.post('/api/unidad-administrativa/predios', data),
  update: (id: number, data: object) => api.patch(`/api/unidad-administrativa/predios/${id}`, data),
  delete: (id: number) => api.delete(`/api/unidad-administrativa/predios/${id}`),
  dominiosTipoPredio: () => api.get('/api/unidad-administrativa/dominios/tipo-predio'),
  dominiosCondicion: () => api.get('/api/unidad-administrativa/dominios/condicion-predio'),
  dominiosDestinacion: () => api.get('/api/unidad-administrativa/dominios/destinacion-economica'),
}

export const tramitesApi = {
  list: (params?: object) => api.get('/api/unidad-administrativa/tramites', { params }),
  create: (data: object) => api.post('/api/unidad-administrativa/tramites', data),
  update: (id: number, data: object) => api.patch(`/api/unidad-administrativa/tramites/${id}`, data),
  delete: (id: number) => api.delete(`/api/unidad-administrativa/tramites/${id}`),
}

// ── Unidad Espacial ───────────────────────────────────────────────────────────
export const terrenosApi = {
  list: (params?: object) => api.get('/api/unidad-espacial/terrenos', { params }),
  get: (id: number) => api.get(`/api/unidad-espacial/terrenos/${id}`),
  create: (data: object) => api.post('/api/unidad-espacial/terrenos', data),
  update: (id: number, data: object) => api.patch(`/api/unidad-espacial/terrenos/${id}`, data),
  delete: (id: number) => api.delete(`/api/unidad-espacial/terrenos/${id}`),
}

export const unidadesConstruccionApi = {
  list: (params?: object) => api.get('/api/unidad-espacial/unidades-construccion', { params }),
  get: (id: number) => api.get(`/api/unidad-espacial/unidades-construccion/${id}`),
  create: (data: object) => api.post('/api/unidad-espacial/unidades-construccion', data),
  update: (id: number, data: object) => api.patch(`/api/unidad-espacial/unidades-construccion/${id}`, data),
  delete: (id: number) => api.delete(`/api/unidad-espacial/unidades-construccion/${id}`),
}

// ── Interesados ───────────────────────────────────────────────────────────────
export const interesadosApi = {
  list: (params?: object) => api.get('/api/interesados', { params }),
  get: (id: number) => api.get(`/api/interesados/${id}`),
  create: (data: object) => api.post('/api/interesados', data),
  update: (id: number, data: object) => api.patch(`/api/interesados/${id}`, data),
  delete: (id: number) => api.delete(`/api/interesados/${id}`),
}

export const agrupacionesApi = {
  list: (params?: object) => api.get('/api/agrupaciones-interesados', { params }),
  get: (id: number) => api.get(`/api/agrupaciones-interesados/${id}`),
  create: (data: object) => api.post('/api/agrupaciones-interesados', data),
  update: (id: number, data: object) => api.patch(`/api/agrupaciones-interesados/${id}`, data),
  delete: (id: number) => api.delete(`/api/agrupaciones-interesados/${id}`),
  getMiembros: (id: number) => api.get(`/api/agrupaciones-interesados/${id}/miembros`),
  addMiembro: (id: number, data: object) => api.post(`/api/agrupaciones-interesados/${id}/miembros`, data),
}

// ── Topografía ────────────────────────────────────────────────────────────────
export const linderosApi = {
  list: (params?: object) => api.get('/api/topografia/linderos', { params }),
  get: (id: number) => api.get(`/api/topografia/linderos/${id}`),
  create: (data: object) => api.post('/api/topografia/linderos', data),
  update: (id: number, data: object) => api.patch(`/api/topografia/linderos/${id}`, data),
  delete: (id: number) => api.delete(`/api/topografia/linderos/${id}`),
}

export const puntosLinderoApi = {
  list: (params?: object) => api.get('/api/topografia/puntos-lindero', { params }),
  get: (id: number) => api.get(`/api/topografia/puntos-lindero/${id}`),
  create: (data: object) => api.post('/api/topografia/puntos-lindero', data),
  update: (id: number, data: object) => api.patch(`/api/topografia/puntos-lindero/${id}`, data),
  delete: (id: number) => api.delete(`/api/topografia/puntos-lindero/${id}`),
}

export const puntosControlApi = {
  list: (params?: object) => api.get('/api/topografia/puntos-control', { params }),
  get: (id: number) => api.get(`/api/topografia/puntos-control/${id}`),
  create: (data: object) => api.post('/api/topografia/puntos-control', data),
  update: (id: number, data: object) => api.patch(`/api/topografia/puntos-control/${id}`, data),
  delete: (id: number) => api.delete(`/api/topografia/puntos-control/${id}`),
}

// ── Cartografía ───────────────────────────────────────────────────────────────
const cartoEndpoints = [
  'limite-municipio', 'sector-rural', 'sector-urbano', 'perimetro-urbano',
  'veredas', 'corregimientos', 'localidades-comunas', 'centros-poblados',
  'manzanas', 'barrios', 'nomenclatura-vial',
] as const

type CartoEndpoint = typeof cartoEndpoints[number]

export const cartografiaApi = Object.fromEntries(
  cartoEndpoints.map((ep) => [
    ep.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
    {
      list: (params?: object) => api.get(`/api/cartografia/${ep}`, { params }),
      get: (id: number) => api.get(`/api/cartografia/${ep}/${id}`),
      create: (data: object) => api.post(`/api/cartografia/${ep}`, data),
      update: (id: number, data: object) => api.patch(`/api/cartografia/${ep}/${id}`, data),
      delete: (id: number) => api.delete(`/api/cartografia/${ep}/${id}`),
    },
  ])
) as Record<string, {
  list: (params?: object) => Promise<any>
  get: (id: number) => Promise<any>
  create: (data: object) => Promise<any>
  update: (id: number, data: object) => Promise<any>
  delete: (id: number) => Promise<any>
}>

export default api
