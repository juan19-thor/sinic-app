from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class PredioBase(BaseModel):
    departamento: str
    municipio: str
    numero_predial_nacional: Optional[str] = None
    numero_predial_anterior: Optional[str] = None
    nupre: Optional[str] = None
    codigo_orip: Optional[str] = None
    matricula_inmobiliaria: Optional[str] = None
    codigo_homologado: Optional[str] = None
    tipo_predio: str = "NPH"
    condicion_predio: str = "Formalidad"
    destinacion_economica: Optional[str] = None
    area_catastral_terreno: Optional[Decimal] = None
    area_registral_m2: Optional[Decimal] = None
    fecha_inscripcion_catastral: Optional[date] = None
    vigencia_actualizacion_catastral: Optional[date] = None
    direccion: Optional[str] = None
    estado: str = "Activo"
    observaciones: Optional[str] = None

    @field_validator("departamento")
    @classmethod
    def validate_departamento(cls, v):
        if not v.isdigit() or len(v) != 2:
            raise ValueError("El código de departamento debe tener exactamente 2 dígitos numéricos")
        return v

    @field_validator("municipio")
    @classmethod
    def validate_municipio(cls, v):
        if not v.isdigit() or len(v) != 3:
            raise ValueError("El código de municipio debe tener exactamente 3 dígitos numéricos")
        return v

    @field_validator("numero_predial_nacional")
    @classmethod
    def validate_npn(cls, v):
        if v is not None and (not v.isdigit() or len(v) != 30):
            raise ValueError("El NPN debe tener exactamente 30 dígitos numéricos")
        return v

    @field_validator("estado")
    @classmethod
    def validate_estado(cls, v):
        allowed = {"Activo", "Cancelado", "Inactivo"}
        if v not in allowed:
            raise ValueError(f"Estado debe ser uno de: {', '.join(allowed)}")
        return v


class PredioCreate(PredioBase):
    pass


class PredioUpdate(BaseModel):
    departamento: Optional[str] = None
    municipio: Optional[str] = None
    numero_predial_nacional: Optional[str] = None
    numero_predial_anterior: Optional[str] = None
    nupre: Optional[str] = None
    codigo_orip: Optional[str] = None
    matricula_inmobiliaria: Optional[str] = None
    tipo_predio: Optional[str] = None
    condicion_predio: Optional[str] = None
    destinacion_economica: Optional[str] = None
    area_catastral_terreno: Optional[Decimal] = None
    area_registral_m2: Optional[Decimal] = None
    fecha_inscripcion_catastral: Optional[date] = None
    vigencia_actualizacion_catastral: Optional[date] = None
    direccion: Optional[str] = None
    estado: Optional[str] = None
    observaciones: Optional[str] = None


class PredioResponse(PredioBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PredioListResponse(BaseModel):
    items: list[PredioResponse]
    total: int
    page: int
    size: int


class TramiteCatastralBase(BaseModel):
    predio_id: int
    tipo_tramite: str
    numero_tramite: Optional[str] = None
    fecha_tramite: Optional[date] = None
    fecha_inscripcion: Optional[date] = None
    descripcion: Optional[str] = None
    estado_tramite: str = "Activo"


class TramiteCatastralCreate(TramiteCatastralBase):
    pass


class TramiteCatastralUpdate(BaseModel):
    tipo_tramite: Optional[str] = None
    numero_tramite: Optional[str] = None
    fecha_tramite: Optional[date] = None
    fecha_inscripcion: Optional[date] = None
    descripcion: Optional[str] = None
    estado_tramite: Optional[str] = None


class TramiteCatastralResponse(TramiteCatastralBase):
    t_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
