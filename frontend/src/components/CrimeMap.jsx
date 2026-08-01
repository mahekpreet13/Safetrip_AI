import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed } from 'lucide-react'
import HeatmapLayer from './HeatmapLayer.jsx'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER = [28.6139, 77.2090]
const DEFAULT_ZOOM = 12

function RecenterOnSearch({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 13)
    }
  }, [center, map])
  return null
}

function RecenterOnFirstLocation({ userLocation, hasSearched }) {
  const map = useMap()
  useEffect(() => {
    if (userLocation && !hasSearched) {
      map.setView(userLocation, 13)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation])
  return null
}

function LocateButton({ userLocation }) {
  const map = useMap()
  if (!userLocation) return null

  return (
    <button
      type="button"
      onClick={() => map.flyTo(userLocation, 14)}
      title="Go to my location"
      className="absolute z-[1000] top-3 right-3 bg-white shadow-md rounded-full p-2.5 hover:bg-gray-50 border border-gray-200"
    >
      <LocateFixed size={18} className="text-blue-600" />
    </button>
  )
}

// Automatically zooms/pans the map to show both routes fully, whenever
// route data changes — otherwise the map stays at whatever zoom it was
// on before, which often cuts off part of the route.
function FitToRoutes({ routes }) {
  const map = useMap()
  useEffect(() => {
    if (routes && routes.length > 0) {
      const allPoints = routes.flatMap((r) => r.points.map((p) => [p.latitude, p.longitude]))
      if (allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [40, 40] })
      }
    }
  }, [routes, map])
  return null
}

export default function CrimeMap({ center, markers = [], heatmapPoints = [], routes = [] }) {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude])
      },
      () => {
        setLocationError('Location access denied — showing default view instead.')
      }
    )
  }, [])

  const initialCenter = center || userLocation || DEFAULT_CENTER

  return (
    <div className="relative">
      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_ZOOM}
        style={{ height: '400px', width: '100%', borderRadius: '0.75rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <RecenterOnSearch center={center} />
        <RecenterOnFirstLocation userLocation={userLocation} hasSearched={!!center} />
        <LocateButton userLocation={userLocation} />
        <HeatmapLayer points={heatmapPoints} />
        <FitToRoutes routes={routes} />

        {routes.map((route, i) => (
          <Polyline
            key={i}
            positions={route.points.map((p) => [p.latitude, p.longitude])}
            pathOptions={{ color: route.color, weight: 5, opacity: 0.75 }}
          />
        ))}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {markers.map((marker, i) => (
          <Marker key={i} position={[marker.lat, marker.lng]}>
            <Popup>
              <strong>{marker.crime_type || marker.label || 'Location'}</strong>
              {marker.description && <p className="text-xs mt-1">{marker.description}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {locationError && (
        <p className="text-xs text-gray-500 mt-2">{locationError}</p>
      )}
    </div>
  )
}