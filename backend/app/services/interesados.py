from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.models.interesados import CrInteresado, CrAgrupacionInteresados, ColMiembros
from app.schemas.interesados import (
    InteresadoCreate, InteresadoUpdate,
    AgrupacionInteresadosCreate, AgrupacionInteresadosUpdate,
    MiembrosCreate, MiembrosUpdate,
)
from fastapi import HTTPException


def get_interesados(db: Session, skip: int = 0, limit: int = 20,
                    tipo: Optional[str] = None, search: Optional[str] = None):
    query = db.query(CrInteresado).filter(CrInteresado.deleted_at.is_(None))
    if tipo:
        query = query.filter(CrInteresado.tipo_interesado == tipo)
    if search:
        query = query.filter(
            CrInteresado.primer_nombre.ilike(f"%{search}%") |
            CrInteresado.primer_apellido.ilike(f"%{search}%") |
            CrInteresado.razon_social.ilike(f"%{search}%") |
            CrInteresado.numero_documento.ilike(f"%{search}%")
        )
    total = query.count()
    items = query.order_by(CrInteresado.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_interesado(db: Session, interesado_id: int) -> CrInteresado:
    obj = db.query(CrInteresado).filter(
        CrInteresado.t_id == interesado_id, CrInteresado.deleted_at.is_(None)
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Interesado {interesado_id} no encontrado")
    return obj


def create_interesado(db: Session, data: InteresadoCreate) -> CrInteresado:
    # Validar persona natural
    if data.tipo_interesado == "Persona_Natural":
        if not data.primer_nombre or not data.primer_apellido:
            raise HTTPException(
                status_code=422,
                detail="Para Persona Natural son obligatorios: primer_nombre y primer_apellido"
            )
    # Validar persona jurídica
    if data.tipo_interesado == "Persona_Juridica":
        if not data.razon_social:
            raise HTTPException(
                status_code=422,
                detail="Para Persona Jurídica es obligatoria la razon_social"
            )
    # Verificar duplicidad por documento
    if data.tipo_documento and data.numero_documento:
        existing = db.query(CrInteresado).filter(
            CrInteresado.tipo_documento == data.tipo_documento,
            CrInteresado.numero_documento == data.numero_documento,
            CrInteresado.deleted_at.is_(None)
        ).first()
        if existing:
            raise HTTPException(
                status_code=409,
                detail=f"Ya existe un interesado con {data.tipo_documento} {data.numero_documento}"
            )
    obj = CrInteresado(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_interesado(db: Session, interesado_id: int, data: InteresadoUpdate) -> CrInteresado:
    obj = get_interesado(db, interesado_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_interesado(db: Session, interesado_id: int):
    obj = get_interesado(db, interesado_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Interesado eliminado (borrado lógico)"}


# Agrupaciones
def get_agrupaciones(db: Session, skip: int = 0, limit: int = 20):
    query = db.query(CrAgrupacionInteresados).filter(CrAgrupacionInteresados.deleted_at.is_(None))
    total = query.count()
    items = query.order_by(CrAgrupacionInteresados.t_id.desc()).offset(skip).limit(limit).all()
    return items, total


def get_agrupacion(db: Session, agrupacion_id: int) -> CrAgrupacionInteresados:
    obj = db.query(CrAgrupacionInteresados).filter(
        CrAgrupacionInteresados.t_id == agrupacion_id,
        CrAgrupacionInteresados.deleted_at.is_(None)
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Agrupación {agrupacion_id} no encontrada")
    return obj


def create_agrupacion(db: Session, data: AgrupacionInteresadosCreate) -> CrAgrupacionInteresados:
    obj = CrAgrupacionInteresados(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_agrupacion(db: Session, agrupacion_id: int, data: AgrupacionInteresadosUpdate) -> CrAgrupacionInteresados:
    obj = get_agrupacion(db, agrupacion_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj


def delete_agrupacion(db: Session, agrupacion_id: int):
    obj = get_agrupacion(db, agrupacion_id)
    obj.deleted_at = datetime.utcnow()
    db.commit()
    return {"mensaje": "Agrupación eliminada"}


# Miembros
def get_miembros(db: Session, agrupacion_id: int):
    return db.query(ColMiembros).filter(ColMiembros.agrupacion_id == agrupacion_id).all()


def create_miembro(db: Session, data: MiembrosCreate) -> ColMiembros:
    existing = db.query(ColMiembros).filter(
        ColMiembros.agrupacion_id == data.agrupacion_id,
        ColMiembros.interesado_id == data.interesado_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="El interesado ya es miembro de esta agrupación")
    obj = ColMiembros(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_miembro(db: Session, miembro_id: int):
    obj = db.query(ColMiembros).filter(ColMiembros.t_id == miembro_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    db.delete(obj)
    db.commit()
    return {"mensaje": "Miembro eliminado"}
