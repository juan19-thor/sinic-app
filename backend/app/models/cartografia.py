from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.database.connection import Base


class CcLimiteMunicipio(Base):
    __tablename__ = "cc_limite_municipio"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(10), nullable=False, index=True)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcSectorRural(Base):
    __tablename__ = "cc_sector_rural"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False, index=True)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    zona = Column(String(2))
    sector = Column(String(2))
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcSectorUrbano(Base):
    __tablename__ = "cc_sector_urbano"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False, index=True)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    zona = Column(String(2))
    sector = Column(String(2))
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcPerimetroUrbano(Base):
    __tablename__ = "cc_perimetro_urbano"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcVereda(Base):
    __tablename__ = "cc_vereda"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcCorregimiento(Base):
    __tablename__ = "cc_corregimiento"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcLocalidadComuna(Base):
    __tablename__ = "cc_localidad_comuna"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcCentroPoblado(Base):
    __tablename__ = "cc_centro_poblado"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcManzana(Base):
    __tablename__ = "cc_manzana"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255))
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    sector_id = Column(Integer, ForeignKey("sinic_cr.cc_sector_urbano.t_id"))
    barrio_id = Column(Integer, ForeignKey("sinic_cr.cc_barrio.t_id"))
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    sector = relationship("CcSectorUrbano")
    barrio = relationship("CcBarrio")


class CcBarrio(Base):
    __tablename__ = "cc_barrio"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(255), nullable=False)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class CcNomenclaturaVial(Base):
    __tablename__ = "cc_nomenclatura_vial"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(20))
    nombre = Column(String(255), nullable=False)
    tipo_via = Column(String(100))
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    observacion = Column(Text)
    geom = Column(Geometry("MULTILINESTRING", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))
