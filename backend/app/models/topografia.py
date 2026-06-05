from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.database.connection import Base


class CrLindero(Base):
    __tablename__ = "cr_lindero"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    tipo_lindero = Column(String(50))
    descripcion = Column(Text)
    longitud = Column(Numeric(20, 4))
    geom = Column(Geometry("MULTILINESTRING", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    puntos = relationship("ColPuntoCcl", back_populates="lindero", lazy="dynamic")
    mas_ccl = relationship("ColMasCcl", back_populates="lindero", lazy="dynamic")
    menos_ccl = relationship("ColMenosCcl", back_populates="lindero", lazy="dynamic")


class CrPuntoLindero(Base):
    __tablename__ = "cr_punto_lindero"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    tipo_punto = Column(String(80))
    descripcion = Column(Text)
    exactitud_horizontal = Column(Numeric(10, 4))
    exactitud_vertical = Column(Numeric(10, 4))
    geom = Column(Geometry("POINT", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    linderos = relationship("ColPuntoCcl", back_populates="punto_lindero", lazy="dynamic")


class CrPuntoControl(Base):
    __tablename__ = "cr_punto_control"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    codigo = Column(String(50), nullable=False, index=True)
    tipo_punto_control = Column(String(80))
    descripcion = Column(Text)
    exactitud_horizontal = Column(Numeric(10, 4))
    exactitud_vertical = Column(Numeric(10, 4))
    geom = Column(Geometry("POINT", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))


class ColPuntoCcl(Base):
    __tablename__ = "col_punto_ccl"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    lindero_id = Column(Integer, ForeignKey("sinic_cr.cr_lindero.t_id"), nullable=False)
    punto_lindero_id = Column(Integer, ForeignKey("sinic_cr.cr_punto_lindero.t_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    lindero = relationship("CrLindero", back_populates="puntos")
    punto_lindero = relationship("CrPuntoLindero", back_populates="linderos")


class ColMasCcl(Base):
    __tablename__ = "col_mas_ccl"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    terreno_id = Column(Integer, ForeignKey("sinic_cr.cr_terreno.t_id"), nullable=False)
    lindero_id = Column(Integer, ForeignKey("sinic_cr.cr_lindero.t_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    terreno = relationship("CrTerreno", back_populates="mas_ccl")
    lindero = relationship("CrLindero", back_populates="mas_ccl")


class ColMenosCcl(Base):
    __tablename__ = "col_menos_ccl"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    terreno_id = Column(Integer, ForeignKey("sinic_cr.cr_terreno.t_id"), nullable=False)
    lindero_id = Column(Integer, ForeignKey("sinic_cr.cr_lindero.t_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    terreno = relationship("CrTerreno", back_populates="menos_ccl")
    lindero = relationship("CrLindero", back_populates="menos_ccl")
