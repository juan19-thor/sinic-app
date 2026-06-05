from pydantic import BaseModel, field_validator
from typing import Optional, Any
from datetime import datetime


class CartografiaBasePolygon(BaseModel):
    codigo: str
    nombre: str
    departamento: str
    municipio: str
    observacion: Optional[str] = None
    geom: Optional[Any] = None  # GeoJSON MultiPolygon

    @field_validator("departamento")
    @classmethod
    def validate_dep(cls, v):
        if not v.isdigit() or len(v) != 2:
            raise ValueError("El departamento debe tener 2 dígitos")
        return v

    @field_validator("municipio")
    @classmethod
    def validate_mun(cls, v):
        if not v.isdigit() or len(v) != 3:
            raise ValueError("El municipio debe tener 3 dígitos")
        return v


class CartografiaBaseUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    departamento: Optional[str] = None
    municipio: Optional[str] = None
    observacion: Optional[str] = None
    geom: Optional[Any] = None


class CartografiaResponse(CartografiaBasePolygon):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CartografiaListResponse(BaseModel):
    items: list[CartografiaResponse]
    total: int
    page: int
    size: int


# Sector con campos adicionales
class SectorBase(CartografiaBasePolygon):
    zona: Optional[str] = None
    sector: Optional[str] = None


class SectorCreate(SectorBase):
    pass


class SectorUpdate(CartografiaBaseUpdate):
    zona: Optional[str] = None
    sector: Optional[str] = None


class SectorResponse(SectorBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class SectorListResponse(BaseModel):
    items: list[SectorResponse]
    total: int
    page: int
    size: int


# Manzana con sector_id y barrio_id
class ManzanaBase(BaseModel):
    codigo: str
    nombre: Optional[str] = None
    departamento: str
    municipio: str
    sector_id: Optional[int] = None
    barrio_id: Optional[int] = None
    observacion: Optional[str] = None
    geom: Optional[Any] = None


class ManzanaCreate(ManzanaBase):
    pass


class ManzanaUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    departamento: Optional[str] = None
    municipio: Optional[str] = None
    sector_id: Optional[int] = None
    barrio_id: Optional[int] = None
    observacion: Optional[str] = None
    geom: Optional[Any] = None


class ManzanaResponse(ManzanaBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# Nomenclatura Vial (MultiLineString)
class NomenclaturaVialBase(BaseModel):
    codigo: Optional[str] = None
    nombre: str
    tipo_via: Optional[str] = None
    departamento: str
    municipio: str
    observacion: Optional[str] = None
    geom: Optional[Any] = None  # GeoJSON MultiLineString


class NomenclaturaVialCreate(NomenclaturaVialBase):
    pass


class NomenclaturaVialUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    tipo_via: Optional[str] = None
    departamento: Optional[str] = None
    municipio: Optional[str] = None
    observacion: Optional[str] = None
    geom: Optional[Any] = None


class NomenclaturaVialResponse(NomenclaturaVialBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class NomenclaturaVialListResponse(BaseModel):
    items: list[NomenclaturaVialResponse]
    total: int
    page: int
    size: int
