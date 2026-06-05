from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal


class InteresadoBase(BaseModel):
    tipo_interesado: str
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    primer_nombre: Optional[str] = None
    segundo_nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    razon_social: Optional[str] = None
    correo: Optional[str] = None
    telefono: Optional[str] = None
    direccion_notificacion: Optional[str] = None

    @field_validator("tipo_interesado")
    @classmethod
    def validate_tipo(cls, v):
        allowed = {"Persona_Natural", "Persona_Juridica"}
        if v not in allowed:
            raise ValueError(f"tipo_interesado debe ser uno de: {', '.join(allowed)}")
        return v


class InteresadoCreate(InteresadoBase):
    @field_validator("primer_nombre", mode="after")
    @classmethod
    def validate_natural(cls, v, info):
        # Pydantic v2: use model_validator instead for cross-field validation
        return v

    model_config = {"from_attributes": True}


class InteresadoUpdate(BaseModel):
    tipo_interesado: Optional[str] = None
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    primer_nombre: Optional[str] = None
    segundo_nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    razon_social: Optional[str] = None
    correo: Optional[str] = None
    telefono: Optional[str] = None
    direccion_notificacion: Optional[str] = None


class InteresadoResponse(InteresadoBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class InteresadoListResponse(BaseModel):
    items: list[InteresadoResponse]
    total: int
    page: int
    size: int


class AgrupacionInteresadosBase(BaseModel):
    nombre_agrupacion: str
    tipo_agrupacion: Optional[str] = None
    descripcion: Optional[str] = None


class AgrupacionInteresadosCreate(AgrupacionInteresadosBase):
    pass


class AgrupacionInteresadosUpdate(BaseModel):
    nombre_agrupacion: Optional[str] = None
    tipo_agrupacion: Optional[str] = None
    descripcion: Optional[str] = None


class AgrupacionInteresadosResponse(AgrupacionInteresadosBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class MiembrosBase(BaseModel):
    agrupacion_id: int
    interesado_id: int
    participacion: Optional[Decimal] = None

    @field_validator("participacion")
    @classmethod
    def validate_participacion(cls, v):
        if v is not None and (v <= 0 or v > 1):
            raise ValueError("La participación debe estar entre 0 (exclusivo) y 1 (inclusivo)")
        return v


class MiembrosCreate(MiembrosBase):
    pass


class MiembrosUpdate(BaseModel):
    participacion: Optional[Decimal] = None


class MiembrosResponse(MiembrosBase):
    t_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
