"""Servicio base genérico con CRUD espacial."""
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from geoalchemy2.shape import from_shape
from shapely.geometry import shape
from typing import Any, Optional
from app.utils.geo import geojson_to_wkb, wkb_to_geojson
import json


def serialize_row(obj, geom_field: str = "geom") -> dict:
    """Serializa un objeto ORM incluyendo la geometría como GeoJSON."""
    data = {}
    for col in obj.__table__.columns:
        val = getattr(obj, col.name)
        if col.name == geom_field and val is not None:
            data[col.name] = wkb_to_geojson(val)
        elif hasattr(val, "isoformat"):
            data[col.name] = val.isoformat()
        else:
            data[col.name] = val
    return data


def apply_geom(obj, geom_value: Any, field: str = "geom"):
    """Convierte GeoJSON a WKT-EWKT y asigna al modelo."""
    if geom_value is None:
        setattr(obj, field, None)
        return
    if isinstance(geom_value, dict):
        geom_str = geojson_to_wkb(geom_value)
        setattr(obj, field, geom_str)
    else:
        setattr(obj, field, geom_value)
