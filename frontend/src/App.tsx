import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'

// Unidad Administrativa
import PrediosPage from './pages/unidad-administrativa/PrediosPage'
import TramitesPage from './pages/unidad-administrativa/TramitesPage'

// Unidad Espacial
import TerrenosPage from './pages/unidad-espacial/TerrenosPage'
import UnidadesConstruccionPage from './pages/unidad-espacial/UnidadesConstruccionPage'

// Interesados
import InteresadosPage from './pages/interesados/InteresadosPage'
import AgrupacionesPage from './pages/interesados/AgrupacionesPage'

// Topografía
import LinderosPage from './pages/topografia/LinderosPage'
import PuntosLinderoPage from './pages/topografia/PuntosLinderoPage'
import PuntosControlPage from './pages/topografia/PuntosControlPage'

// Cartografía
import CartografiaGenericPage from './pages/cartografia/CartografiaGenericPage'
import { cartografiaApi } from './services/api'

function Home() {
  return (
    <div>
      <div className="page-header">
        <h2>🗂️ SINIC — Modelo de Datos LADM_COL SINIC V1.0</h2>
        <p>Sistema Nacional de Información Catastral — Gestión de Datos Catastrales</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🏛️', title: 'Unidad Administrativa', desc: 'Predios y trámites catastrales (SINIC_Predio)', link: '/ua/predios' },
          { icon: '🗺️', title: 'Unidad Espacial', desc: 'Terrenos y construcciones con geometría espacial', link: '/ue/terrenos' },
          { icon: '👥', title: 'Interesados', desc: 'Personas naturales, jurídicas y agrupaciones', link: '/interesados/lista' },
          { icon: '📐', title: 'Topografía y Representación', desc: 'Linderos, puntos y relaciones topográficas', link: '/topo/linderos' },
          { icon: '🏙️', title: 'Cartografía Catastral', desc: 'Capas cartográficas del submodelo SINIC V1.0', link: '/carto/limite-municipio' },
        ].map((card) => (
          <a key={card.title} href={card.link} className="card" style={{ textDecoration: 'none', display: 'block', transition: 'box-shadow .15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,79,138,.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary-dark)', marginBottom: 6 }}>{card.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{card.desc}</div>
          </a>
        ))}
      </div>
      <div className="card">
        <div className="card-title">📋 Referencia del Modelo</div>
        <div style={{ marginTop: 12, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <p><strong>Estándar:</strong> LADM_COL SINIC V1.0 — Resolución IGAC 301 de 2025</p>
          <p><strong>SRID:</strong> EPSG:4326 (WGS84) para almacenamiento web. Producción oficial: EPSG:9377 (MAGNA-SIRGAS Colombia)</p>
          <p><strong>Esquema DB:</strong> <code>sinic_cr</code> en PostgreSQL 12+ con extensión PostGIS</p>
          <p><strong>API:</strong> <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>http://localhost:8000/docs</a> (Swagger/OpenAPI)</p>
        </div>
      </div>
    </div>
  )
}

// Wrappers para las capas cartográficas
const LimiteMunicipio = () => <CartografiaGenericPage title="Límite Municipio" subtitle="CC_LimiteMunicipio — Límites geográficos entre municipios (MultiPolygon)" icon="🗺️" api={cartografiaApi['limiteMunicipio']} geometryType="polygon" />
const SectorRural = () => <CartografiaGenericPage title="Sector Rural" subtitle="CC_SectorRural — Sectores rurales catastrales (MultiPolygon)" icon="🌾" api={cartografiaApi['sectorRural']} geometryType="polygon" extraFields={[{ key: 'zona', label: 'Zona' }, { key: 'sector', label: 'Sector' }]} />
const SectorUrbano = () => <CartografiaGenericPage title="Sector Urbano" subtitle="CC_SectorUrbano — Sectores urbanos catastrales (MultiPolygon)" icon="🏙️" api={cartografiaApi['sectorUrbano']} geometryType="polygon" extraFields={[{ key: 'zona', label: 'Zona' }, { key: 'sector', label: 'Sector' }]} />
const PerimetroUrbano = () => <CartografiaGenericPage title="Perímetro Urbano" subtitle="CC_PerimetroUrbano — Delimitación física del suelo urbano (MultiPolygon)" icon="🔷" api={cartografiaApi['perimetroUrbano']} geometryType="polygon" />
const Veredas = () => <CartografiaGenericPage title="Vereda" subtitle="CC_Vereda — Espacios rurales delimitados por accidentes geográficos (MultiPolygon)" icon="🌿" api={cartografiaApi['veredas']} geometryType="polygon" />
const Corregimientos = () => <CartografiaGenericPage title="Corregimiento" subtitle="CC_Corregimiento — Divisiones del área rural del municipio (MultiPolygon)" icon="🏡" api={cartografiaApi['corregimientos']} geometryType="polygon" />
const LocalidadesComunas = () => <CartografiaGenericPage title="Localidad / Comuna" subtitle="CC_LocalidadComuna — Unidades administrativas del área urbana (MultiPolygon)" icon="🏘️" api={cartografiaApi['localidadesComunas']} geometryType="polygon" />
const CentrosPoblados = () => <CartografiaGenericPage title="Centro Poblado" subtitle="CC_CentroPoblado — Núcleos o asentamientos de población (MultiPolygon)" icon="🏠" api={cartografiaApi['centrosPoblados']} geometryType="polygon" />
const Manzanas = () => <CartografiaGenericPage title="Manzana" subtitle="CC_Manzana — Áreas delimitadas por vías de tránsito (MultiPolygon)" icon="🧱" api={cartografiaApi['manzanas']} geometryType="polygon" />
const Barrios = () => <CartografiaGenericPage title="Barrio" subtitle="CC_Barrio — Unidades geográficas urbanas (MultiPolygon)" icon="🏘️" api={cartografiaApi['barrios']} geometryType="polygon" />
const NomenclaturaVial = () => <CartografiaGenericPage title="Nomenclatura Vial" subtitle="CC_NomenclaturaVial — Identificación de vías (MultiLineString)" icon="🛣️" api={cartografiaApi['nomenclaturaVial']} geometryType="line" extraFields={[{ key: 'tipo_via', label: 'Tipo Vía' }]} />

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Unidad Administrativa */}
            <Route path="/ua/predios" element={<PrediosPage />} />
            <Route path="/ua/tramites" element={<TramitesPage />} />
            {/* Unidad Espacial */}
            <Route path="/ue/terrenos" element={<TerrenosPage />} />
            <Route path="/ue/unidades-construccion" element={<UnidadesConstruccionPage />} />
            {/* Interesados */}
            <Route path="/interesados/lista" element={<InteresadosPage />} />
            <Route path="/interesados/agrupaciones" element={<AgrupacionesPage />} />
            {/* Topografía */}
            <Route path="/topo/linderos" element={<LinderosPage />} />
            <Route path="/topo/puntos-lindero" element={<PuntosLinderoPage />} />
            <Route path="/topo/puntos-control" element={<PuntosControlPage />} />
            {/* Cartografía */}
            <Route path="/carto/limite-municipio" element={<LimiteMunicipio />} />
            <Route path="/carto/sector-rural" element={<SectorRural />} />
            <Route path="/carto/sector-urbano" element={<SectorUrbano />} />
            <Route path="/carto/perimetro-urbano" element={<PerimetroUrbano />} />
            <Route path="/carto/veredas" element={<Veredas />} />
            <Route path="/carto/corregimientos" element={<Corregimientos />} />
            <Route path="/carto/localidades-comunas" element={<LocalidadesComunas />} />
            <Route path="/carto/centros-poblados" element={<CentrosPoblados />} />
            <Route path="/carto/manzanas" element={<Manzanas />} />
            <Route path="/carto/barrios" element={<Barrios />} />
            <Route path="/carto/nomenclatura-vial" element={<NomenclaturaVial />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={4000} theme="light" />
    </BrowserRouter>
  )
}
