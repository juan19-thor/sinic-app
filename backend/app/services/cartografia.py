"""Servicio genérico para las capas de cartografía catastral."""
from sqlalchemy.orm import Session
from typing import Optional, Type, Any
from datetime import datetime
from app.services.base import apply_geom
from app.utils.geo import wkb_to_geojson
from fastapi import HTTPException


def get_list(db: Session, model: Type, skip: int, limit: int,
             departamento: Optional[str] = None, municipio: Optional[str] = None,
             search: Optional[str] = None):
    query = db.query(model).filter(model.deleted_at.is_(None))
    if departamento and hasattr(model, "departamento"):
        query = query.filter(model.departamento == departamento)
    if municipio and hasattr(model, "municipio"):
        query = query.filter(model.municipio == municipio)
    if search and hasattr(model, "nombre"):
        query = query.filter(
            model.nombre.ilike(f"%{search}%") | model.codigo.ilike(f"%{search}%")
        )
    total = query.count()
    items = query.order_by(model.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_one(db: Session, model: Type, obj_id: int):
    obj = db.query(model).filter(model.t_id == obj_id, model.deleted_at.is_(None)).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Registro {obj_id} no encontrado en {model.__tablename__}")
    return obj


def create_one(db: Session, model: Type, data: Any):
    data_dict = data.model_dump(exclude={"geom"})
    obj = model(**data_dict)
    geom_val = getattr(data, "geom", None)
    apply_geom(obj, geom_val)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_one(db: Session, model: Type, obj_id: int, data: Any):
    obj = get_one(db, model, obj_id)
    update_dict = data.model_dump(exclude_unset=True, exclude={"geom"})
    for field, value in update_dict.items():
        setattr(obj, field, value)
    if "geom" in data.model_dump(exclude_unset=True):
        apply_geom(obj, data.geom)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_one(db: Session, model: Type, obj_id: int):
    obj = get_one(db, model, obj_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": f"Registro {obj_id} eliminado (borrado lógico)"}


def serialize_with_geom(obj) -> dict:
    """Serializa un objeto ORM con su geometría como GeoJSON."""
    data = {}
    for col in obj.__table__.columns:
        val = getattr(obj, col.name)
        if col.name == "geom" and val is not None:
            data[col.name] = wkb_to_geojson(val)
        elif hasattr(val, "isoformat"):
            data[col.name] = val.isoformat()
        else:
            data[col.name] = val
    return data
