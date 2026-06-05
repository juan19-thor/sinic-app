from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.unidad_administrativa import (
    PredioCreate, PredioUpdate, PredioResponse, PredioListResponse,
    TramiteCatastralCreate, TramiteCatastralUpdate, TramiteCatastralResponse,
)
from app.services import unidad_administrativa as svc
from app.utils.geo import wkb_to_geojson

router = APIRouter(prefix="/api/unidad-administrativa", tags=["Unidad Administrativa"])


def _predio_to_dict(p) -> dict:
    return {
        "t_id": p.t_id,
        "departamento": p.departamento,
        "municipio": p.municipio,
        "numero_predial_nacional": p.numero_predial_nacional,
        "numero_predial_anterior": p.numero_predial_anterior,
        "nupre": p.nupre,
        "codigo_orip": p.codigo_orip,
        "matricula_inmobiliaria": p.matricula_inmobiliaria,
        "codigo_homologado": p.codigo_homologado,
        "tipo_predio": p.tipo_predio,
        "condicion_predio": p.condicion_predio,
        "destinacion_economica": p.destinacion_economica,
        "area_catastral_terreno": float(p.area_catastral_terreno) if p.area_catastral_terreno else None,
        "area_registral_m2": float(p.area_registral_m2) if p.area_registral_m2 else None,
        "fecha_inscripcion_catastral": p.fecha_inscripcion_catastral.isoformat() if p.fecha_inscripcion_catastral else None,
        "vigencia_actualizacion_catastral": p.vigencia_actualizacion_catastral.isoformat() if p.vigencia_actualizacion_catastral else None,
        "direccion": p.direccion,
        "estado": p.estado,
        "observaciones": p.observaciones,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        "deleted_at": p.deleted_at.isoformat() if p.deleted_at else None,
    }


@router.get("/predios")
def listar_predios(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None,
    municipio: Optional[str] = None,
    estado: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_predios(db, skip, size, departamento, municipio, estado, search)
    return {
        "items": [_predio_to_dict(p) for p in items],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/predios/{predio_id}")
def obtener_predio(predio_id: int, db: Session = Depends(get_db)):
    return _predio_to_dict(svc.get_predio(db, predio_id))


@router.post("/predios", status_code=201)
def crear_predio(data: PredioCreate, db: Session = Depends(get_db)):
    return _predio_to_dict(svc.create_predio(db, data))


@router.patch("/predios/{predio_id}")
def actualizar_predio(predio_id: int, data: PredioUpdate, db: Session = Depends(get_db)):
    return _predio_to_dict(svc.update_predio(db, predio_id, data))


@router.delete("/predios/{predio_id}")
def eliminar_predio(predio_id: int, db: Session = Depends(get_db)):
    return svc.delete_predio(db, predio_id)


# Trámites
@router.get("/tramites")
def listar_tramites(
    predio_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_tramites(db, predio_id, skip, size)
    return {
        "items": [
            {
                "t_id": t.t_id, "predio_id": t.predio_id, "tipo_tramite": t.tipo_tramite,
                "numero_tramite": t.numero_tramite,
                "fecha_tramite": t.fecha_tramite.isoformat() if t.fecha_tramite else None,
                "fecha_inscripcion": t.fecha_inscripcion.isoformat() if t.fecha_inscripcion else None,
                "descripcion": t.descripcion, "estado_tramite": t.estado_tramite,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None,
            }
            for t in items
        ],
        "total": total, "page": page, "size": size,
    }


@router.post("/tramites", status_code=201)
def crear_tramite(data: TramiteCatastralCreate, db: Session = Depends(get_db)):
    t = svc.create_tramite(db, data)
    return {
        "t_id": t.t_id, "predio_id": t.predio_id, "tipo_tramite": t.tipo_tramite,
        "numero_tramite": t.numero_tramite,
        "fecha_tramite": t.fecha_tramite.isoformat() if t.fecha_tramite else None,
        "estado_tramite": t.estado_tramite,
        "created_at": t.created_at.isoformat() if t.created_at else None,
    }


@router.patch("/tramites/{tramite_id}")
def actualizar_tramite(tramite_id: int, data: TramiteCatastralUpdate, db: Session = Depends(get_db)):
    t = svc.update_tramite(db, tramite_id, data)
    return {"t_id": t.t_id, "tipo_tramite": t.tipo_tramite, "estado_tramite": t.estado_tramite}


@router.delete("/tramites/{tramite_id}")
def eliminar_tramite(tramite_id: int, db: Session = Depends(get_db)):
    return svc.delete_tramite(db, tramite_id)


# Dominios
@router.get("/dominios/tipo-predio")
def dominios_tipo_predio():
    return [
        "NPH", "PH", "Condominio", "Parque_Cementerio",
        "Via", "Bien_Baldio", "Paramo"
    ]


@router.get("/dominios/condicion-predio")
def dominios_condicion_predio():
    return [
        "Formalidad", "Informalidad_Posesion", "Informalidad_Ocupacion",
        "Informalidad_Titulo_Sin_Registrar", "Informalidad_Sucesion", "Informalidad_Posesion_Hecho"
    ]


@router.get("/dominios/destinacion-economica")
def dominios_destinacion_economica():
    return [
        "Habitacional", "Comercial", "Industrial", "Agropecuario",
        "Minero", "Cultural", "Recreacional", "Salubridad",
        "Institucional", "Educativo", "Religioso", "Servicios_Especiales",
        "Lote", "En_Construccion"
    ]
