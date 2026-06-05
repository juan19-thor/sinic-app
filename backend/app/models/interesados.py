from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base


class CrInteresado(Base):
    __tablename__ = "cr_interesado"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    tipo_interesado = Column(String(50), nullable=False)
    tipo_documento = Column(String(50))
    numero_documento = Column(String(30))
    primer_nombre = Column(String(100))
    segundo_nombre = Column(String(100))
    primer_apellido = Column(String(100))
    segundo_apellido = Column(String(100))
    razon_social = Column(String(255))
    correo = Column(String(255))
    telefono = Column(String(20))
    direccion_notificacion = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    membresías = relationship("ColMiembros", back_populates="interesado", lazy="dynamic")
    derechos = relationship("ColDerecho", back_populates="interesado", lazy="dynamic")


class CrAgrupacionInteresados(Base):
    __tablename__ = "cr_agrupacion_interesados"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    nombre_agrupacion = Column(String(255), nullable=False)
    tipo_agrupacion = Column(String(50))
    descripcion = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    miembros = relationship("ColMiembros", back_populates="agrupacion", lazy="dynamic")
    derechos = relationship("ColDerecho", back_populates="agrupacion", lazy="dynamic")


class ColMiembros(Base):
    __tablename__ = "col_miembros"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    agrupacion_id = Column(Integer, ForeignKey("sinic_cr.cr_agrupacion_interesados.t_id"), nullable=False)
    interesado_id = Column(Integer, ForeignKey("sinic_cr.cr_interesado.t_id"), nullable=False)
    participacion = Column(Numeric(10, 6))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    agrupacion = relationship("CrAgrupacionInteresados", back_populates="miembros")
    interesado = relationship("CrInteresado", back_populates="membresías")


class ColDerecho(Base):
    __tablename__ = "col_derecho"
    __table_args__ = {"schema": "sinic_cr"}

    t_id = Column(Integer, primary_key=True)
    predio_id = Column(Integer, ForeignKey("sinic_cr.sinic_predio.t_id"), nullable=False)
    interesado_id = Column(Integer, ForeignKey("sinic_cr.cr_interesado.t_id"))
    agrupacion_id = Column(Integer, ForeignKey("sinic_cr.cr_agrupacion_interesados.t_id"))
    tipo_derecho = Column(String(100), default="Dominio")
    participacion = Column(Numeric(10, 6))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True))

    predio = relationship("SinicPredio", back_populates="derechos")
    interesado = relationship("CrInteresado", back_populates="derechos")
    agrupacion = relationship("CrAgrupacionInteresados", back_populates="derechos")
