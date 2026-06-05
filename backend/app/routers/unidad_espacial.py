from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.unidad_espacial import (
    TerrenoCreate, TerrenoUpdate,
    UnidadConstruccionCreate, UnidadConstruccionUpdate,
    CaracteristicasUCCreate, CaracteristicasUCUpdate,
)
from app.services import unidad_espacial as svc
from app.utils.geo import wkb_to_geojson

router = APIRouter(prefix="/api/unidad-espacial", tags=["Unidad Espacial"])


def _terreno_to_dict(t) -> dict:
    return {
        "t_id": t.t_id,
        "area_geometrica": float(t.area_geometrica) if t.area_geometrica else None,
        "area_catastral": float(t.area_catastral) if t.area_catastral else None,
        "condicion_predio": t.condicion_predio,
        "tipo_terreno": t.tipo_terreno,
        "geom": wkb_to_geojson(t.geom) if t.geom else None,
        "observaciones": t.observaciones,
        "created_at": t.created_at.isoformat() if t.created_at else None,
        "updated_at": t.updated_at.isoformat() if t.updated_at else None,
        "deleted_at": t.deleted_at.isoformat() if t.deleted_at else None,
    }


def _uc_to_dict(uc) -> dict:
    return {
        "t_id": uc.t_id,
        "terreno_id": uc.terreno_id,
        "tipo_construccion": uc.tipo_construccion,
        "numero_pisos": uc.numero_pisos,
        "area_construida": float(uc.area_construida) if uc.area_construida else None,
        "uso": uc.uso,
        "estado_conservacion": uc.estado_conservacion,
        "identificador": uc.identificador,
        "geom": wkb_to_geojson(uc.geom) if uc.geom else None,
        "observaciones": uc.observaciones,
        "created_at": uc.created_at.isoformat() if uc.created_at else None,
        "updated_at": uc.updated_at.isoformat() if uc.updated_at else None,
        "deleted_at": uc.deleted_at.isoformat() if uc.deleted_at else None,
    }


# Terrenos
@router.get("/terrenos")
def listar_terrenos(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    condicion: Optional[str] = None,
    tipo: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_terrenos(db, skip, size, condicion, tipo)
    return {"items": [_terreno_to_dict(t) for t in items], "total": total, "page": page, "size": size}


@router.get("/terrenos/{terreno_id}")
def obtener_terreno(terreno_id: int, db: Session = Depends(get_db)):
    return _terreno_to_dict(svc.get_terreno(db, terreno_id))


@router.post("/terrenos", status_code=201)
def crear_terreno(data: TerrenoCreate, db: Session = Depends(get_db)):
    return _terreno_to_dict(svc.create_terreno(db, data))


@router.patch("/terrenos/{terreno_id}")
def actualizar_terreno(terreno_id: int, data: TerrenoUpdate, db: Session = Depends(get_db)):
    return _terreno_to_dict(svc.update_terreno(db, terreno_id, data))


@router.delete("/terrenos/{terreno_id}")
def eliminar_terreno(terreno_id: int, db: Session = Depends(get_db)):
    return svc.delete_terreno(db, terreno_id)


# Unidades de Construcción
@router.get("/unidades-construccion")
def listar_unidades_construccion(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    terreno_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_unidades_construccion(db, skip, size, terreno_id)
    return {"items": [_uc_to_dict(uc) for uc in items], "total": total, "page": page, "size": size}


@router.get("/unidades-construccion/{uc_id}")
def obtener_unidad_construccion(uc_id: int, db: Session = Depends(get_db)):
    return _uc_to_dict(svc.get_unidad_construccion(db, uc_id))


@router.post("/unidades-construccion", status_code=201)
def crear_unidad_construccion(data: UnidadConstruccionCreate, db: Session = Depends(get_db)):
    return _uc_to_dict(svc.create_unidad_construccion(db, data))


@router.patch("/unidades-construccion/{uc_id}")
def actualizar_unidad_construccion(uc_id: int, data: UnidadConstruccionUpdate, db: Session = Depends(get_db)):
    return _uc_to_dict(svc.update_unidad_construccion(db, uc_id, data))


@router.delete("/unidades-construccion/{uc_id}")
def eliminar_unidad_construccion(uc_id: int, db: Session = Depends(get_db)):
    return svc.delete_unidad_construccion(db, uc_id)


# Dominios
@router.get("/dominios/tipo-construccion")
def dominios_tipo_construccion():
    return ["Convencional", "No_Convencional"]


@router.get("/dominios/uso-construccion")
def dominios_uso():
    return ["Residencial", "Comercial", "Industrial", "Dotacional", "Mixto"]


@router.get("/dominios/estado-conservacion")
def dominios_estado_conservacion():
    return ["Bueno", "Regular", "Malo", "Ruinoso"]
