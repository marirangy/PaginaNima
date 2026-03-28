import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { getCentros } from '../services/api';   


const saludIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#10b981" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <g transform="translate(6,6)">
          <rect x="4" y="0" width="2" height="8" fill="white"/>
          <rect x="0" y="3" width="10" height="2" fill="white"/>
        </g>
      </svg>
    `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const fiscaliaIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <g transform="translate(6,6)" fill="white">
          <path d="M5 0 L8 6 H2 Z"></path>
          <rect x="4" y="6" width="2" height="4"></rect>
        </g>
      </svg>
    `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const mujeresIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#a855f7" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <g transform="translate(6,6)" fill="white">
          <circle cx="5" cy="3" r="3"></circle>
          <rect x="4" y="6" width="2" height="4"></rect>
          <rect x="2" y="10" width="6" height="2"></rect>
        </g>
      </svg>
    `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function RouteControl({ from, to }) {
  const map = useMap();
  const [control, setControl] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadAndDraw = async () => {
      try {
       
        if (typeof window !== 'undefined' && !(L.Routing && L.Routing.control)) {
          await import('leaflet-routing-machine'); // registra L.Routing
        }

       
        if (!from || !to || !(L.Routing && L.Routing.control)) {
          if (control) {
            map.removeControl(control);
            setControl(null);
          }
          return;
        }

        
        if (control) {
          map.removeControl(control);
          setControl(null);
        }

        const newControl = L.Routing.control({
          waypoints: [L.latLng(from), L.latLng(to)],
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          show: false,
          lineOptions: { styles: [{ weight: 6, opacity: 0.85 }] },
          router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
          createMarker: () => null,
        }).addTo(map);

        if (mounted) setControl(newControl);
      } catch (e) {
        console.error('Error cargando routing machine:', e);
      }
    };

    loadAndDraw();

    return () => {
      mounted = false;
      if (control) map.removeControl(control);
    };
  }, [from, to, map]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}


const CentrosApoyo = () => {
  const [centros, setCentros] = useState([]);
  const [selectedType, setSelectedType] = useState('todos'); // 'salud' | 'fiscalia' | 'mujeres' | 'todos'
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  
  const [mapCenter, setMapCenter] = useState([19.4326, -99.1332]); // CDMX
  const [userPos, setUserPos] = useState(null);


  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const data = await getCentros();

        const normalized = (data || []).map((c) => {
          let lat = c.lat, lng = c.lng;

          
          if (typeof lat === 'string') lat = parseFloat(lat);
          if (typeof lng === 'string') lng = parseFloat(lng);

          
          if ((lat == null || Number.isNaN(lat)) && c.location?.coordinates) {
            lat = Number(c.location.coordinates[1]);
            lng = Number(c.location.coordinates[0]);
          }

          
          if ((lat == null || Number.isNaN(lat)) && c.posicion?.lat != null) lat = Number(c.posicion.lat);
          if ((lng == null || Number.isNaN(lng)) && c.posicion?.lng != null) lng = Number(c.posicion.lng);

          if (Number.isNaN(lat)) lat = null;
          if (Number.isNaN(lng)) lng = null;

          return { ...c, lat, lng };
        });

        const conCoord = normalized.filter((x) => typeof x.lat === 'number' && typeof x.lng === 'number');
        console.log(`Centros totales: ${normalized.length} | Con coordenadas: ${conCoord.length}`);
        setCentros(normalized);
      } catch (error) {
        console.error('Error al cargar centros:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCentros();
  }, []);

 
  const depKey = (dep) => {
    const d = (dep || '').toLowerCase();
    if (d.includes('salud')) return 'salud';
    if (d.includes('fiscal')) return 'fiscalia';
    if (d.includes('mujer')) return 'mujeres';
    return ''; // desconocido
  };

 
  const centrosFiltrados = useMemo(() => {
    return centros.filter((centro) => {
      const tipoDep = depKey(centro.dependencia);
      const matchType = selectedType === 'todos' || tipoDep === selectedType;

      const nombre = (centro.nombre || '').toLowerCase();
      const alcaldia = (centro.alcaldia || centro.delegacion || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      const matchSearch = nombre.includes(term) || alcaldia.includes(term);

      return matchType && matchSearch;
    });
  }, [centros, selectedType, searchTerm]);

  const handleCenterClick = (centro) => {
    setSelectedCenter(centro);
    if (typeof centro.lat === 'number' && typeof centro.lng === 'number') {
      setMapCenter([centro.lat, centro.lng]);
    }
  };

  const handleMapClick = () => setSelectedCenter(null);

  // Botón "Mi ubicación"
  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        setMapCenter(p);
      },
      (err) => console.warn('Geoloc error:', err),
      { enableHighAccuracy: true }
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Cargando centros…</div>;
  }

  // Selección de icono por dependencia
  const iconFor = (centro) => {
    const k = depKey(centro.dependencia);
    if (k === 'salud') return saludIcon;
    if (k === 'fiscalia') return fiscaliaIcon;
    return mujeresIcon; // default a mujeres si no coincide
  };

  // Color chip por dependencia
  const chipColor = (centro) => {
    const k = depKey(centro.dependencia);
    if (k === 'salud') return 'bg-emerald-500';
    if (k === 'fiscalia') return 'bg-red-500';
    return 'bg-purple-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel Izquierdo - Filtros (Sticky) */}
          <div className="lg:w-1/3 lg:sticky lg:top-8 h-fit">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              {/* Punto decorativo naranja */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <h1 className="text-4xl font-bold text-teal-700">
                  Centros de apoyo
                </h1>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Encuentra centros de apoyo cerca de ti. Lugares seguros con atención especializada disponibles.
              </p>

              {/* Búsqueda */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar por nombre o alcaldía..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Filtros de dependencia */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  FILTRAR POR DEPENDENCIA
                </p>

                <button
                  onClick={() => setSelectedType('todos')}
                  className={`w-full text-left px-6 py-3 rounded-full transition-all ${
                    selectedType === 'todos'
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos los centros
                </button>

                <button
                  onClick={() => setSelectedType('salud')}
                  className={`w-full text-left px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                    selectedType === 'salud'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                  Secretaría de Salud
                </button>

                <button
                  onClick={() => setSelectedType('fiscalia')}
                  className={`w-full text-left px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                    selectedType === 'fiscalia'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
                  Fiscalía General de Justicia
                </button>

                <button
                  onClick={() => setSelectedType('mujeres')}
                  className={`w-full text-left px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                    selectedType === 'mujeres'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-3 h-3 bg-purple-400 rounded-full border-2 border-white"></div>
                  Secretaría de las Mujeres
                </button>
              </div>

              {/* Contador */}
              <div className="mt-6 p-4 bg-teal-50 rounded-2xl">
                <p className="text-sm text-teal-700">
                  <span className="font-bold">{centrosFiltrados.length}</span> centros disponibles
                </p>
              </div>

              {/* Información adicional + Mi ubicación */}
              <div className="mt-6 p-4 bg-orange-50 rounded-2xl">
                <div className="flex items-start gap-2 mb-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <p className="text-sm text-gray-700">
                    <strong>Tip:</strong> Haz clic en cualquier marcador del mapa para ver más información y trazar la ruta desde tu ubicación.
                  </p>
                </div>

                <button
                  onClick={goToMyLocation}
                  className="w-full bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Mi ubicación
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Mapa */}
          <div className="lg:w-2/3">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
              {/* Header del mapa */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Mapa de Centros</h2>
                  </div>
                </div>
              </div>

              {/* Mapa REAL con Leaflet */}
              <div className="h-[545px]" onClick={handleMapClick}>
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom
                >
                  {/* Base OpenStreetMap */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marcadores de centros */}
                  {centrosFiltrados.map((centro) =>
                    (typeof centro.lat === 'number' && typeof centro.lng === 'number') ? (
                      <Marker
                        key={centro._id || centro.id}
                        position={[centro.lat, centro.lng]}
                        icon={iconFor(centro)}
                        eventHandlers={{ click: () => handleCenterClick(centro) }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold text-gray-800 mb-1">{centro.nombre}</h3>
                            <p className="text-sm text-gray-600 mb-1"><b>Dependencia:</b> {centro.dependencia}</p>
                            <p className="text-sm text-gray-600 mb-1">{centro.direccion}</p>
                            <p className="text-xs text-gray-500">{centro.alcaldia || centro.delegacion}</p>
                            {centro.telefono && (
                              <p className="text-xs text-gray-500"><b>Tel:</b> {centro.telefono}</p>
                            )}
                            {centro.horario && (
                              <p className="text-xs text-gray-500"><b>Horario:</b> {centro.horario}</p>
                            )}
                            {(centro.servicios || []).length > 0 && (
                              <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
                                {(centro.servicios || []).map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            )}
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${centro.lat},${centro.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-teal-600 font-semibold"
                            >
                              Cómo llegar
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null
                  )}

                  {/* Ruta: desde mi ubicación hasta el centro seleccionado */}
                  <RouteControl
                    from={userPos}
                    to={selectedCenter ? [selectedCenter.lat, selectedCenter.lng] : null}
                  />
                </MapContainer>
              </div>

              {/* Overlay de información cuando se selecciona un centro */}
              {selectedCenter && (
                <div className="p-6 bg-white border-t border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 ${chipColor(selectedCenter)}`}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {selectedCenter.nombre}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedCenter.dependencia}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleMapClick}
                      className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">{selectedCenter.direccion}</p>
                        <p className="text-xs text-gray-500">{selectedCenter.alcaldia || selectedCenter.delegacion}</p>
                      </div>
                    </div>

                    {selectedCenter.telefono && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <a
                          href={`tel:${selectedCenter.telefono}`}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          {selectedCenter.telefono}
                        </a>
                      </div>
                    )}

                    {selectedCenter.horario && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{selectedCenter.horario}</p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">SERVICIOS:</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCenter.servicios || []).map((servicio, index) => (
                          <span
                            key={index}
                            className="text-xs px-3 py-1 bg-teal-50 text-teal-700 rounded-full"
                          >
                            {servicio}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full mt-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Cómo llegar
                    </a>
                  </div>
                </div>
              )}

              {/* Leyenda del mapa */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-sm text-gray-700">Secretaría de Salud</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-sm text-gray-700">Fiscalía General de Justicia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                    <span className="text-sm text-gray-700">Secretaría de las Mujeres</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Si quieres, aquí puedes mantener tu “lista de centros” como la tenías */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentrosApoyo; 
