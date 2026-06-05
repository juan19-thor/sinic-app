from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.database.connection import Base


class SinicPredio(Base):
    __tablename__ = "sinic_predio"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True, index=True)
    departamento = Column(String(2), nullable=False)
    municipio = Column(String(3), nullable=False)
    numero_predial_nacional = Column(String(30), index=True)
    numero_predial_anterior = Column(String(20))
    nupre = Column(String(20))
    codigo_orip = Column(String(10))
    matricula_inmobiliaria = Column(String(30))
    codigo_homologado = Column(String(20))
    tipo_predio = Column(String(50), nullable=False, default="NPH")
    condicion_predio = Column(String(80), nullable=False, default="Formalidad")
    destinacion_economica = Column(String(50))
    area_catastral_terreno = Column(Numeric(20, 4))
    area_registral_m2 = Column(Numeric(20, 4))
    fecha_inscripcion_catastral = Column(Date)
    vigencia_actualizacion_catastral = Column(Date)
    direccion = Column(String(255))
    estado = Column(String(20), nullable=False, default="Activo")
    observaciones = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    tramites = relationship("CrTramiteCatastral", back_populates="predio", lazy="dynamic")
    copropiedad = relationship(
        "CrPredioCopropiedad",
        foreign_keys="[CrPredioCopropiedad.predio_id]",
        back_populates="predio",
        lazy="dynamic",
    )
    informalidad = relationship("CrPredioInformalidad", back_populates="predio", lazy="dynamic")
    uebaunit = relationship("ColUebaunit", back_populates="predio", lazy="dynamic")
    derechos = relationship("ColDerecho", back_populates="predio", lazy="dynamic")


class CrTramiteCatastral(Base):
    __tablename__ = "cr_tramite_catastral"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    predio_id = Column(Integer, ForeignKey("sinic_cr.sinic_predio.t_id"), nullable=False)
    tipo_tramite = Column(String(100), nullable=False)
    numero_tramite = Column(String(50))
    fecha_tramite = Column(Date)
    fecha_inscripcion = Column(Date)
    descripcion = Column(Text)
    estado_tramite = Column(String(50), default="Activo")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    predio = relationship("SinicPredio", back_populates="tramites")


class CrPredioCopropiedad(Base):
    __tablename__ = "cr_predio_copropiedad"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    predio_id = Column(Integer, ForeignKey("sinic_cr.sinic_predio.t_id"), nullable=False)
    predio_matriz_id = Column(Integer, ForeignKey("sinic_cr.sinic_predio.t_id"))
    coeficiente = Column(Numeric(10, 6))
    descripcion = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    predio = relationship("SinicPredio", foreign_keys="[CrPredioCopropiedad.predio_id]", back_populates="copropiedad")
    predio_matriz = relationship("SinicPredio", foreign_keys="[CrPredioCopropiedad.predio_matriz_id]")


class CrPredioInformalidad(Base):
    __tablename__ = "cr_predio_informalidad"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    predio_id = Column(Integer, ForeignKey("sinic_cr.sinic_predio.t_id"), nullable=False)
    tipo_informalidad = Column(String(80), nullable=False)
    descripcion = Column(Text)
    fecha_reconocimiento = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    predio = relationship("SinicPredio", back_populates="informalidad")


class ColUebaunit(Base):
    __tablename__ = "col_uebaunit"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    predio_id = Column(Integer, ForeignKey("sinic_cr.sinic_predio.t_id"), nullable=False)
    terreno_id = Column(Integer, ForeignKey("sinic_cr.cr_terreno.t_id"))
    uc_id = Column(Integer, ForeignKey("sinic_cr.cr_unidad_construccion.t_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    predio = relationship("SinicPredio", back_populates="uebaunit")
    terreno = relationship("CrTerreno", back_populates="uebaunit")
    unidad_construccion = relationship("CrUnidadConstruccion", back_populates="uebaunit")
