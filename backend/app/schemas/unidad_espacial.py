from pydantic import BaseModel, field_validator
from typing import Optional, Any
from datetime import datetime
from decimal import Decimal


class TerrenoBase(BaseModel):
    area_geometrica: Optional[Decimal] = None
    area_catastral: Optional[Decimal] = None
    condicion_predio: Optional[str] = None
    tipo_terreno: Optional[str] = None
    geom: Optional[Any] = None  # GeoJSON dict
    observaciones: Optional[str] = None


class TerrenoCreate(TerrenoBase):
    pass


class TerrenoUpdate(BaseModel):
    area_geometrica: Optional[Decimal] = None
    area_catastral: Optional[Decimal] = None
    condicion_predio: Optional[str] = None
    tipo_terreno: Optional[str] = None
    geom: Optional[Any] = None
    observaciones: Optional[str] = None


class TerrenoResponse(TerrenoBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TerrenoListResponse(BaseModel):
    items: list[TerrenoResponse]
    total: int
    page: int
    size: int


class UnidadConstruccionBase(BaseModel):
    terreno_id: Optional[int] = None
    tipo_construccion: Optional[str] = None
    numero_pisos: Optional[int] = None
    area_construida: Optional[Decimal] = None
    uso: Optional[str] = None
    estado_conservacion: Optional[str] = None
    identificador: Optional[str] = None
    geom: Optional[Any] = None
    observaciones: Optional[str] = None

    @field_validator("numero_pisos")
    @classmethod
    def validate_pisos(cls, v):
        if v is not None and v <= 0:
            raise ValueError("El número de pisos debe ser mayor a 0")
        return v


class UnidadConstruccionCreate(UnidadConstruccionBase):
    pass


class UnidadConstruccionUpdate(BaseModel):
    terreno_id: Optional[int] = None
    tipo_construccion: Optional[str] = None
    numero_pisos: Optional[int] = None
    area_construida: Optional[Decimal] = None
    uso: Optional[str] = None
    estado_conservacion: Optional[str] = None
    identificador: Optional[str] = None
    geom: Optional[Any] = None
    observaciones: Optional[str] = None


class UnidadConstruccionResponse(UnidadConstruccionBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UnidadConstruccionListResponse(BaseModel):
    items: list[UnidadConstruccionResponse]
    total: int
    page: int
    size: int


class CaracteristicasUCBase(BaseModel):
    unidad_construccion_id: int
    anio_construccion: Optional[int] = None
    material_paredes: Optional[str] = None
    material_cubierta: Optional[str] = None
    material_pisos: Optional[str] = None
    numero_habitaciones: Optional[int] = None
    numero_banos: Optional[int] = None
    numero_locales: Optional[int] = None
    tiene_sotano: Optional[bool] = False
    tiene_mezanine: Optional[bool] = False
    observaciones: Optional[str] = None


class CaracteristicasUCCreate(CaracteristicasUCBase):
    pass


class CaracteristicasUCUpdate(BaseModel):
    anio_construccion: Optional[int] = None
    material_paredes: Optional[str] = None
    material_cubierta: Optional[str] = None
    material_pisos: Optional[str] = None
    numero_habitaciones: Optional[int] = None
    numero_banos: Optional[int] = None
    numero_locales: Optional[int] = None
    tiene_sotano: Optional[bool] = None
    tiene_mezanine: Optional[bool] = None
    observaciones: Optional[str] = None


class CaracteristicasUCResponse(CaracteristicasUCBase):
    t_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
