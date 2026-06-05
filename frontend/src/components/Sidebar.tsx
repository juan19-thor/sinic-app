import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

interface NavGroup {
  label: string
  icon: string
  prefix: string
  items: { label: string; to: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Unidad Administrativa',
    icon: '🏛️',
    prefix: '/ua',
    items: [
      { label: 'Predios', to: '/ua/predios' },
      { label: 'Trámites Catastrales', to: '/ua/tramites' },
    ],
  },
  {
    label: 'Unidad Espacial',
    icon: '🗺️',
    prefix: '/ue',
    items: [
      { label: 'Terrenos', to: '/ue/terrenos' },
      { label: 'Unidades de Construcción', to: '/ue/unidades-construccion' },
    ],
  },
  {
    label: 'Interesados',
    icon: '👥',
    prefix: '/interesados',
    items: [
      { label: 'Interesados', to: '/interesados/lista' },
      { label: 'Agrupaciones', to: '/interesados/agrupaciones' },
    ],
  },
  {
    label: 'Topografía y Representación',
    icon: '📐',
    prefix: '/topo',
    items: [
      { label: 'Linderos', to: '/topo/linderos' },
      { label: 'Puntos de Lindero', to: '/topo/puntos-lindero' },
      { label: 'Puntos de Control', to: '/topo/puntos-control' },
    ],
  },
  {
    label: 'Cartografía Catastral',
    icon: '🏙️',
    prefix: '/carto',
    items: [
      { label: 'Límite Municipio', to: '/carto/limite-municipio' },
      { label: 'Sector Rural', to: '/carto/sector-rural' },
      { label: 'Sector Urbano', to: '/carto/sector-urbano' },
      { label: 'Perímetro Urbano', to: '/carto/perimetro-urbano' },
      { label: 'Vereda', to: '/carto/veredas' },
      { label: 'Corregimiento', to: '/carto/corregimientos' },
      { label: 'Localidad / Comuna', to: '/carto/localidades-comunas' },
      { label: 'Centro Poblado', to: '/carto/centros-poblados' },
      { label: 'Manzana', to: '/carto/manzanas' },
      { label: 'Barrio', to: '/carto/barrios' },
      { label: 'Nomenclatura Vial', to: '/carto/nomenclatura-vial' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const open = new Set<string>()
    NAV_GROUPS.forEach((g) => {
      if (location.pathname.startsWith(g.prefix)) open.add(g.label)
    })
    return open
  })

  const toggle = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🗂️</div>
        <div>
          <h1>SINIC</h1>
          <small>Modelo de Datos LADM_COL V1.0</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Modelo de Datos SINIC</div>

        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups.has(group.label)
          const isActive = location.pathname.startsWith(group.prefix)
          return (
            <div key={group.label}>
              <div
                className={`nav-group-header ${isActive ? 'active' : ''}`}
                onClick={() => toggle(group.label)}
                style={{ borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent' }}
              >
                <span className="nav-icon">{group.icon}</span>
                <span style={{ flex: 1 }}>{group.label}</span>
                <span style={{ fontSize: 11 }}>{isOpen ? '▼' : '▶'}</span>
              </div>
              {isOpen && (
                <div className="nav-sub">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    >
                      <span className="nav-icon">›</span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #2a3f5f', fontSize: 11, color: '#5a7a9a' }}>
        IGAC · SINIC · LADM_COL V1.0
        <br />EPSG:4326 · PostGIS
      </div>
    </aside>
  )
}
