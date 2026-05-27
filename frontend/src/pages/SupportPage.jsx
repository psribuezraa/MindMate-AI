import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  AlertTriangle,
  Search,
  Loader,
  MapPinOff,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Fix Leaflet's default marker icon issue with bundlers
   ────────────────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'user-marker',
});

const clinicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ──────────────────────────────────────────────
   Curated list of real mental health clinics in Indonesia
   ────────────────────────────────────────────── */
const CLINICS = [
  {
    id: 1,
    name: 'RS Jiwa Dr. Soeharto Heerdjan',
    address: 'Jl. Prof. Dr. Latumeten No.1, Grogol, Jakarta Barat',
    phone: '(021) 5682841',
    hours: 'Mon–Fri: 08:00–16:00',
    lat: -6.1534,
    lng: 106.7942,
    type: 'Rumah Sakit Jiwa',
  },
  {
    id: 2,
    name: 'Yayasan Pulih',
    address: 'Jl. Teluk Peleng No.63, Rawa Bambu, Jakarta Selatan',
    phone: '(021) 788-42580',
    hours: 'Mon–Fri: 09:00–17:00',
    lat: -6.2615,
    lng: 106.7824,
    type: 'Konseling & Trauma Recovery',
  },
  {
    id: 3,
    name: 'Into The Light Indonesia',
    address: 'Jakarta, Indonesia',
    phone: '119 ext. 8',
    hours: '24/7 Hotline',
    lat: -6.2088,
    lng: 106.8456,
    type: 'Suicide Prevention',
  },
  {
    id: 4,
    name: 'RS Jiwa Prof. Dr. Soerojo Magelang',
    address: 'Jl. Ahmad Yani No.169, Magelang, Jawa Tengah',
    phone: '(0293) 363601',
    hours: 'Mon–Sat: 07:30–14:00',
    lat: -7.4797,
    lng: 110.2177,
    type: 'Rumah Sakit Jiwa',
  },
  {
    id: 5,
    name: 'Riliv (Online Counseling)',
    address: 'Surabaya, Jawa Timur (Online)',
    phone: 'Via App',
    hours: 'Flexible Scheduling',
    lat: -7.2575,
    lng: 112.7521,
    type: 'Online Counseling Platform',
  },
  {
    id: 6,
    name: 'Pijar Psikologi',
    address: 'Jl. Raya Janti, Banguntapan, Bantul, Yogyakarta',
    phone: '(0274) 450858',
    hours: 'Mon–Fri: 08:00–17:00',
    lat: -7.7956,
    lng: 110.4018,
    type: 'Klinik Psikologi',
  },
  {
    id: 7,
    name: 'RS Jiwa Menur',
    address: 'Jl. Menur No.120, Manyar Sabrangan, Surabaya',
    phone: '(031) 5947571',
    hours: 'Mon–Sat: 07:00–14:00',
    lat: -7.2896,
    lng: 112.7669,
    type: 'Rumah Sakit Jiwa',
  },
  {
    id: 8,
    name: 'Sejiwa (LSM Kesehatan Mental)',
    address: 'Bandung, Jawa Barat',
    phone: '119 ext. 8',
    hours: 'Mon–Fri: 09:00–17:00',
    lat: -6.9175,
    lng: 107.6191,
    type: 'Komunitas Kesehatan Mental',
  },
  {
    id: 9,
    name: 'Klinik Psikologi Atma Jaya',
    address: 'Jl. Jend. Sudirman No.51, Jakarta Selatan',
    phone: '(021) 5703306',
    hours: 'Mon–Fri: 08:00–16:00',
    lat: -6.2053,
    lng: 106.8226,
    type: 'Klinik Psikologi Universitas',
  },
  {
    id: 10,
    name: 'RSJ Provinsi Bali',
    address: 'Jl. Kusuma Yudha No.1, Bangli, Bali',
    phone: '(0366) 91091',
    hours: 'Mon–Sat: 07:30–14:00',
    lat: -8.4548,
    lng: 115.3494,
    type: 'Rumah Sakit Jiwa',
  },
  {
    id: 11,
    name: 'Talklife Counseling Center',
    address: 'Jl. Kemang Raya No.15, Jakarta Selatan',
    phone: '(021) 71793960',
    hours: 'Mon–Sat: 09:00–20:00',
    lat: -6.2622,
    lng: 106.8141,
    type: 'Konseling & Psikoterapi',
  },
  {
    id: 12,
    name: 'RS Marzoeki Mahdi Bogor',
    address: 'Jl. Dr. Sumeru No.114, Bogor, Jawa Barat',
    phone: '(0251) 8324024',
    hours: 'Mon–Fri: 08:00–15:00',
    lat: -6.5971,
    lng: 106.7872,
    type: 'Rumah Sakit Jiwa',
  },
];

/* ──────────────────────────────────────────────
   Crisis Hotlines
   ────────────────────────────────────────────── */
const HOTLINES = [
  {
    name: 'Into The Light Indonesia',
    number: '119 ext. 8',
    description: 'Pencegahan bunuh diri & krisis',
    available: '24/7',
  },
  {
    name: 'LSM Jangan Bunuh Diri',
    number: '021-9696 9293',
    description: 'Hotline krisis & konseling',
    available: '24/7',
  },
  {
    name: 'Yayasan Pulih',
    number: '(021) 788-42580',
    description: 'Trauma recovery & konseling',
    available: 'Senin–Jumat, 09:00–17:00',
  },
  {
    name: 'Sejiwa (Hotline)',
    number: '119 ext. 8',
    description: 'Dukungan kesehatan mental',
    available: '24/7',
  },
];

/* ──────────────────────────────────────────────
   Haversine distance calculation (km)
   ────────────────────────────────────────────── */
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ──────────────────────────────────────────────
   Helper: fly map to a location
   ────────────────────────────────────────────── */
function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13, { duration: 1.2 });
  }, [center, map]);
  return null;
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function SupportPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);

  /* ── Get user location on mount ── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoading(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Showing all clinics.'
            : 'Unable to detect location. Showing all clinics.'
        );
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 60000 }
    );
  }, []);

  /* ── Compute distances and sort clinics ── */
  const clinicsWithDistance = useMemo(() => {
    return CLINICS.map((clinic) => ({
      ...clinic,
      distance: userLocation
        ? getDistanceKm(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng)
        : null,
    })).sort((a, b) => {
      if (a.distance === null || b.distance === null) return 0;
      return a.distance - b.distance;
    });
  }, [userLocation]);

  /* ── Filter by search ── */
  const filteredClinics = useMemo(() => {
    if (!searchQuery.trim()) return clinicsWithDistance;
    const q = searchQuery.toLowerCase();
    return clinicsWithDistance.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
    );
  }, [clinicsWithDistance, searchQuery]);

  /* ── Map center: user location or default to Jakarta ── */
  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-6.2088, 106.8456]; // Jakarta fallback

  const handleClinicClick = (clinic) => {
    setSelectedClinic(clinic.id);
    setFlyTarget([clinic.lat, clinic.lng]);
  };

  const openDirections = (clinic) => {
    const url = userLocation
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${clinic.lat},${clinic.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="support-page" id="support-page">
      {/* ── Header ── */}
      <div className="support-header">
        <div className="support-header-text">
          <h1 className="support-title">Local Support</h1>
          <p className="support-subtitle">
            Find mental health professionals and crisis resources near you.
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="support-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search clinics, locations, or services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="support-search-input"
        />
      </div>

      {/* ── Location Status ── */}
      {locationError && (
        <div className="support-location-notice">
          <MapPinOff size={16} />
          <span>{locationError}</span>
        </div>
      )}

      {/* ── Main Content: Map + List ── */}
      <div className="support-content">
        {/* Map */}
        <div className="support-map-container">
          {isLoading ? (
            <div className="support-map-loading">
              <Loader size={24} className="spin" />
              <p>Detecting your location...</p>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={userLocation ? 12 : 6}
              style={{ height: '100%', width: '100%', borderRadius: '16px' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {flyTarget && <FlyToLocation center={flyTarget} />}

              {/* User location marker */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>
                    <strong>📍 Your Location</strong>
                  </Popup>
                </Marker>
              )}

              {/* Clinic markers */}
              {filteredClinics.map((clinic) => (
                <Marker
                  key={clinic.id}
                  position={[clinic.lat, clinic.lng]}
                  icon={clinicIcon}
                  eventHandlers={{
                    click: () => setSelectedClinic(clinic.id),
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <strong>{clinic.name}</strong>
                      <br />
                      <span style={{ fontSize: 12, color: '#5A5A52' }}>{clinic.type}</span>
                      <br />
                      <span style={{ fontSize: 12 }}>{clinic.address}</span>
                      {clinic.distance !== null && (
                        <>
                          <br />
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#4A5E4A' }}>
                            {clinic.distance.toFixed(1)} km away
                          </span>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Clinic List */}
        <div className="support-clinic-list">
          <h3 className="support-list-title">
            {userLocation ? 'Nearest Clinics' : 'All Clinics'}
            <span className="support-list-count">{filteredClinics.length}</span>
          </h3>

          <div className="support-cards-scroll">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className={`support-clinic-card ${selectedClinic === clinic.id ? 'selected' : ''}`}
                onClick={() => handleClinicClick(clinic)}
                id={`clinic-card-${clinic.id}`}
              >
                <div className="support-clinic-card-header">
                  <div>
                    <h4 className="support-clinic-name">{clinic.name}</h4>
                    <span className="support-clinic-type">{clinic.type}</span>
                  </div>
                  {clinic.distance !== null && (
                    <span className="support-clinic-distance">
                      {clinic.distance.toFixed(1)} km
                    </span>
                  )}
                </div>

                <div className="support-clinic-details">
                  <div className="support-clinic-detail">
                    <MapPin size={14} />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="support-clinic-detail">
                    <Phone size={14} />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="support-clinic-detail">
                    <Clock size={14} />
                    <span>{clinic.hours}</span>
                  </div>
                </div>

                <button
                  className="support-directions-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirections(clinic);
                  }}
                >
                  <Navigation size={14} />
                  Get Directions
                </button>
              </div>
            ))}

            {filteredClinics.length === 0 && (
              <div className="support-no-results">
                <MapPinOff size={24} />
                <p>No clinics match your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Crisis Hotlines ── */}
      <div className="support-crisis-section">
        <div className="support-crisis-header">
          <AlertTriangle size={20} />
          <h3>Crisis Hotlines — Available 24/7</h3>
        </div>
        <p className="support-crisis-subtitle">
          If you or someone you know is in immediate danger, please call one of these numbers.
        </p>

        <div className="support-hotlines-grid">
          {HOTLINES.map((hotline, i) => (
            <div key={i} className="support-hotline-card">
              <h4 className="support-hotline-name">{hotline.name}</h4>
              <a href={`tel:${hotline.number.replace(/\s/g, '')}`} className="support-hotline-number">
                <Phone size={14} />
                {hotline.number}
              </a>
              <p className="support-hotline-desc">{hotline.description}</p>
              <span className="support-hotline-availability">{hotline.available}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
