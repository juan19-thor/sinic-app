from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.interesados import (
    InteresadoCreate, InteresadoUpdate,
    AgrupacionInteresadosCreate, AgrupacionInteresadosUpdate,
    MiembrosCreate,
)
from app.services import interesados as svc

router = APIRouter(prefix="/api", tags=["Interesados"])


def _int_to_dict(i) -> dict:
    return {
        "t_id": i.t_id, "tipo_interesado": i.tipo_interesado,
        "tipo_documento": i.tipo_documento, "numero_documento": i.numero_documento,
        "primer_nombre": i.primer_nombre, "segundo_nombre": i.segundo_nombre,
        "primer_apellido": i.primer_apellido, "segundo_apellido": i.segundo_apellido,
        "razon_social": i.razon_social, "correo": i.correo,
        "telefono": i.telefono, "direccion_notificacion": i.direccion_notificacion,
        "created_at": i.created_at.isoformat() if i.created_at else None,
        "updated_at": i.updated_at.isoformat() if i.updated_at else None,
        "deleted_at": i.deleted_at.isoformat() if i.deleted_at else None,
    }


def _agrup_to_dict(a) -> dict:
    return {
        "t_id": a.t_id, "nombre_agrupacion": a.nombre_agrupacion,
        "tipo_agrupacion": a.tipo_agrupacion, "descripcion": a.descripcion,
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "updated_at": a.updated_at.isoformat() if a.updated_at else None,
        "deleted_at": a.deleted_at.isoformat() if a.deleted_at else None,
    }


# Interesados
@router.get("/interesados")
def listar_interesados(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    tipo: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_interesados(db, skip, size, tipo, search)
    return {"items": [_int_to_dict(i) for i in items], "total": total, "page": page, "size": size}


@router.get("/interesados/{interesado_id}")
def obtener_interesado(interesado_id: int, db: Session = Depends(get_db)):
    return _int_to_dict(svc.get_interesado(db, interesado_id))


@router.post("/interesados", status_code=201)
def crear_interesado(data: InteresadoCreate, db: Session = Depends(get_db)):
    return _int_to_dict(svc.create_interesado(db, data))


@router.patch("/interesados/{interesado_id}")
def actualizar_interesado(interesado_id: int, data: InteresadoUpdate, db: Session = Depends(get_db)):
    return _int_to_dict(svc.update_interesado(db, interesado_id, data))


@router.delete("/interesados/{interesado_id}")
def eliminar_interesado(interesado_id: int, db: Session = Depends(get_db)):
    return svc.delete_interesado(db, interesado_id)


# Agrupaciones
@router.get("/agrupaciones-interesados")
def listar_agrupaciones(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = svc.get_agrupaciones(db, skip, size)
    return {"items": [_agrup_to_dict(a) for a in items], "total": total, "page": page, "size": size}


@router.get("/agrupaciones-interesados/{agrupacion_id}")
def obtener_agrupacion(agrupacion_id: int, db: Session = Depends(get_db)):
    return _agrup_to_dict(svc.get_agrupacion(db, agrupacion_id))


@router.post("/agrupaciones-interesados", status_code=201)
def crear_agrupacion(data: AgrupacionInteresadosCreate, db: Session = Depends(get_db)):
    return _agrup_to_dict(svc.create_agrupacion(db, data))


@router.patch("/agrupaciones-interesados/{agrupacion_id}")
def actualizar_agrupacion(agrupacion_id: int, data: AgrupacionInteresadosUpdate, db: Session = Depends(get_db)):
    return _agrup_to_dict(svc.update_agrupacion(db, agrupacion_id, data))


@router.delete("/agrupaciones-interesados/{agrupacion_id}")
def eliminar_agrupacion(agrupacion_id: int, db: Session = Depends(get_db)):
    return svc.delete_agrupacion(db, agrupacion_id)


# Miembros
@router.get("/agrupaciones-interesados/{agrupacion_id}/miembros")
def listar_miembros(agrupacion_id: int, db: Session = Depends(get_db)):
    miembros = svc.get_miembros(db, agrupacion_id)
    return [
        {
            "t_id": m.t_id, "agrupacion_id": m.agrupacion_id, "interesado_id": m.interesado_id,
            "participacion": float(m.participacion) if m.participacion else None,
        }
        for m in miembros
    ]


@router.post("/agrupaciones-interesados/{agrupacion_id}/miembros", status_code=201)
def agregar_miembro(agrupacion_id: int, data: MiembrosCreate, db: Session = Depends(get_db)):
    data.agrupacion_id = agrupacion_id
    m = svc.create_miembro(db, data)
    return {"t_id": m.t_id, "agrupacion_id": m.agrupacion_id, "interesado_id": m.interesado_id}


@router.delete("/miembros/{miembro_id}")
def eliminar_miembro(miembro_id: int, db: Session = Depends(get_db)):
    return svc.delete_miembro(db, miembro_id)


# Dominios
@router.get("/interesados/dominios/tipos")
def dominios_tipos_interesado():
    return ["Persona_Natural", "Persona_Juridica"]


@router.get("/interesados/dominios/documentos")
def dominios_tipos_documento():
    return ["CC", "CE", "NIT", "PA", "RC", "TI", "NUIP", "Secuencial"]
