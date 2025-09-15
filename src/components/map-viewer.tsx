// FILE: src/components/map-viewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon paths with bundlers (Vite/Webpack)
// This ensures marker images are correctly resolved at runtime
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

// Optional: UI imports (adjust to your UI system)
import { MapPin } from 'lucide-react';

// --- Sample mockFarmData: replace with your real mock data or import it ---
const mockFarmData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "F123",
        "name": "Shree Farm",
        "farmer": "Vinit",
        "crop": "Rice",
        "ndvi": 0.32,
        "area": "2.3 ha",
        "status": "water stress"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [73.786, 20.011],
            [73.788, 20.011],
            [73.788, 20.013],
            [73.786, 20.013],
            [73.786, 20.011]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "F456",
        "name": "Mahal Farm",
        "farmer": "Swayam",
        "crop": "Wheat",
        "ndvi": 0.68,
        "area": "1.1 ha",
        "status": "healthy"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [73.79, 20.015],
            [73.792, 20.015],
            [73.792, 20.017],
            [73.79, 20.017],
            [73.79, 20.015]
          ]
        ]
      }
    }
  ]
};

// Helper: color by NDVI (simple ramp)
const getColorByNDVI = (ndvi: number) => {
  if (ndvi >= 0.75) return '#1a9850';
  if (ndvi >= 0.6) return '#66bd63';
  if (ndvi >= 0.45) return '#fee08b';
  if (ndvi >= 0.3) return '#f46d43';
  return '#d73027';
};

export function MapViewer() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  const [selectedFarm, setSelectedFarm] = useState<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return; // already initialized

    // 1. initialize map
    const map = L.map(mapRef.current, {
      center: [20.01, 73.79], // focus to your sample coords
      zoom: 14,
      zoomControl: true
    });
    leafletMapRef.current = map;

    // 2. add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. add GeoJSON layer
    const geoJsonLayer = L.geoJSON((mockFarmData as any), {
      style: (feature: any) => ({
        fillColor: getColorByNDVI(feature.properties.ndvi),
        weight: 1,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0.7
      }),
      onEachFeature: (feature: any, layer: L.Layer) => {
        const props = feature.properties;
        const popupHtml = `
          <div style="font-size:14px">
            <strong>${props.name}</strong><br/>
            Farmer: ${props.farmer}<br/>
            Crop: ${props.crop}<br/>
            NDVI: ${props.ndvi}<br/>
            Area: ${props.area}
          </div>
        `;
        (layer as L.Layer).bindPopup(popupHtml);

        layer.on('click', () => {
          setSelectedFarm(props);
          (layer as any).openPopup();
        });

        layer.on('mouseover', function (ev: any) {
          (ev.target as L.Path).setStyle({ weight: 2, color: '#333' });
        });
        layer.on('mouseout', function (ev: any) {
          geoJsonLayer.resetStyle(ev.target);
        });
      }
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;

    // fit to data bounds if possible
    try {
      const bounds = geoJsonLayer.getBounds();
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds.pad(0.3));
      }
    } catch (err) {
      console.warn('Could not fit bounds', err);
    }

    // cleanup when unmounting
    return () => {
      geoJsonLayer.remove();
      map.remove();
      leafletMapRef.current = null;
      geoJsonLayerRef.current = null;
    };
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MapPin /> Map Explorer
      </h2>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {/* map container: must have height */}
          <div ref={mapRef} style={{ width: '100%', height: '520px', borderRadius: 6, overflow: 'hidden' }} />
        </div>

        <aside style={{ width: 320 }}>
          <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h3>Selected Farm</h3>
            {selectedFarm ? (
              <div>
                <p><strong>{selectedFarm.name}</strong></p>
                <p>Farmer: {selectedFarm.farmer}</p>
                <p>Crop: {selectedFarm.crop}</p>
                <p>NDVI: {selectedFarm.ndvi}</p>
                <p>Area: {selectedFarm.area}</p>
              </div>
            ) : (
              <div><em>Click a polygon to see details</em></div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
