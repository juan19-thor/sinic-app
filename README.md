# SINIC-APP — Modelo de Datos LADM_COL SINIC V1.0

Aplicación web para la gestión de datos catastrales conforme al **Modelo de Aplicación LADM_COL SINIC V1.0** del Instituto Geográfico Agustín Codazzi (IGAC), adoptado mediante Resolución 301 de 2025.

## Alcance

Esta aplicación cubre **únicamente** la sección **"Modelo de Datos SINIC"**, con los siguientes módulos CRUD:

| Módulo | Entidades |
|--------|-----------|
| **Unidad Administrativa** | SINIC_Predio, CR_TramiteCatastral |
| **Unidad Espacial** | CR_Terreno, CR_UnidadConstruccion |
| **Interesados** | CR_Interesado, CR_AgrupacionInteresados |
| **Topografía y Representación** | CR_Lindero, CR_PuntoLindero, CR_PuntoControl |
| **Cartografía Catastral** | CC_LimiteMunicipio, CC_SectorRural, CC_SectorUrbano, CC_PerimetroUrbano, CC_Vereda, CC_Corregimiento, CC_LocalidadComuna, CC_CentroPoblado, CC_Manzana, CC_Barrio, CC_NomenclaturaVial |

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript + Leaflet |
| Backend | FastAPI (Python 3.11) + SQLAlchemy + GeoAlchemy2 |
| Base de datos | PostgreSQL 16 + PostGIS 3.4 |
| Contenedores | Docker + Docker Compose |
| SRID web | EPSG:4326 (WGS84) |
| SRID oficial | EPSG:9377 (MAGNA-SIRGAS Colombia) |

## Estructura del Proyecto

```
sinic-app/
├── backend/           # API FastAPI
│   ├── app/
│   │   ├── routers/   # Endpoints REST
│   │   ├── models/    # Modelos SQLAlchemy
│   │   ├── schemas/   # Schemas Pydantic
│   │   ├── services/  # Lógica de negocio
│   │   ├── database/  # Conexión DB
│   │   └── utils/     # Geo helpers y validadores
│   ├── main.py
│   └── requirements.txt
├── frontend/          # App React + Vite
│   └── src/
│       ├── components/  # Mapa, Modal, Sidebar
│       ├── pages/       # CRUD por módulo
│       ├── services/    # Axios API client
│       └── types/       # TypeScript types
├── database/
│   ├── init.sql       # Schema + tablas + índices
│   ├── seed.sql       # Datos de prueba
│   └── backup_instructions.md
└── docker-compose.yml
```

## Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd sinic-app

# 2. Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Levantar todos los servicios
docker compose up -d --build

# 4. Verificar que los servicios están corriendo
docker compose ps

# 5. Ver logs
docker compose logs -f backend
```

Acceder a:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000
- **Swagger**: http://localhost:8000/docs

### Opción 2: Ejecución Local

#### Base de Datos

```bash
# Instalar PostgreSQL + PostGIS
# Crear base de datos
createdb sinic_db
psql -d sinic_db -c "CREATE USER sinic_user WITH PASSWORD 'sinic_pass';"
psql -d sinic_db -c "GRANT ALL PRIVILEGES ON DATABASE sinic_db TO sinic_user;"

# Crear esquema y tablas
psql -U sinic_user -d sinic_db -f database/init.sql

# Cargar datos de prueba
psql -U sinic_user -d sinic_db -f database/seed.sql
```

#### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env
# Editar .env con los datos de su PostgreSQL

# Ejecutar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
copy .env.example .env

# Ejecutar servidor de desarrollo
npm run dev
```

## Migraciones con Alembic

```bash
cd backend

# Inicializar Alembic (solo primera vez)
alembic init alembic

# Generar migración automática
alembic revision --autogenerate -m "initial_schema"

# Aplicar migraciones
alembic upgrade head

# Ver historial
alembic history
```

## Cargar Datos de Prueba

```bash
# Con psql
psql -U sinic_user -d sinic_db -f database/seed.sql

# Con Docker
docker exec -i sinic_postgres psql -U sinic_user -d sinic_db < database/seed.sql
```

Los datos de prueba incluyen:
- 1 Límite Municipal (Bogotá D.C.)
- 1 Sector Urbano, 1 Barrio, 1 Manzana
- 1 Nomenclatura Vial
- 1 Terreno con geometría
- 1 Predio asociado al terreno
- 1 Unidad de Construcción
- 1 Interesado (persona natural)
- 1 Lindero con 2 puntos de lindero
- 1 Punto de control geodésico
- 1 Trámite catastral

## Endpoints Principales

```
GET  /api/unidad-administrativa/predios
POST /api/unidad-administrativa/predios
GET  /api/unidad-administrativa/predios/{id}
PATCH /api/unidad-administrativa/predios/{id}
DELETE /api/unidad-administrativa/predios/{id}

GET  /api/unidad-espacial/terrenos
POST /api/unidad-espacial/terrenos
GET  /api/unidad-espacial/unidades-construccion

GET  /api/interesados
POST /api/interesados
GET  /api/agrupaciones-interesados

GET  /api/topografia/linderos
GET  /api/topografia/puntos-lindero
GET  /api/topografia/puntos-control

GET  /api/cartografia/limite-municipio
GET  /api/cartografia/sector-rural
GET  /api/cartografia/sector-urbano
GET  /api/cartografia/perimetro-urbano
GET  /api/cartografia/veredas
GET  /api/cartografia/corregimientos
GET  /api/cartografia/localidades-comunas
GET  /api/cartografia/centros-poblados
GET  /api/cartografia/manzanas
GET  /api/cartografia/barrios
GET  /api/cartografia/nomenclatura-vial
```

Documentación completa: **http://localhost:8000/docs**

## Backup de la Base de Datos

```bash
# Generar backup
docker exec sinic_postgres pg_dump -U sinic_user -d sinic_db -F c -f /tmp/sinic_backup.dump
docker cp sinic_postgres:/tmp/sinic_backup.dump ./sinic_backup.dump

# Restaurar backup
docker cp sinic_backup.dump sinic_postgres:/tmp/
docker exec sinic_postgres pg_restore -U sinic_user -d sinic_db -F c --clean /tmp/sinic_backup.dump
```

Ver instrucciones detalladas en [database/backup_instructions.md](database/backup_instructions.md).

## Notas de Conformidad LADM_COL SINIC V1.0

1. **Nomenclatura**: Los nombres de tablas y campos siguen la convención del modelo SINIC V1.0 (snake_case).
2. **SRID**: Se usa EPSG:4326 para compatibilidad web. El modelo oficial especifica EPSG:9377.
3. **NPN**: Validación de 30 dígitos según la estructura oficial (Dpto 2 + Mpio 3 + Zona 2 + Sector 2 + Comuna 2 + Barrio 2 + Manzana 4 + Terreno 4 + Condición 1 + Torre 2 + Piso 2 + Unidad 4).
4. **Borrado lógico**: Implementado con `deleted_at` para preservar integridad referencial.
5. **Dominios**: Implementados como restricciones FK a tablas de dominio y validación en Pydantic.
6. **Geometrías**: Índices GiST para todas las columnas `geom`. Aceptan y devuelven GeoJSON.
7. **Relaciones**: `col_uebaunit` (predio-terreno), `col_punto_ccl` (lindero-punto), `col_mas_ccl`/`col_menos_ccl` (terreno-lindero).
8. **Auditoría**: Campos `created_at` y `updated_at` en todas las tablas.

> **Nota académica**: Este proyecto es una implementación funcional para propósitos académicos. Para producción oficial, debe ajustarse contra el Diccionario de Datos LADM_COL SINIC V1.0 oficial del IGAC.

## Repositorio GitHub

Publicar con:
```bash
git init
git add .
git commit -m "feat: SINIC App - Modelo de Datos LADM_COL SINIC V1.0"
git branch -M main
git remote add origin <url-github>
git push -u origin main
```
