from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.topografia import (
    LinderoCreate, LinderoUpdate, PuntoLinderoCreate, PuntoLinderoUpdate,
    PuntoControlCreate, PuntoControlUpdate, PuntoCclCreate, MasCclCreate,
)
from app.services import topografia as svc
from app.utils.geo import wkb_to_geojson

router = APIRouter(prefix="/api/topografia", tags=["Topografía y Representación"])


def _lindero_to_dict(l) -> dict:
    return {
        "t_id": l.t_id, "tipo_lindero": l.tipo_lindero, "descripcion": l.descripcion,
        "longitud": float(l.longitud) if l.longitud else None,
        "geom": wkb_to_geojson(l.geom) if l.geom else None,
        "created_at": l.created_at.isoformat() if l.created_at else None,
        "updated_at": l.updated_at.isoformat() if l.updated_at else None,
        "deleted_at": l.deleted_at.isoformat() if l.deleted_at else None,
    }


def _punto_to_dict(p) -> dict:
    return {
        "t_id": p.t_id, "tipo_punto": p.tipo_punto, "descripcion": p.descripcion,
        "exactitud_horizontal": float(p.exactitud_horizontal) if p.exactitud_horizontal else None,
        "exactitud_vertical": float(p.exactitud_vertical) if p.exactitud_vertical else None,
        "geom": wkb_to_geojson(p.geom) if p.geom else None,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        "deleted_at": p.deleted_at.isoformat() if p.deleted_at else None,
    }


def _pc_to_dict(p) -> dict:
    return {
        "t_id": p.t_id, "codigo": p.codigo, "tipo_punto_control": p.tipo_punto_control,
        "descripcion": p.descripcion,
        "exactitud_horizontal": float(p.exactitud_horizontal) if p.exactitud_horizontal else None,
        "geom": wkb_to_geojson(p.geom) if p.geom else None,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        "deleted_at": p.deleted_at.isoformat() if p.deleted_at else None,
    }


# Linderos
@router.get("/linderos")
def listar_linderos(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    tipo: Optional[str] = None, db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_linderos(db, skip, size, tipo)
    return {"items": [_lindero_to_dict(l) for l in items], "total": total, "page": page, "size": size}


@router.get("/linderos/{lindero_id}")
def obtener_lindero(lindero_id: int, db: Session = Depends(get_db)):
    return _lindero_to_dict(svc.get_lindero(db, lindero_id))


@router.post("/linderos", status_code=201)
def crear_lindero(data: LinderoCreate, db: Session = Depends(get_db)):
    return _lindero_to_dict(svc.create_lindero(db, data))


@router.patch("/linderos/{lindero_id}")
def actualizar_lindero(lindero_id: int, data: LinderoUpdate, db: Session = Depends(get_db)):
    return _lindero_to_dict(svc.update_lindero(db, lindero_id, data))


@router.delete("/linderos/{lindero_id}")
def eliminar_lindero(lindero_id: int, db: Session = Depends(get_db)):
    return svc.delete_lindero(db, lindero_id)


# Puntos Lindero
@router.get("/puntos-lindero")
def listar_puntos_lindero(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_puntos_lindero(db, skip, size)
    return {"items": [_punto_to_dict(p) for p in items], "total": total, "page": page, "size": size}


@router.get("/puntos-lindero/{punto_id}")
def obtener_punto_lindero(punto_id: int, db: Session = Depends(get_db)):
    return _punto_to_dict(svc.get_punto_lindero(db, punto_id))


@router.post("/puntos-lindero", status_code=201)
def crear_punto_lindero(data: PuntoLinderoCreate, db: Session = Depends(get_db)):
    return _punto_to_dict(svc.create_punto_lindero(db, data))


@router.patch("/puntos-lindero/{punto_id}")
def actualizar_punto_lindero(punto_id: int, data: PuntoLinderoUpdate, db: Session = Depends(get_db)):
    return _punto_to_dict(svc.update_punto_lindero(db, punto_id, data))


@router.delete("/puntos-lindero/{punto_id}")
def eliminar_punto_lindero(punto_id: int, db: Session = Depends(get_db)):
    return svc.delete_punto_lindero(db, punto_id)


# Puntos Control
@router.get("/puntos-control")
def listar_puntos_control(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_puntos_control(db, skip, size, search)
    return {"items": [_pc_to_dict(p) for p in items], "total": total, "page": page, "size": size}


@router.get("/puntos-control/{pc_id}")
def obtener_punto_control(pc_id: int, db: Session = Depends(get_db)):
    return _pc_to_dict(svc.get_punto_control(db, pc_id))


@router.post("/puntos-control", status_code=201)
def crear_punto_control(data: PuntoControlCreate, db: Session = Depends(get_db)):
    return _pc_to_dict(svc.create_punto_control(db, data))


@router.patch("/puntos-control/{pc_id}")
def actualizar_punto_control(pc_id: int, data: PuntoControlUpdate, db: Session = Depends(get_db)):
    return _pc_to_dict(svc.update_punto_control(db, pc_id, data))


@router.delete("/puntos-control/{pc_id}")
def eliminar_punto_control(pc_id: int, db: Session = Depends(get_db)):
    return svc.delete_punto_control(db, pc_id)


# Relaciones
@router.post("/punto-ccl", status_code=201)
def crear_punto_ccl(data: PuntoCclCreate, db: Session = Depends(get_db)):
    r = svc.create_punto_ccl(db, data)
    return {"t_id": r.t_id, "lindero_id": r.lindero_id, "punto_lindero_id": r.punto_lindero_id}


@router.post("/mas-ccl", status_code=201)
def crear_mas_ccl(data: MasCclCreate, db: Session = Depends(get_db)):
    r = svc.create_mas_ccl(db, data)
    return {"t_id": r.t_id, "terreno_id": r.terreno_id, "lindero_id": r.lindero_id}


@router.get("/dominios/tipo-lindero")
def dominios_tipo_lindero():
    return ["Definido", "No_Definido"]


@router.get("/dominios/tipo-punto")
def dominios_tipo_punto():
    return [
        "Catastro.Poste", "Catastro.Construccion", "Catastro.Punto_Dinamico",
        "Catastro.Elemento_Natural", "Catastro.Piedra", "Catastro.Sin_Materializacion",
        "Catastro.Mojon", "Catastro.Incrustacion", "Catastro.Pilastra", "Control"
    ]
