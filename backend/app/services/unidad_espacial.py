from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.models.unidad_espacial import CrTerreno, CrUnidadConstruccion, CrCaracteristicasUnidadConstruccion
from app.schemas.unidad_espacial import (
    TerrenoCreate, TerrenoUpdate,
    UnidadConstruccionCreate, UnidadConstruccionUpdate,
    CaracteristicasUCCreate, CaracteristicasUCUpdate,
)
from app.services.base import apply_geom, serialize_row
from app.utils.geo import wkb_to_geojson
from fastapi import HTTPException


def _serialize_terreno(t: CrTerreno) -> dict:
    d = {c.name: getattr(t, c.name) for c in t.__table__.columns}
    d["geom"] = wkb_to_geojson(t.geom) if t.geom is not None else None
    return d


def get_terrenos(db: Session, skip: int = 0, limit: int = 20,
                 condicion: Optional[str] = None, tipo: Optional[str] = None):
    query = db.query(CrTerreno).filter(CrTerreno.deleted_at.is_(None))
    if condicion:
        query = query.filter(CrTerreno.condicion_predio == condicion)
    if tipo:
        query = query.filter(CrTerreno.tipo_terreno == tipo)
    total = query.count()
    items = query.order_by(CrTerreno.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_terreno(db: Session, terreno_id: int) -> CrTerreno:
    t = db.query(CrTerreno).filter(
        CrTerreno.t_id == terreno_id, CrTerreno.deleted_at.is_(None)
    ).first()
    if not t:
        raise HTTPException(status_code=404, detail=f"Terreno {terreno_id} no encontrado")
    return t


def create_terreno(db: Session, data: TerrenoCreate) -> CrTerreno:
    obj = CrTerreno(**data.model_dump(exclude={"geom"}))
    apply_geom(obj, data.geom)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_terreno(db: Session, terreno_id: int, data: TerrenoUpdate) -> CrTerreno:
    obj = get_terreno(db, terreno_id)
    update_data = data.model_dump(exclude_unset=True, exclude={"geom"})
    for field, value in update_data.items():
        setattr(obj, field, value)
    if "geom" in data.model_dump(exclude_unset=True):
        apply_geom(obj, data.geom)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_terreno(db: Session, terreno_id: int):
    obj = get_terreno(db, terreno_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Terreno eliminado (borrado lógico)"}


# Unidades de Construcción
def get_unidades_construccion(db: Session, skip: int = 0, limit: int = 20,
                               terreno_id: Optional[int] = None):
    query = db.query(CrUnidadConstruccion).filter(CrUnidadConstruccion.deleted_at.is_(None))
    if terreno_id:
        query = query.filter(CrUnidadConstruccion.terreno_id == terreno_id)
    total = query.count()
    items = query.order_by(CrUnidadConstruccion.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_unidad_construccion(db: Session, uc_id: int) -> CrUnidadConstruccion:
    uc = db.query(CrUnidadConstruccion).filter(
        CrUnidadConstruccion.t_id == uc_id, CrUnidadConstruccion.deleted_at.is_(None)
    ).first()
    if not uc:
        raise HTTPException(status_code=404, detail=f"Unidad de construcción {uc_id} no encontrada")
    return uc


def create_unidad_construccion(db: Session, data: UnidadConstruccionCreate) -> CrUnidadConstruccion:
    obj = CrUnidadConstruccion(**data.model_dump(exclude={"geom"}))
    apply_geom(obj, data.geom)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_unidad_construccion(db: Session, uc_id: int, data: UnidadConstruccionUpdate) -> CrUnidadConstruccion:
    obj = get_unidad_construccion(db, uc_id)
    update_data = data.model_dump(exclude_unset=True, exclude={"geom"})
    for field, value in update_data.items():
        setattr(obj, field, value)
    if "geom" in data.model_dump(exclude_unset=True):
        apply_geom(obj, data.geom)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_unidad_construccion(db: Session, uc_id: int):
    obj = get_unidad_construccion(db, uc_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Unidad de construcción eliminada (borrado lógico)"}
