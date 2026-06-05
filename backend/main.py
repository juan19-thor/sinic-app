from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.routers.unidad_administrativa import router as ua_router
from app.routers.unidad_espacial import router as ue_router
from app.routers.interesados import router as int_router
from app.routers.topografia import router as topo_router
from app.routers.cartografia import router as carto_router

app = FastAPI(
    title="SINIC API - Modelo de Datos LADM_COL SINIC V1.0",
    description="""
## API REST para gestión de datos catastrales conforme al Modelo de Aplicación LADM_COL SINIC V1.0.

### Módulos disponibles:
- **Unidad Administrativa**: Predios y trámites catastrales
- **Unidad Espacial**: Terrenos y unidades de construcción con geometría
- **Interesados**: Personas naturales, jurídicas y agrupaciones
- **Topografía y Representación**: Linderos, puntos y relaciones topográficas
- **Cartografía Catastral**: Capas cartográficas del submodelo SINIC

### Referencia:
Instructivo para la Estructuración de la Información Catastral - IGAC 2025.
SRID almacenamiento: EPSG:4326 (WGS84).
SRID producción oficial: EPSG:9377 (MAGNA-SIRGAS Colombia).
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ua_router)
app.include_router(ue_router)
app.include_router(int_router)
app.include_router(topo_router)
app.include_router(carto_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "mensaje": "SINIC API - LADM_COL SINIC V1.0",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Root"])
def health():
    return {"status": "ok"}
