from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.database.connection import Base


class CrTerreno(Base):
    __tablename__ = "cr_terreno"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    area_geometrica = Column(Numeric(20, 4))
    area_catastral = Column(Numeric(20, 4))
    condicion_predio = Column(String(80))
    tipo_terreno = Column(String(50))
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    observaciones = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    unidades_construccion = relationship("CrUnidadConstruccion", back_populates="terreno", lazy="dynamic")
    uebaunit = relationship("ColUebaunit", back_populates="terreno", lazy="dynamic")
    mas_ccl = relationship("ColMasCcl", back_populates="terreno", lazy="dynamic")
    menos_ccl = relationship("ColMenosCcl", back_populates="terreno", lazy="dynamic")


class CrUnidadConstruccion(Base):
    __tablename__ = "cr_unidad_construccion"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    terreno_id = Column(Integer, ForeignKey("sinic_cr.cr_terreno.t_id"))
    tipo_construccion = Column(String(50))
    numero_pisos = Column(Integer)
    area_construida = Column(Numeric(20, 4))
    uso = Column(String(50))
    estado_conservacion = Column(String(50))
    identificador = Column(String(50))
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    observaciones = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    terreno = relationship("CrTerreno", back_populates="unidades_construccion")
    caracteristicas = relationship("CrCaracteristicasUnidadConstruccion", back_populates="unidad_construccion", uselist=False)
    uebaunit = relationship("ColUebaunit", back_populates="unidad_construccion", lazy="dynamic")


class CrCaracteristicasUnidadConstruccion(Base):
    __tablename__ = "cr_caracteristicas_unidad_construccion"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    unidad_construccion_id = Column(Integer, ForeignKey("sinic_cr.cr_unidad_construccion.t_id"), nullable=False)
    anio_construccion = Column(Integer)
    material_paredes = Column(String(100))
    material_cubierta = Column(String(100))
    material_pisos = Column(String(100))
    numero_habitaciones = Column(Integer)
    numero_banos = Column(Integer)
    numero_locales = Column(Integer)
    tiene_sotano = Column(Boolean, default=False)
    tiene_mezanine = Column(Boolean, default=False)
    observaciones = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    unidad_construccion = relationship("CrUnidadConstruccion", back_populates="caracteristicas")
