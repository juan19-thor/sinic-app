"""Validadores específicos del modelo LADM_COL SINIC V1.0."""
import re
from typing import Optional


def validate_npn(npn: Optional[str]) -> bool:
    """Valida estructura del Número Predial Nacional (30 dígitos)."""
    if npn is None:
        return True
    return bool(re.match(r"^\d{30}$", str(npn)))


def validate_departamento(cod: str) -> bool:
    """Valida código de departamento (2 dígitos)."""
    return bool(re.match(r"^\d{2}$", str(cod)))


def validate_municipio(cod: str) -> bool:
    """Valida código de municipio (3 dígitos)."""
    return bool(re.match(r"^\d{3}$", str(cod)))


def parse_npn_components(npn: str) -> dict:
    """Descompone el NPN en sus componentes según la estructura oficial."""
    if not validate_npn(npn):
        return {}
    return {
        "departamento": npn[0:2],
        "municipio": npn[2:5],
        "zona": npn[5:7],
        "sector": npn[7:9],
        "comuna": npn[9:11],
        "barrio": npn[11:13],
        "manzana_vereda": npn[13:17],
        "terreno": npn[17:21],
        "condicion_predio": npn[21:22],
        "edificio_torre": npn[22:24],
        "piso": npn[24:26],
        "numero_unidad": npn[26:30],
    }
