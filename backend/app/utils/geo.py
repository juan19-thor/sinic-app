"""Utilidades geoespaciales para conversión GeoJSON <-> WKT/WKB."""
import json
from typing import Any, Optional
from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import shape, mapping
from shapely import wkb
import binascii


def geojson_to_wkb(geojson: Optional[Any]) -> Optional[str]:
    """Convierte un dict GeoJSON a WKB hex para almacenar en PostGIS."""
    if geojson is None:
        return None
    if isinstance(geojson, str):
        geojson = json.loads(geojson)
    try:
        geom = shape(geojson)
        return f"SRID=4326;{geom.wkt}"
    except Exception:
        return None


def wkb_to_geojson(geom_value) -> Optional[dict]:
    """Convierte un valor WKB de GeoAlchemy2 a dict GeoJSON."""
    if geom_value is None:
        return None
    try:
        shp = to_shape(geom_value)
        return mapping(shp)
    except Exception:
        return None


def validate_geometry_type(geojson: dict, expected_types: list[str]) -> bool:
    """Valida que el GeoJSON tenga el tipo de geometría esperado."""
    if not geojson:
        return False
    geom_type = geojson.get("type", "")
    return geom_type in expected_types
