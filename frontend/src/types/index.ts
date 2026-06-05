export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface Predio {
  t_id: number
  departamento: string
  municipio: string
  numero_predial_nacional?: string
  nupre?: string
  codigo_orip?: string
  matricula_inmobiliaria?: string
  tipo_predio: string
  condicion_predio: string
  destinacion_economica?: string
  area_catastral_terreno?: number
  area_registral_m2?: number
  fecha_inscripcion_catastral?: string
  vigencia_actualizacion_catastral?: string
  direccion?: string
  estado: string
  observaciones?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Terreno {
  t_id: number
  area_geometrica?: number
  area_catastral?: number
  condicion_predio?: string
  tipo_terreno?: string
  geom?: GeoJSONGeometry
  observaciones?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface UnidadConstruccion {
  t_id: number
  terreno_id?: number
  tipo_construccion?: string
  numero_pisos?: number
  area_construida?: number
  uso?: string
  estado_conservacion?: string
  identificador?: string
  geom?: GeoJSONGeometry
  observaciones?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Interesado {
  t_id: number
  tipo_interesado: string
  tipo_documento?: string
  numero_documento?: string
  primer_nombre?: string
  segundo_nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
  razon_social?: string
  correo?: string
  telefono?: string
  direccion_notificacion?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface AgrupacionInteresados {
  t_id: number
  nombre_agrupacion: string
  tipo_agrupacion?: string
  descripcion?: string
  created_at: string
  updated_at: string
}

export interface Lindero {
  t_id: number
  tipo_lindero?: string
  descripcion?: string
  longitud?: number
  geom?: GeoJSONGeometry
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface PuntoLindero {
  t_id: number
  tipo_punto?: string
  descripcion?: string
  exactitud_horizontal?: number
  exactitud_vertical?: number
  geom?: GeoJSONGeometry
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface PuntoControl {
  t_id: number
  codigo: string
  tipo_punto_control?: string
  descripcion?: string
  exactitud_horizontal?: number
  geom?: GeoJSONGeometry
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CartografiaItem {
  t_id: number
  codigo: string
  nombre: string
  departamento: string
  municipio: string
  observacion?: string
  geom?: GeoJSONGeometry
  zona?: string
  sector?: string
  tipo_via?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface GeoJSONGeometry {
  type: string
  coordinates: any
}

export interface TramiteCatastral {
  t_id: number
  predio_id: number
  tipo_tramite: string
  numero_tramite?: string
  fecha_tramite?: string
  fecha_inscripcion?: string
  descripcion?: string
  estado_tramite: string
  created_at: string
  updated_at: string
}
