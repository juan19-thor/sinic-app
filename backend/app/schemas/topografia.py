from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from decimal import Decimal


class LinderoBase(BaseModel):
    tipo_lindero: Optional[str] = None
    descripcion: Optional[str] = None
    longitud: Optional[Decimal] = None
    geom: Optional[Any] = None  # GeoJSON dict (MultiLineString)


class LinderoCreate(LinderoBase):
    pass


class LinderoUpdate(BaseModel):
    tipo_lindero: Optional[str] = None
    descripcion: Optional[str] = None
    longitud: Optional[Decimal] = None
    geom: Optional[Any] = None


class LinderoResponse(LinderoBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class LinderoListResponse(BaseModel):
    items: list[LinderoResponse]
    total: int
    page: int
    size: int


class PuntoLinderoBase(BaseModel):
    tipo_punto: Optional[str] = None
    descripcion: Optional[str] = None
    exactitud_horizontal: Optional[Decimal] = None
    exactitud_vertical: Optional[Decimal] = None
    geom: Optional[Any] = None  # GeoJSON dict (Point)


class PuntoLinderoCreate(PuntoLinderoBase):
    pass


class PuntoLinderoUpdate(BaseModel):
    tipo_punto: Optional[str] = None
    descripcion: Optional[str] = None
    exactitud_horizontal: Optional[Decimal] = None
    exactitud_vertical: Optional[Decimal] = None
    geom: Optional[Any] = None


class PuntoLinderoResponse(PuntoLinderoBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PuntoLinderoListResponse(BaseModel):
    items: list[PuntoLinderoResponse]
    total: int
    page: int
    size: int


class PuntoControlBase(BaseModel):
    codigo: str
    tipo_punto_control: Optional[str] = None
    descripcion: Optional[str] = None
    exactitud_horizontal: Optional[Decimal] = None
    exactitud_vertical: Optional[Decimal] = None
    geom: Optional[Any] = None  # GeoJSON dict (Point)


class PuntoControlCreate(PuntoControlBase):
    pass


class PuntoControlUpdate(BaseModel):
    codigo: Optional[str] = None
    tipo_punto_control: Optional[str] = None
    descripcion: Optional[str] = None
    exactitud_horizontal: Optional[Decimal] = None
    exactitud_vertical: Optional[Decimal] = None
    geom: Optional[Any] = None


class PuntoControlResponse(PuntoControlBase):
    t_id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PuntoControlListResponse(BaseModel):
    items: list[PuntoControlResponse]
    total: int
    page: int
    size: int


class PuntoCclBase(BaseModel):
    lindero_id: int
    punto_lindero_id: int


class PuntoCclCreate(PuntoCclBase):
    pass


class PuntoCclResponse(PuntoCclBase):
    t_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MasCclBase(BaseModel):
    terreno_id: int
    lindero_id: int


class MasCclCreate(MasCclBase):
    pass


class MasCclResponse(MasCclBase):
    t_id: int
    created_at: datetime

    model_config = {"from_attributes": True}
