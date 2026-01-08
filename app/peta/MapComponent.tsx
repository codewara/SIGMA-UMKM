'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    lokasi: {
        coordinates: [number, number];
    };
    wilayah: {
        kota: string;
        provinsi: string;
    };
}

interface MapComponentProps {
    umkms: UMKM[];
}

// Fix default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Color mapping for sectors
const getSectorColor = (sektor: string): string => {
    const colors: { [key: string]: string } = {
        'pertanian': '#10b981',
        'perdagangan': '#3b82f6',
        'kerajinan': '#f59e0b',
        'industri': '#8b5cf6',
        'jasa': '#06b6d4',
        'perikanan': '#06b6d4',
        'pertambangan': '#6366f1',
        'pariwisata': '#ec4899',
    };
    return colors[sektor.toLowerCase()] || '#6b7280';
};

const createSectorIcon = (sektor: string) => {
    const color = getSectorColor(sektor);
    return L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"/>
            </svg>
        `)}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// Component to handle bounds fitting
function BoundsUpdater({ bounds }: { bounds: L.LatLngTuple[] }) {
    const map = useMap();
    
    useEffect(() => {
        if (bounds.length > 0) {
            try {
                // Wait for map to be fully initialized with a small delay
                const timer = setTimeout(() => {
                    try {
                        // Check if map container exists and is ready
                        if (map && map._container && map._panes && map._panes.mapPane) {
                            const latLngBounds = L.latLngBounds(bounds);
                            map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 15 });
                        }
                    } catch (error) {
                        console.error('Error fitting bounds:', error);
                    }
                }, 300);
                
                return () => clearTimeout(timer);
            } catch (error) {
                console.error('Error in BoundsUpdater:', error);
            }
        }
    }, [bounds, map]);

    return null;
}

export default function MapComponent({ umkms }: MapComponentProps) {
    // Default center (Indonesia center)
    const defaultCenter: [number, number] = [-2.5489, 113.9213];

    // Calculate bounds
    if (umkms.length === 0) {
        return (
            <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
            </MapContainer>
        );
    }

    // Auto-calculate bounds from UMKM data (filter out items without lokasi)
    const validUmkms = umkms.filter(u => u.lokasi && u.lokasi.coordinates);
    const bounds = validUmkms.map(u => [u.lokasi.coordinates[1], u.lokasi.coordinates[0]]) as L.LatLngTuple[];
    const center = bounds.length > 0 ? bounds[0] : defaultCenter;

    console.log('MapComponent Debug:', {
        totalUmkms: umkms.length,
        validUmkms: validUmkms.length,
        boundsCount: bounds.length,
        firstValidUmkm: validUmkms[0]
    });

    return (
        <MapContainer
            center={center}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {bounds.length > 0 && <BoundsUpdater bounds={bounds} />}

            {umkms.filter(u => u.lokasi && u.lokasi.coordinates).map((umkm) => {
                const [lng, lat] = umkm.lokasi.coordinates;
                return (
                    <Marker
                        key={umkm._id}
                        position={[lat, lng]}
                        icon={createSectorIcon(umkm.sektor)}
                    >
                        <Popup>
                            <div className="min-w-48">
                                <h3 className="font-bold text-sm text-gray-800">{umkm.nama_usaha}</h3>
                                <p className="text-xs text-gray-600 mt-1">
                                    <span className="font-semibold">Sektor:</span> {umkm.sektor}
                                </p>
                                <p className="text-xs text-gray-600">
                                    <span className="font-semibold">Kota:</span> {umkm.wilayah.kota}
                                </p>
                                <p className="text-xs text-gray-600">
                                    <span className="font-semibold">Provinsi:</span> {umkm.wilayah.provinsi}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
