from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.cartografia import (
    CcLimiteMunicipio, CcSectorRural, CcSectorUrbano, CcPerimetroUrbano,
    CcVereda, CcCorregimiento, CcLocalidadComuna, CcCentroPoblado,
    CcManzana, CcBarrio, CcNomenclaturaVial,
)
from app.schemas.cartografia import (
    CartografiaBasePolygon, CartografiaBaseUpdate,
    SectorCreate, SectorUpdate,
    ManzanaCreate, ManzanaUpdate,
    NomenclaturaVialCreate, NomenclaturaVialUpdate,
)
from app.services.cartografia import get_list, get_one, create_one, update_one, delete_one, serialize_with_geom

router = APIRouter(prefix="/api/cartografia", tags=["Cartografía Catastral"])

COMMON_PARAMS = {
    "page": Query(1, ge=1),
    "size": Query(20, ge=1, le=100),
}


def _list_response(db, model, page, size, departamento=None, municipio=None, search=None):
    skip = (page - 1) * size
    items, total = get_list(db, model, skip, size, departamento, municipio, search)
    return {
        "items": [serialize_with_geom(i) for i in items],
        "total": total, "page": page, "size": size,
    }


# ── Límite Municipio ──────────────────────────────────────────────────────────
@router.get("/limite-municipio")
def listar_limite_municipio(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcLimiteMunicipio, page, size, departamento, municipio, search)


@router.get("/limite-municipio/{obj_id}")
def obtener_limite_municipio(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcLimiteMunicipio, obj_id))


@router.post("/limite-municipio", status_code=201)
def crear_limite_municipio(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcLimiteMunicipio, data))


@router.patch("/limite-municipio/{obj_id}")
def actualizar_limite_municipio(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcLimiteMunicipio, obj_id, data))


@router.delete("/limite-municipio/{obj_id}")
def eliminar_limite_municipio(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcLimiteMunicipio, obj_id)


# ── Sector Rural ──────────────────────────────────────────────────────────────
@router.get("/sector-rural")
def listar_sector_rural(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcSectorRural, page, size, departamento, municipio, search)


@router.get("/sector-rural/{obj_id}")
def obtener_sector_rural(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcSectorRural, obj_id))


@router.post("/sector-rural", status_code=201)
def crear_sector_rural(data: SectorCreate, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcSectorRural, data))


@router.patch("/sector-rural/{obj_id}")
def actualizar_sector_rural(obj_id: int, data: SectorUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcSectorRural, obj_id, data))


@router.delete("/sector-rural/{obj_id}")
def eliminar_sector_rural(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcSectorRural, obj_id)


# ── Sector Urbano ─────────────────────────────────────────────────────────────
@router.get("/sector-urbano")
def listar_sector_urbano(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcSectorUrbano, page, size, departamento, municipio, search)


@router.get("/sector-urbano/{obj_id}")
def obtener_sector_urbano(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcSectorUrbano, obj_id))


@router.post("/sector-urbano", status_code=201)
def crear_sector_urbano(data: SectorCreate, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcSectorUrbano, data))


@router.patch("/sector-urbano/{obj_id}")
def actualizar_sector_urbano(obj_id: int, data: SectorUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcSectorUrbano, obj_id, data))


@router.delete("/sector-urbano/{obj_id}")
def eliminar_sector_urbano(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcSectorUrbano, obj_id)


# ── Perímetro Urbano ──────────────────────────────────────────────────────────
@router.get("/perimetro-urbano")
def listar_perimetro(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return _list_response(db, CcPerimetroUrbano, page, size, departamento, municipio)


@router.get("/perimetro-urbano/{obj_id}")
def obtener_perimetro(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcPerimetroUrbano, obj_id))


@router.post("/perimetro-urbano", status_code=201)
def crear_perimetro(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcPerimetroUrbano, data))


@router.patch("/perimetro-urbano/{obj_id}")
def actualizar_perimetro(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcPerimetroUrbano, obj_id, data))


@router.delete("/perimetro-urbano/{obj_id}")
def eliminar_perimetro(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcPerimetroUrbano, obj_id)


# ── Vereda ────────────────────────────────────────────────────────────────────
@router.get("/veredas")
def listar_veredas(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcVereda, page, size, departamento, municipio, search)


@router.get("/veredas/{obj_id}")
def obtener_vereda(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcVereda, obj_id))


@router.post("/veredas", status_code=201)
def crear_vereda(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcVereda, data))


@router.patch("/veredas/{obj_id}")
def actualizar_vereda(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcVereda, obj_id, data))


@router.delete("/veredas/{obj_id}")
def eliminar_vereda(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcVereda, obj_id)


# ── Corregimiento ─────────────────────────────────────────────────────────────
@router.get("/corregimientos")
def listar_corregimientos(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcCorregimiento, page, size, departamento, municipio, search)


@router.get("/corregimientos/{obj_id}")
def obtener_corregimiento(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcCorregimiento, obj_id))


@router.post("/corregimientos", status_code=201)
def crear_corregimiento(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcCorregimiento, data))


@router.patch("/corregimientos/{obj_id}")
def actualizar_corregimiento(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcCorregimiento, obj_id, data))


@router.delete("/corregimientos/{obj_id}")
def eliminar_corregimiento(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcCorregimiento, obj_id)


# ── Localidad / Comuna ────────────────────────────────────────────────────────
@router.get("/localidades-comunas")
def listar_localidades(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcLocalidadComuna, page, size, departamento, municipio, search)


@router.get("/localidades-comunas/{obj_id}")
def obtener_localidad(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcLocalidadComuna, obj_id))


@router.post("/localidades-comunas", status_code=201)
def crear_localidad(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcLocalidadComuna, data))


@router.patch("/localidades-comunas/{obj_id}")
def actualizar_localidad(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcLocalidadComuna, obj_id, data))


@router.delete("/localidades-comunas/{obj_id}")
def eliminar_localidad(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcLocalidadComuna, obj_id)


# ── Centro Poblado ────────────────────────────────────────────────────────────
@router.get("/centros-poblados")
def listar_centros_poblados(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcCentroPoblado, page, size, departamento, municipio, search)


@router.get("/centros-poblados/{obj_id}")
def obtener_centro_poblado(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcCentroPoblado, obj_id))


@router.post("/centros-poblados", status_code=201)
def crear_centro_poblado(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcCentroPoblado, data))


@router.patch("/centros-poblados/{obj_id}")
def actualizar_centro_poblado(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcCentroPoblado, obj_id, data))


@router.delete("/centros-poblados/{obj_id}")
def eliminar_centro_poblado(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcCentroPoblado, obj_id)


# ── Manzana ───────────────────────────────────────────────────────────────────
@router.get("/manzanas")
def listar_manzanas(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcManzana, page, size, departamento, municipio, search)


@router.get("/manzanas/{obj_id}")
def obtener_manzana(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcManzana, obj_id))


@router.post("/manzanas", status_code=201)
def crear_manzana(data: ManzanaCreate, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcManzana, data))


@router.patch("/manzanas/{obj_id}")
def actualizar_manzana(obj_id: int, data: ManzanaUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcManzana, obj_id, data))


@router.delete("/manzanas/{obj_id}")
def eliminar_manzana(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcManzana, obj_id)


# ── Barrio ────────────────────────────────────────────────────────────────────
@router.get("/barrios")
def listar_barrios(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcBarrio, page, size, departamento, municipio, search)


@router.get("/barrios/{obj_id}")
def obtener_barrio(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcBarrio, obj_id))


@router.post("/barrios", status_code=201)
def crear_barrio(data: CartografiaBasePolygon, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcBarrio, data))


@router.patch("/barrios/{obj_id}")
def actualizar_barrio(obj_id: int, data: CartografiaBaseUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcBarrio, obj_id, data))


@router.delete("/barrios/{obj_id}")
def eliminar_barrio(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcBarrio, obj_id)


# ── Nomenclatura Vial ─────────────────────────────────────────────────────────
@router.get("/nomenclatura-vial")
def listar_nomenclatura_vial(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100),
    departamento: Optional[str] = None, municipio: Optional[str] = None,
    search: Optional[str] = None, db: Session = Depends(get_db)
):
    return _list_response(db, CcNomenclaturaVial, page, size, departamento, municipio, search)


@router.get("/nomenclatura-vial/{obj_id}")
def obtener_nomenclatura_vial(obj_id: int, db: Session = Depends(get_db)):
    return serialize_with_geom(get_one(db, CcNomenclaturaVial, obj_id))


@router.post("/nomenclatura-vial", status_code=201)
def crear_nomenclatura_vial(data: NomenclaturaVialCreate, db: Session = Depends(get_db)):
    return serialize_with_geom(create_one(db, CcNomenclaturaVial, data))


@router.patch("/nomenclatura-vial/{obj_id}")
def actualizar_nomenclatura_vial(obj_id: int, data: NomenclaturaVialUpdate, db: Session = Depends(get_db)):
    return serialize_with_geom(update_one(db, CcNomenclaturaVial, obj_id, data))


@router.delete("/nomenclatura-vial/{obj_id}")
def eliminar_nomenclatura_vial(obj_id: int, db: Session = Depends(get_db)):
    return delete_one(db, CcNomenclaturaVial, obj_id)
