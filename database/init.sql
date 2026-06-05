-- ============================================================
-- SINIC-APP: Base de datos espacial LADM_COL SINIC V1.0
-- SRID: 4326 (WGS84) para compatibilidad web.
-- NOTA: En producción oficial usar EPSG:9377 (MAGNA-SIRGAS Colombia).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

CREATE SCHEMA IF NOT EXISTS sinic_cr;

SET search_path TO sinic_cr, public;

-- ============================================================
-- DOMINIOS (catálogos de valores controlados)
-- ============================================================

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_predio (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_predio (ilicode, dispname) VALUES
  ('NPH','No Propiedad Horizontal'),
  ('PH','Propiedad Horizontal'),
  ('Condominio','Condominio'),
  ('Parque_Cementerio','Parque Cementerio'),
  ('Via','Vía'),
  ('Bien_Baldio','Bien Baldío'),
  ('Paramo','Páramo')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_condicion_predio (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_condicion_predio (ilicode, dispname) VALUES
  ('Formalidad','Formalidad'),
  ('Informalidad_Posesion','Informalidad - Posesión'),
  ('Informalidad_Ocupacion','Informalidad - Ocupación'),
  ('Informalidad_Titulo_Sin_Registrar','Informalidad - Título Sin Registrar'),
  ('Informalidad_Sucesion','Informalidad - Sucesión Ilíquida'),
  ('Informalidad_Posesion_Hecho','Informalidad - Posesión de Hecho')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_destinacion_economica (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_destinacion_economica (ilicode, dispname) VALUES
  ('Habitacional','Habitacional'),
  ('Comercial','Comercial'),
  ('Industrial','Industrial'),
  ('Agropecuario','Agropecuario'),
  ('Minero','Minero'),
  ('Cultural','Cultural'),
  ('Recreacional','Recreacional'),
  ('Salubridad','Salubridad'),
  ('Institucional','Institucional'),
  ('Educativo','Educativo'),
  ('Religioso','Religioso'),
  ('Servicios_Especiales','Servicios Especiales'),
  ('Lote','Lote'),
  ('En_Construccion','En Construcción')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_interesado (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_interesado (ilicode, dispname) VALUES
  ('Persona_Natural','Persona Natural'),
  ('Persona_Juridica','Persona Jurídica')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_documento (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_documento (ilicode, dispname) VALUES
  ('CC','Cédula de Ciudadanía'),
  ('CE','Cédula de Extranjería'),
  ('NIT','NIT'),
  ('PA','Pasaporte'),
  ('RC','Registro Civil'),
  ('TI','Tarjeta de Identidad'),
  ('NUIP','NUIP'),
  ('Secuencial','Secuencial')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_lindero (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_lindero (ilicode, dispname) VALUES
  ('Definido','Definido'),
  ('No_Definido','No Definido')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_punto (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_punto (ilicode, dispname) VALUES
  ('Catastro.Poste','Catastro - Poste'),
  ('Catastro.Construccion','Catastro - Construcción'),
  ('Catastro.Punto_Dinamico','Catastro - Punto Dinámico'),
  ('Catastro.Elemento_Natural','Catastro - Elemento Natural'),
  ('Catastro.Piedra','Catastro - Piedra'),
  ('Catastro.Sin_Materializacion','Catastro - Sin Materialización'),
  ('Catastro.Mojon','Catastro - Mojón'),
  ('Catastro.Incrustacion','Catastro - Incrustación'),
  ('Catastro.Pilastra','Catastro - Pilastra'),
  ('Control','Control')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_construccion (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_construccion (ilicode, dispname) VALUES
  ('Convencional','Convencional'),
  ('No_Convencional','No Convencional')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_estado_conservacion (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_estado_conservacion (ilicode, dispname) VALUES
  ('Bueno','Bueno'),
  ('Regular','Regular'),
  ('Malo','Malo'),
  ('Ruinoso','Ruinoso')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_uso_construccion (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_uso_construccion (ilicode, dispname) VALUES
  ('Residencial','Residencial'),
  ('Comercial','Comercial'),
  ('Industrial','Industrial'),
  ('Dotacional','Dotacional'),
  ('Mixto','Mixto')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_terreno (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_terreno (ilicode, dispname) VALUES
  ('Publico','Público'),
  ('Privado','Privado'),
  ('Mixto','Mixto')
ON CONFLICT (ilicode) DO NOTHING;

CREATE TABLE IF NOT EXISTS sinic_cr.col_dominio_tipo_agrupacion (
    t_id   SERIAL PRIMARY KEY,
    ilicode VARCHAR(255) UNIQUE NOT NULL,
    dispname VARCHAR(255) NOT NULL
);
INSERT INTO sinic_cr.col_dominio_tipo_agrupacion (ilicode, dispname) VALUES
  ('Grupo','Grupo'),
  ('Sociedad_Conyugal','Sociedad Conyugal'),
  ('Herencia','Herencia')
ON CONFLICT (ilicode) DO NOTHING;

-- ============================================================
-- MÓDULO 1: UNIDAD ADMINISTRATIVA BÁSICA
-- ============================================================

CREATE TABLE IF NOT EXISTS sinic_cr.sinic_predio (
    t_id                            SERIAL PRIMARY KEY,
    departamento                    CHAR(2) NOT NULL,
    municipio                       CHAR(3) NOT NULL,
    numero_predial_nacional         CHAR(30),
    numero_predial_anterior         VARCHAR(20),
    nupre                           VARCHAR(20),
    codigo_orip                     VARCHAR(10),
    matricula_inmobiliaria          VARCHAR(30),
    codigo_homologado               VARCHAR(20),
    tipo_predio                     VARCHAR(50) NOT NULL DEFAULT 'NPH'
                                        REFERENCES sinic_cr.col_dominio_tipo_predio(ilicode),
    condicion_predio                VARCHAR(80) NOT NULL DEFAULT 'Formalidad'
                                        REFERENCES sinic_cr.col_dominio_condicion_predio(ilicode),
    destinacion_economica           VARCHAR(50)
                                        REFERENCES sinic_cr.col_dominio_destinacion_economica(ilicode),
    area_catastral_terreno          NUMERIC(20,4),
    area_registral_m2               NUMERIC(20,4),
    fecha_inscripcion_catastral     DATE,
    vigencia_actualizacion_catastral DATE,
    direccion                       VARCHAR(255),
    estado                          VARCHAR(20) NOT NULL DEFAULT 'Activo'
                                        CHECK (estado IN ('Activo','Cancelado','Inactivo')),
    observaciones                   TEXT,
    created_at                      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at                      TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_departamento     CHECK (departamento ~ '^[0-9]{2}$'),
    CONSTRAINT chk_municipio        CHECK (municipio ~ '^[0-9]{3}$'),
    CONSTRAINT chk_npn              CHECK (numero_predial_nacional IS NULL OR numero_predial_nacional ~ '^[0-9]{30}$')
);
CREATE INDEX IF NOT EXISTS idx_sinic_predio_npn ON sinic_cr.sinic_predio(numero_predial_nacional);
CREATE INDEX IF NOT EXISTS idx_sinic_predio_departamento ON sinic_cr.sinic_predio(departamento);
CREATE INDEX IF NOT EXISTS idx_sinic_predio_municipio ON sinic_cr.sinic_predio(municipio);
CREATE INDEX IF NOT EXISTS idx_sinic_predio_estado ON sinic_cr.sinic_predio(estado);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_tramite_catastral (
    t_id                SERIAL PRIMARY KEY,
    predio_id           INTEGER NOT NULL REFERENCES sinic_cr.sinic_predio(t_id) ON DELETE RESTRICT,
    tipo_tramite        VARCHAR(100) NOT NULL,
    numero_tramite      VARCHAR(50),
    fecha_tramite       DATE,
    fecha_inscripcion   DATE,
    descripcion         TEXT,
    estado_tramite      VARCHAR(50) DEFAULT 'Activo' CHECK (estado_tramite IN ('Activo','Cerrado','Anulado')),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_tramite_predio ON sinic_cr.cr_tramite_catastral(predio_id);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_predio_copropiedad (
    t_id                SERIAL PRIMARY KEY,
    predio_id           INTEGER NOT NULL REFERENCES sinic_cr.sinic_predio(t_id) ON DELETE RESTRICT,
    predio_matriz_id    INTEGER REFERENCES sinic_cr.sinic_predio(t_id),
    coeficiente         NUMERIC(10,6) CHECK (coeficiente > 0 AND coeficiente <= 1),
    descripcion         TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_copropiedad_predio ON sinic_cr.cr_predio_copropiedad(predio_id);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_predio_informalidad (
    t_id                SERIAL PRIMARY KEY,
    predio_id           INTEGER NOT NULL REFERENCES sinic_cr.sinic_predio(t_id) ON DELETE RESTRICT,
    tipo_informalidad   VARCHAR(80) NOT NULL REFERENCES sinic_cr.col_dominio_condicion_predio(ilicode),
    descripcion         TEXT,
    fecha_reconocimiento DATE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_informalidad_predio ON sinic_cr.cr_predio_informalidad(predio_id);

-- ============================================================
-- MÓDULO 2: UNIDADES ESPACIALES
-- ============================================================

CREATE TABLE IF NOT EXISTS sinic_cr.cr_terreno (
    t_id                SERIAL PRIMARY KEY,
    area_geometrica     NUMERIC(20,4),
    area_catastral      NUMERIC(20,4),
    condicion_predio    VARCHAR(80) REFERENCES sinic_cr.col_dominio_condicion_predio(ilicode),
    tipo_terreno        VARCHAR(50) REFERENCES sinic_cr.col_dominio_tipo_terreno(ilicode),
    geom                geometry(MultiPolygon, 4326),
    observaciones       TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_terreno_geom ON sinic_cr.cr_terreno USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_unidad_construccion (
    t_id                    SERIAL PRIMARY KEY,
    terreno_id              INTEGER REFERENCES sinic_cr.cr_terreno(t_id) ON DELETE SET NULL,
    tipo_construccion       VARCHAR(50) REFERENCES sinic_cr.col_dominio_tipo_construccion(ilicode),
    numero_pisos            INTEGER CHECK (numero_pisos > 0),
    area_construida         NUMERIC(20,4),
    uso                     VARCHAR(50) REFERENCES sinic_cr.col_dominio_uso_construccion(ilicode),
    estado_conservacion     VARCHAR(50) REFERENCES sinic_cr.col_dominio_estado_conservacion(ilicode),
    identificador           VARCHAR(50),
    geom                    geometry(MultiPolygon, 4326),
    observaciones           TEXT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_unidad_construccion_geom ON sinic_cr.cr_unidad_construccion USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_cr_unidad_construccion_terreno ON sinic_cr.cr_unidad_construccion(terreno_id);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_caracteristicas_unidad_construccion (
    t_id                    SERIAL PRIMARY KEY,
    unidad_construccion_id  INTEGER NOT NULL REFERENCES sinic_cr.cr_unidad_construccion(t_id) ON DELETE CASCADE,
    anio_construccion       INTEGER CHECK (anio_construccion > 1800 AND anio_construccion <= 2100),
    material_paredes        VARCHAR(100),
    material_cubierta       VARCHAR(100),
    material_pisos          VARCHAR(100),
    numero_habitaciones     INTEGER CHECK (numero_habitaciones >= 0),
    numero_banos            INTEGER CHECK (numero_banos >= 0),
    numero_locales          INTEGER CHECK (numero_locales >= 0),
    tiene_sotano            BOOLEAN DEFAULT FALSE,
    tiene_mezanine          BOOLEAN DEFAULT FALSE,
    observaciones           TEXT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cr_caract_uc ON sinic_cr.cr_caracteristicas_unidad_construccion(unidad_construccion_id);

CREATE TABLE IF NOT EXISTS sinic_cr.col_uebaunit (
    t_id            SERIAL PRIMARY KEY,
    predio_id       INTEGER NOT NULL REFERENCES sinic_cr.sinic_predio(t_id) ON DELETE RESTRICT,
    terreno_id      INTEGER REFERENCES sinic_cr.cr_terreno(t_id) ON DELETE SET NULL,
    uc_id           INTEGER REFERENCES sinic_cr.cr_unidad_construccion(t_id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_uebaunit_relacion CHECK (terreno_id IS NOT NULL OR uc_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_col_uebaunit_predio ON sinic_cr.col_uebaunit(predio_id);
CREATE INDEX IF NOT EXISTS idx_col_uebaunit_terreno ON sinic_cr.col_uebaunit(terreno_id);

-- ============================================================
-- MÓDULO 3: INTERESADOS
-- ============================================================

CREATE TABLE IF NOT EXISTS sinic_cr.cr_interesado (
    t_id                    SERIAL PRIMARY KEY,
    tipo_interesado         VARCHAR(50) NOT NULL REFERENCES sinic_cr.col_dominio_tipo_interesado(ilicode),
    tipo_documento          VARCHAR(50) REFERENCES sinic_cr.col_dominio_tipo_documento(ilicode),
    numero_documento        VARCHAR(30),
    primer_nombre           VARCHAR(100),
    segundo_nombre          VARCHAR(100),
    primer_apellido         VARCHAR(100),
    segundo_apellido        VARCHAR(100),
    razon_social            VARCHAR(255),
    correo                  VARCHAR(255),
    telefono                VARCHAR(20),
    direccion_notificacion  VARCHAR(255),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_interesado_natural CHECK (
        tipo_interesado <> 'Persona_Natural' OR (primer_nombre IS NOT NULL AND primer_apellido IS NOT NULL)
    ),
    CONSTRAINT chk_interesado_juridica CHECK (
        tipo_interesado <> 'Persona_Juridica' OR razon_social IS NOT NULL
    ),
    UNIQUE (tipo_documento, numero_documento)
);
CREATE INDEX IF NOT EXISTS idx_cr_interesado_documento ON sinic_cr.cr_interesado(tipo_documento, numero_documento);
CREATE INDEX IF NOT EXISTS idx_cr_interesado_tipo ON sinic_cr.cr_interesado(tipo_interesado);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_agrupacion_interesados (
    t_id                SERIAL PRIMARY KEY,
    nombre_agrupacion   VARCHAR(255) NOT NULL,
    tipo_agrupacion     VARCHAR(50) REFERENCES sinic_cr.col_dominio_tipo_agrupacion(ilicode),
    descripcion         TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS sinic_cr.col_miembros (
    t_id                SERIAL PRIMARY KEY,
    agrupacion_id       INTEGER NOT NULL REFERENCES sinic_cr.cr_agrupacion_interesados(t_id) ON DELETE CASCADE,
    interesado_id       INTEGER NOT NULL REFERENCES sinic_cr.cr_interesado(t_id) ON DELETE RESTRICT,
    participacion       NUMERIC(10,6) CHECK (participacion > 0 AND participacion <= 1),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (agrupacion_id, interesado_id)
);
CREATE INDEX IF NOT EXISTS idx_col_miembros_agrupacion ON sinic_cr.col_miembros(agrupacion_id);
CREATE INDEX IF NOT EXISTS idx_col_miembros_interesado ON sinic_cr.col_miembros(interesado_id);

-- Relación predio-interesado (derecho)
CREATE TABLE IF NOT EXISTS sinic_cr.col_derecho (
    t_id            SERIAL PRIMARY KEY,
    predio_id       INTEGER NOT NULL REFERENCES sinic_cr.sinic_predio(t_id) ON DELETE RESTRICT,
    interesado_id   INTEGER REFERENCES sinic_cr.cr_interesado(t_id) ON DELETE SET NULL,
    agrupacion_id   INTEGER REFERENCES sinic_cr.cr_agrupacion_interesados(t_id) ON DELETE SET NULL,
    tipo_derecho    VARCHAR(100) DEFAULT 'Dominio',
    participacion   NUMERIC(10,6),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_derecho_titular CHECK (interesado_id IS NOT NULL OR agrupacion_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_col_derecho_predio ON sinic_cr.col_derecho(predio_id);
CREATE INDEX IF NOT EXISTS idx_col_derecho_interesado ON sinic_cr.col_derecho(interesado_id);

-- ============================================================
-- MÓDULO 4: TOPOGRAFÍA Y REPRESENTACIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS sinic_cr.cr_lindero (
    t_id            SERIAL PRIMARY KEY,
    tipo_lindero    VARCHAR(50) REFERENCES sinic_cr.col_dominio_tipo_lindero(ilicode),
    descripcion     TEXT,
    longitud        NUMERIC(20,4),
    geom            geometry(MultiLineString, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_lindero_geom ON sinic_cr.cr_lindero USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_punto_lindero (
    t_id            SERIAL PRIMARY KEY,
    tipo_punto      VARCHAR(80) REFERENCES sinic_cr.col_dominio_tipo_punto(ilicode),
    descripcion     TEXT,
    exactitud_horizontal NUMERIC(10,4),
    exactitud_vertical   NUMERIC(10,4),
    geom            geometry(Point, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_punto_lindero_geom ON sinic_cr.cr_punto_lindero USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cr_punto_control (
    t_id                SERIAL PRIMARY KEY,
    codigo              VARCHAR(50) NOT NULL,
    tipo_punto_control  VARCHAR(80) REFERENCES sinic_cr.col_dominio_tipo_punto(ilicode),
    descripcion         TEXT,
    exactitud_horizontal NUMERIC(10,4),
    exactitud_vertical   NUMERIC(10,4),
    geom                geometry(Point, 4326),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cr_punto_control_geom ON sinic_cr.cr_punto_control USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_cr_punto_control_codigo ON sinic_cr.cr_punto_control(codigo);

-- Relación lindero-punto_lindero (col_puntoCCl)
CREATE TABLE IF NOT EXISTS sinic_cr.col_punto_ccl (
    t_id                SERIAL PRIMARY KEY,
    lindero_id          INTEGER NOT NULL REFERENCES sinic_cr.cr_lindero(t_id) ON DELETE CASCADE,
    punto_lindero_id    INTEGER NOT NULL REFERENCES sinic_cr.cr_punto_lindero(t_id) ON DELETE RESTRICT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (lindero_id, punto_lindero_id)
);
CREATE INDEX IF NOT EXISTS idx_col_punto_ccl_lindero ON sinic_cr.col_punto_ccl(lindero_id);

-- Relación terreno-lindero que aporta área (col_masCcl)
CREATE TABLE IF NOT EXISTS sinic_cr.col_mas_ccl (
    t_id        SERIAL PRIMARY KEY,
    terreno_id  INTEGER NOT NULL REFERENCES sinic_cr.cr_terreno(t_id) ON DELETE CASCADE,
    lindero_id  INTEGER NOT NULL REFERENCES sinic_cr.cr_lindero(t_id) ON DELETE RESTRICT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (terreno_id, lindero_id)
);
CREATE INDEX IF NOT EXISTS idx_col_mas_ccl_terreno ON sinic_cr.col_mas_ccl(terreno_id);

-- Relación terreno-lindero que resta área (col_menosCcl)
CREATE TABLE IF NOT EXISTS sinic_cr.col_menos_ccl (
    t_id        SERIAL PRIMARY KEY,
    terreno_id  INTEGER NOT NULL REFERENCES sinic_cr.cr_terreno(t_id) ON DELETE CASCADE,
    lindero_id  INTEGER NOT NULL REFERENCES sinic_cr.cr_lindero(t_id) ON DELETE RESTRICT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (terreno_id, lindero_id)
);
CREATE INDEX IF NOT EXISTS idx_col_menos_ccl_terreno ON sinic_cr.col_menos_ccl(terreno_id);

-- ============================================================
-- MÓDULO 5: CARTOGRAFÍA CATASTRAL
-- ============================================================

CREATE TABLE IF NOT EXISTS sinic_cr.cc_limite_municipio (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(10) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_cc_limite_dep CHECK (departamento ~ '^[0-9]{2}$'),
    CONSTRAINT chk_cc_limite_mun CHECK (municipio ~ '^[0-9]{3}$')
);
CREATE INDEX IF NOT EXISTS idx_cc_limite_municipio_geom ON sinic_cr.cc_limite_municipio USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_cc_limite_municipio_cod ON sinic_cr.cc_limite_municipio(codigo);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_sector_rural (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    zona            CHAR(2),
    sector          CHAR(2),
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_sector_rural_geom ON sinic_cr.cc_sector_rural USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_sector_urbano (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    zona            CHAR(2),
    sector          CHAR(2),
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_sector_urbano_geom ON sinic_cr.cc_sector_urbano USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_perimetro_urbano (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_perimetro_urbano_geom ON sinic_cr.cc_perimetro_urbano USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_vereda (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_vereda_geom ON sinic_cr.cc_vereda USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_corregimiento (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_corregimiento_geom ON sinic_cr.cc_corregimiento USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_localidad_comuna (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_localidad_comuna_geom ON sinic_cr.cc_localidad_comuna USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_centro_poblado (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_centro_poblado_geom ON sinic_cr.cc_centro_poblado USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_manzana (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255),
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    sector_id       INTEGER REFERENCES sinic_cr.cc_sector_urbano(t_id) ON DELETE SET NULL,
    barrio_id       INTEGER,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_manzana_geom ON sinic_cr.cc_manzana USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_cc_manzana_sector ON sinic_cr.cc_manzana(sector_id);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_barrio (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiPolygon, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_barrio_geom ON sinic_cr.cc_barrio USING GIST(geom);

CREATE TABLE IF NOT EXISTS sinic_cr.cc_nomenclatura_vial (
    t_id            SERIAL PRIMARY KEY,
    codigo          VARCHAR(20),
    nombre          VARCHAR(255) NOT NULL,
    tipo_via        VARCHAR(100),
    departamento    CHAR(2) NOT NULL,
    municipio       CHAR(3) NOT NULL,
    observacion     TEXT,
    geom            geometry(MultiLineString, 4326),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_cc_nomenclatura_vial_geom ON sinic_cr.cc_nomenclatura_vial USING GIST(geom);

-- FK diferida para cc_manzana.barrio_id (creada después de cc_barrio)
ALTER TABLE sinic_cr.cc_manzana
    ADD CONSTRAINT fk_manzana_barrio
    FOREIGN KEY (barrio_id) REFERENCES sinic_cr.cc_barrio(t_id) ON DELETE SET NULL;
