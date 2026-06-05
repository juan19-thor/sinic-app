import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON as LeafletGeoJSON, FeatureGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapEditorProps {
  geom?: any
  onChange?: (geojson: any) => void
  readOnly?: boolean
  geometryType?: 'polygon' | 'line' | 'point' | 'any'
  height?: number
}

function GeomanControls({ onChange, geometryType }: { onChange?: (geojson: any) => void; geometryType?: string }) {
  const map = useMap()

  useEffect(() => {
    if (!(map as any).pm) return

    ;(map as any).pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: geometryType === 'polygon' || geometryType === 'any',
      drawPolygon: geometryType === 'polygon' || geometryType === 'any',
      drawPolyline: geometryType === 'line' || geometryType === 'any',
      drawMarker: geometryType === 'point' || geometryType === 'any',
      drawText: false,
      rotateMode: false,
    })

    const handleChange = () => {
      const layers: any[] = []
      map.eachLayer((layer: any) => {
        if (typeof layer.toGeoJSON === 'function' && layer instanceof L.Path) {
          layers.push((layer as any).toGeoJSON())
        }
      })
      if (layers.length === 0) {
        onChange?.(null)
        return
      }
      if (layers.length === 1) {
        onChange?.(layers[0].geometry)
      } else {
        onChange?.({
          type: 'GeometryCollection',
          geometries: layers.map((l) => l.geometry),
        })
      }
    }

    map.on('pm:create', handleChange)
    map.on('pm:remove', handleChange)
    map.on('pm:edit', handleChange)

    return () => {
      map.off('pm:create', handleChange)
      map.off('pm:remove', handleChange)
      map.off('pm:edit', handleChange)
    }
  }, [map, onChange, geometryType])

  return null
}

export default function MapEditor({ geom, onChange, readOnly = false, geometryType = 'any', height = 380 }: MapEditorProps) {
  const center: [number, number] = [4.711, -74.0721]
  const zoom = 12

  const geoJsonKey = JSON.stringify(geom)

  return (
    <div>
      <div className="map-label">
        {readOnly ? '📍 Geometría almacenada' : '✏️ Dibuje la geometría en el mapa'}
        {!readOnly && (
          <span style={{ marginLeft: 8, fontSize: 11, color: '#6b7280' }}>
            Use las herramientas de la izquierda para dibujar
          </span>
        )}
      </div>
      <div className="map-container" style={{ height }}>
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geom && (
            <LeafletGeoJSON
              key={geoJsonKey}
              data={geom}
              style={{ color: '#1a4f8a', weight: 2, fillOpacity: 0.2 }}
            />
          )}
          {!readOnly && <GeomanControls onChange={onChange} geometryType={geometryType} />}
        </MapContainer>
      </div>
    </div>
  )
}
