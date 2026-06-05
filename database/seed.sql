-- ============================================================
-- SEED: Datos de prueba SINIC V1.0
-- Municipio ejemplo: Bogotá D.C. (11001)
-- ============================================================

SET search_path TO sinic_cr, public;

-- Cartografía base (Bogotá)
INSERT INTO sinic_cr.cc_limite_municipio (codigo, nombre, departamento, municipio, observacion, geom)
VALUES (
    '11001',
    'Bogotá D.C.',
    '11',
    '001',
    'Límite municipal ejemplo - geometría simplificada',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-74.224, 4.459],
            [-73.994, 4.459],
            [-73.994, 4.837],
            [-74.224, 4.837],
            [-74.224, 4.459]
        ]]
    }'))::geometry(MultiPolygon, 4326)
) ON CONFLICT DO NOTHING;

INSERT INTO sinic_cr.cc_sector_urbano (codigo, nombre, departamento, municipio, zona, sector, observacion, geom)
VALUES (
    '1100101',
    'Sector Urbano Centro',
    '11',
    '001',
    '01',
    '01',
    'Sector urbano ejemplo',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-74.090, 4.590],
            [-74.060, 4.590],
            [-74.060, 4.620],
            [-74.090, 4.620],
            [-74.090, 4.590]
        ]]
    }'))::geometry(MultiPolygon, 4326)
) ON CONFLICT DO NOTHING;

INSERT INTO sinic_cr.cc_barrio (codigo, nombre, departamento, municipio, observacion, geom)
VALUES (
    '1100101001201',
    'La Candelaria',
    '11',
    '001',
    'Barrio histórico ejemplo',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-74.080, 4.595],
            [-74.070, 4.595],
            [-74.070, 4.605],
            [-74.080, 4.605],
            [-74.080, 4.595]
        ]]
    }'))::geometry(MultiPolygon, 4326)
) ON CONFLICT DO NOTHING;

INSERT INTO sinic_cr.cc_manzana (codigo, nombre, departamento, municipio, observacion, geom)
VALUES (
    '1100101001201001',
    'Manzana 001',
    '11',
    '001',
    'Manzana catastral ejemplo',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-74.078, 4.598],
            [-74.074, 4.598],
            [-74.074, 4.602],
            [-74.078, 4.602],
            [-74.078, 4.598]
        ]]
    }'))::geometry(MultiPolygon, 4326)
) ON CONFLICT DO NOTHING;

INSERT INTO sinic_cr.cc_nomenclatura_vial (codigo, nombre, tipo_via, departamento, municipio, observacion, geom)
VALUES (
    'CL7',
    'Calle 7',
    'Calle',
    '11',
    '001',
    'Nomenclatura vial ejemplo',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [-74.082, 4.598],
            [-74.070, 4.598]
        ]
    }'))::geometry(MultiLineString, 4326)
) ON CONFLICT DO NOTHING;

-- Terreno ejemplo
INSERT INTO sinic_cr.cr_terreno (area_geometrica, area_catastral, condicion_predio, tipo_terreno, geom, observaciones)
VALUES (
    150.00,
    150.00,
    'Formalidad',
    'Privado',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-74.0762, 4.5993],
            [-74.0753, 4.5993],
            [-74.0753, 4.6000],
            [-74.0762, 4.6000],
            [-74.0762, 4.5993]
        ]]
    }'))::geometry(MultiPolygon, 4326),
    'Terreno de prueba - Bogotá'
);

-- Predio asociado al terreno
INSERT INTO sinic_cr.sinic_predio (
    departamento, municipio, numero_predial_nacional,
    nupre, codigo_orip, matricula_inmobiliaria,
    tipo_predio, condicion_predio, destinacion_economica,
    area_catastral_terreno, area_registral_m2,
    fecha_inscripcion_catastral, vigencia_actualizacion_catastral,
    direccion, estado
) VALUES (
    '11', '001',
    '110001010112010010000100000000',
    'NUPRE-001-2025',
    '11C',
    '50N-123456',
    'NPH',
    'Formalidad',
    'Habitacional',
    150.00,
    148.50,
    '2020-01-15',
    '2025-01-01',
    'Calle 7 # 4-22 Bogotá D.C.',
    'Activo'
);

-- Relación predio-terreno
DO $$
DECLARE
    v_predio_id INTEGER;
    v_terreno_id INTEGER;
BEGIN
    SELECT t_id INTO v_predio_id FROM sinic_cr.sinic_predio WHERE numero_predial_nacional = '110001010112010010000100000000' LIMIT 1;
    SELECT t_id INTO v_terreno_id FROM sinic_cr.cr_terreno WHERE observaciones = 'Terreno de prueba - Bogotá' LIMIT 1;
    IF v_predio_id IS NOT NULL AND v_terreno_id IS NOT NULL THEN
        INSERT INTO sinic_cr.col_uebaunit (predio_id, terreno_id) VALUES (v_predio_id, v_terreno_id) ON CONFLICT DO NOTHING;
    END IF;
END;
$$;

-- Unidad de construcción
INSERT INTO sinic_cr.cr_unidad_construccion (
    terreno_id, tipo_construccion, numero_pisos,
    area_construida, uso, estado_conservacion, identificador,
    geom, observaciones
)
SELECT
    t_id,
    'Convencional', 2, 120.00,
    'Residencial', 'Bueno', 'UC-001',
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-74.0761, 4.5994],
            [-74.0754, 4.5994],
            [-74.0754, 4.5999],
            [-74.0761, 4.5999],
            [-74.0761, 4.5994]
        ]]
    }'))::geometry(MultiPolygon, 4326),
    'Unidad de construcción de prueba'
FROM sinic_cr.cr_terreno WHERE observaciones = 'Terreno de prueba - Bogotá' LIMIT 1;

-- Interesado
INSERT INTO sinic_cr.cr_interesado (
    tipo_interesado, tipo_documento, numero_documento,
    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    correo, telefono, direccion_notificacion
) VALUES (
    'Persona_Natural', 'CC', '12345678',
    'Juan', 'Carlos', 'García', 'López',
    'juan.garcia@ejemplo.com', '3001234567',
    'Calle 7 # 4-22 Bogotá D.C.'
) ON CONFLICT (tipo_documento, numero_documento) DO NOTHING;

-- Lindero
INSERT INTO sinic_cr.cr_lindero (tipo_lindero, descripcion, longitud, geom)
VALUES (
    'Definido',
    'Lindero norte del predio ejemplo',
    78.5,
    ST_Multi(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [-74.0762, 4.6000],
            [-74.0753, 4.6000]
        ]
    }'))::geometry(MultiLineString, 4326)
);

-- Puntos de lindero
INSERT INTO sinic_cr.cr_punto_lindero (tipo_punto, descripcion, exactitud_horizontal, geom)
VALUES
    ('Catastro.Mojon', 'Punto NW del predio ejemplo', 0.05,
     ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-74.0762, 4.6000]}')::geometry(Point, 4326)),
    ('Catastro.Mojon', 'Punto NE del predio ejemplo', 0.05,
     ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-74.0753, 4.6000]}')::geometry(Point, 4326));

-- Relación lindero-puntos
DO $$
DECLARE
    v_lindero_id INTEGER;
    v_pt1_id INTEGER;
    v_pt2_id INTEGER;
BEGIN
    SELECT t_id INTO v_lindero_id FROM sinic_cr.cr_lindero WHERE descripcion = 'Lindero norte del predio ejemplo' LIMIT 1;
    SELECT t_id INTO v_pt1_id FROM sinic_cr.cr_punto_lindero WHERE descripcion = 'Punto NW del predio ejemplo' LIMIT 1;
    SELECT t_id INTO v_pt2_id FROM sinic_cr.cr_punto_lindero WHERE descripcion = 'Punto NE del predio ejemplo' LIMIT 1;
    IF v_lindero_id IS NOT NULL AND v_pt1_id IS NOT NULL THEN
        INSERT INTO sinic_cr.col_punto_ccl (lindero_id, punto_lindero_id) VALUES (v_lindero_id, v_pt1_id) ON CONFLICT DO NOTHING;
    END IF;
    IF v_lindero_id IS NOT NULL AND v_pt2_id IS NOT NULL THEN
        INSERT INTO sinic_cr.col_punto_ccl (lindero_id, punto_lindero_id) VALUES (v_lindero_id, v_pt2_id) ON CONFLICT DO NOTHING;
    END IF;
END;
$$;

-- Relación terreno-lindero (col_mas_ccl)
DO $$
DECLARE
    v_terreno_id INTEGER;
    v_lindero_id INTEGER;
BEGIN
    SELECT t_id INTO v_terreno_id FROM sinic_cr.cr_terreno WHERE observaciones = 'Terreno de prueba - Bogotá' LIMIT 1;
    SELECT t_id INTO v_lindero_id FROM sinic_cr.cr_lindero WHERE descripcion = 'Lindero norte del predio ejemplo' LIMIT 1;
    IF v_terreno_id IS NOT NULL AND v_lindero_id IS NOT NULL THEN
        INSERT INTO sinic_cr.col_mas_ccl (terreno_id, lindero_id) VALUES (v_terreno_id, v_lindero_id) ON CONFLICT DO NOTHING;
    END IF;
END;
$$;

-- Punto de control
INSERT INTO sinic_cr.cr_punto_control (codigo, tipo_punto_control, descripcion, exactitud_horizontal, geom)
VALUES (
    'PC-BOG-001',
    'Control',
    'Punto de control geodésico Bogotá ejemplo',
    0.02,
    ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-74.0800, 4.6100]}')::geometry(Point, 4326)
) ON CONFLICT DO NOTHING;

-- Trámite catastral
DO $$
DECLARE v_predio_id INTEGER;
BEGIN
    SELECT t_id INTO v_predio_id FROM sinic_cr.sinic_predio WHERE numero_predial_nacional = '110001010112010010000100000000' LIMIT 1;
    IF v_predio_id IS NOT NULL THEN
        INSERT INTO sinic_cr.cr_tramite_catastral (predio_id, tipo_tramite, numero_tramite, fecha_tramite, descripcion, estado_tramite)
        VALUES (v_predio_id, 'Actualización Catastral', 'TC-2025-001', '2025-01-15', 'Actualización de áreas y linderos', 'Activo');
    END IF;
END;
$$;

SELECT 'Seed completado exitosamente' AS resultado;
