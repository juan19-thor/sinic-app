from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.models.topografia import CrLindero, CrPuntoLindero, CrPuntoControl, ColPuntoCcl, ColMasCcl, ColMenosCcl
from app.schemas.topografia import (
    LinderoCreate, LinderoUpdate, PuntoLinderoCreate, PuntoLinderoUpdate,
    PuntoControlCreate, PuntoControlUpdate, PuntoCclCreate, MasCclCreate,
)
from app.services.base import apply_geom
from fastapi import HTTPException


def get_linderos(db: Session, skip: int = 0, limit: int = 20, tipo: Optional[str] = None):
    query = db.query(CrLindero).filter(CrLindero.deleted_at.is_(None))
    if tipo:
        query = query.filter(CrLindero.tipo_lindero == tipo)
    total = query.count()
    items = query.order_by(CrLindero.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_lindero(db: Session, lindero_id: int) -> CrLindero:
    obj = db.query(CrLindero).filter(CrLindero.t_id == lindero_id, CrLindero.deleted_at.is_(None)).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Lindero {lindero_id} no encontrado")
    return obj


def create_lindero(db: Session, data: LinderoCreate) -> CrLindero:
    obj = CrLindero(**data.model_dump(exclude={"geom"}))
    apply_geom(obj, data.geom)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_lindero(db: Session, lindero_id: int, data: LinderoUpdate) -> CrLindero:
    obj = get_lindero(db, lindero_id)
    for field, value in data.model_dump(exclude_unset=True, exclude={"geom"}).items():
        setattr(obj, field, value)
    if "geom" in data.model_dump(exclude_unset=True):
        apply_geom(obj, data.geom)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_lindero(db: Session, lindero_id: int):
    obj = get_lindero(db, lindero_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Lindero eliminado"}


# Puntos Lindero
def get_puntos_lindero(db: Session, skip: int = 0, limit: int = 20):
    query = db.query(CrPuntoLindero).filter(CrPuntoLindero.deleted_at.is_(None))
    total = query.count()
    items = query.order_by(CrPuntoLindero.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_punto_lindero(db: Session, punto_id: int) -> CrPuntoLindero:
    obj = db.query(CrPuntoLindero).filter(
        CrPuntoLindero.t_id == punto_id, CrPuntoLindero.deleted_at.is_(None)
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Punto lindero {punto_id} no encontrado")
    return obj


def create_punto_lindero(db: Session, data: PuntoLinderoCreate) -> CrPuntoLindero:
    obj = CrPuntoLindero(**data.model_dump(exclude={"geom"}))
    apply_geom(obj, data.geom)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_punto_lindero(db: Session, punto_id: int, data: PuntoLinderoUpdate) -> CrPuntoLindero:
    obj = get_punto_lindero(db, punto_id)
    for field, value in data.model_dump(exclude_unset=True, exclude={"geom"}).items():
        setattr(obj, field, value)
    if "geom" in data.model_dump(exclude_unset=True):
        apply_geom(obj, data.geom)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_punto_lindero(db: Session, punto_id: int):
    obj = get_punto_lindero(db, punto_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Punto lindero eliminado"}


# Puntos Control
def get_puntos_control(db: Session, skip: int = 0, limit: int = 20, search: Optional[str] = None):
    query = db.query(CrPuntoControl).filter(CrPuntoControl.deleted_at.is_(None))
    if search:
        query = query.filter(CrPuntoControl.codigo.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(CrPuntoControl.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_punto_control(db: Session, pc_id: int) -> CrPuntoControl:
    obj = db.query(CrPuntoControl).filter(
        CrPuntoControl.t_id == pc_id, CrPuntoControl.deleted_at.is_(None)
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Punto control {pc_id} no encontrado")
    return obj


def create_punto_control(db: Session, data: PuntoControlCreate) -> CrPuntoControl:
    obj = CrPuntoControl(**data.model_dump(exclude={"geom"}))
    apply_geom(obj, data.geom)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_punto_control(db: Session, pc_id: int, data: PuntoControlUpdate) -> CrPuntoControl:
    obj = get_punto_control(db, pc_id)
    for field, value in data.model_dump(exclude_unset=True, exclude={"geom"}).items():
        setattr(obj, field, value)
    if "geom" in data.model_dump(exclude_unset=True):
        apply_geom(obj, data.geom)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_punto_control(db: Session, pc_id: int):
    obj = get_punto_control(db, pc_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Punto control eliminado"}


# Relaciones
def create_punto_ccl(db: Session, data: PuntoCclCreate) -> ColPuntoCcl:
    existing = db.query(ColPuntoCcl).filter(
        ColPuntoCcl.lindero_id == data.lindero_id,
        ColPuntoCcl.punto_lindero_id == data.punto_lindero_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="La relación punto-lindero ya existe")
    obj = ColPuntoCcl(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def create_mas_ccl(db: Session, data: MasCclCreate) -> ColMasCcl:
    existing = db.query(ColMasCcl).filter(
        ColMasCcl.terreno_id == data.terreno_id,
        ColMasCcl.lindero_id == data.lindero_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="La relación terreno-lindero (mas_ccl) ya existe")
    obj = ColMasCcl(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
