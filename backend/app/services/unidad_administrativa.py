from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
from app.models.unidad_administrativa import SinicPredio, CrTramiteCatastral
from app.schemas.unidad_administrativa import PredioCreate, PredioUpdate, TramiteCatastralCreate, TramiteCatastralUpdate
from fastapi import HTTPException


def get_predios(db: Session, skip: int = 0, limit: int = 20,
                departamento: Optional[str] = None, municipio: Optional[str] = None,
                estado: Optional[str] = None, search: Optional[str] = None):
    query = db.query(SinicPredio).filter(SinicPredio.deleted_at.is_(None))
    if departamento:
        query = query.filter(SinicPredio.departamento == departamento)
    if municipio:
        query = query.filter(SinicPredio.municipio == municipio)
    if estado:
        query = query.filter(SinicPredio.estado == estado)
    if search:
        query = query.filter(
            SinicPredio.numero_predial_nacional.ilike(f"%{search}%") |
            SinicPredio.nupre.ilike(f"%{search}%") |
            SinicPredio.matricula_inmobiliaria.ilike(f"%{search}%") |
            SinicPredio.direccion.ilike(f"%{search}%")
        )
    total = query.count()
    items = query.order_by(SinicPredio.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_predio(db: Session, predio_id: int) -> SinicPredio:
    predio = db.query(SinicPredio).filter(
        SinicPredio.t_id == predio_id,
        SinicPredio.deleted_at.is_(None)
    ).first()
    if not predio:
        raise HTTPException(status_code=404, detail=f"Predio {predio_id} no encontrado")
    return predio


def create_predio(db: Session, data: PredioCreate) -> SinicPredio:
    predio = SinicPredio(**data.model_dump())
    db.add(predio)
    db.commit()
    db.refresh(predio)
    return predio


def update_predio(db: Session, predio_id: int, data: PredioUpdate) -> SinicPredio:
    predio = get_predio(db, predio_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(predio, field, value)
    predio.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(predio)
    return predio


def delete_predio(db: Session, predio_id: int):
    predio = get_predio(db, predio_id)
    # Verificar relaciones activas antes de borrar
    from app.models.unidad_administrativa import ColUebaunit
    rel_count = db.query(ColUebaunit).filter(ColUebaunit.predio_id == predio_id).count()
    if rel_count > 0:
        # Borrado lógico si tiene relaciones
        predio.deleted_at = datetime.utcnow()
        predio.estado = "Cancelado"
    else:
        predio.deleted_at = datetime.utcnow()
        predio.estado = "Cancelado"
    db.commit()
    return {"mensaje": "Predio eliminado (borrado lógico)"}


# Trámites
def get_tramites(db: Session, predio_id: Optional[int] = None, skip: int = 0, limit: int = 20):
    query = db.query(CrTramiteCatastral).filter(CrTramiteCatastral.deleted_at.is_(None))
    if predio_id:
        query = query.filter(CrTramiteCatastral.predio_id == predio_id)
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def create_tramite(db: Session, data: TramiteCatastralCreate) -> CrTramiteCatastral:
    # Verificar que el predio existe
    predio = db.query(SinicPredio).filter(SinicPredio.t_id == data.predio_id, SinicPredio.deleted_at.is_(None)).first()
    if not predio:
        raise HTTPException(status_code=404, detail=f"Predio {data.predio_id} no encontrado")
    tramite = CrTramiteCatastral(**data.model_dump())
    db.add(tramite)
    db.commit()
    db.refresh(tramite)
    return tramite


def update_tramite(db: Session, tramite_id: int, data: TramiteCatastralUpdate) -> CrTramiteCatastral:
    tramite = db.query(CrTramiteCatastral).filter(
        CrTramiteCatastral.t_id == tramite_id,
        CrTramiteCatastral.deleted_at.is_(None)
    ).first()
    if not tramite:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(tramite, field, value)
    db.commit()
    db.refresh(tramite)
    return tramite


def delete_tramite(db: Session, tramite_id: int):
    tramite = db.query(CrTramiteCatastral).filter(CrTramiteCatastral.t_id == tramite_id).first()
    if not tramite:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")
    tramite.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Trámite eliminado"}
