import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDirectorios } from '../services/api';
import { Phone, Mail, Search, MapPin, Navigation, User } from 'lucide-react';

/* =========================
   ICONOS SVG PARA EL MAPA
   ========================= */
const psicologiaIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#a855f7"><circle cx="12" cy="12" r="10"/></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const abogadaIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#0d9488"><circle cx="12" cy="12" r="10"/></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// 🔥 FIX: icono por defecto
const otraIcon = psicologiaIcon;

/* =========================
   COMPONENTE PRINCIPAL
   ========================= */
const Directorio = () => {
  const [filterType, setFilterType] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEspecialista, setSelectedEspecialista] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDirectorios();
        const lista = data.directorios || data; // 👈 solución flexible
        const adaptados = lista.map((d) => ({
          ...d,
          especializacion: d.especialidad ?? '',
          correo: d.correo ?? d.email ?? '',
          telefono: Array.isArray(d.telefono)
            ? d.telefono
            : d.telefono
            ? [d.telefono]
            : [],
          lat: d.posicion?.lat != null ? Number(d.posicion.lat) : null,
          lng: d.posicion?.lng != null ? Number(d.posicion.lng) : null,
        }));

        setEspecialistas(adaptados);
      } catch (error) {
        console.error('Error al cargar directorios:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTipo = (esp) => {
    const spec = (esp.especializacion?.toLowerCase() || '').trim();
    if (spec.includes('psic')) return 'psicologia';
    if (spec.includes('derecho') || spec.includes('abogad')) return 'abogadas';
    return 'otras';
  };

  const iconFor = (esp) => {
    const tipo = getTipo(esp);
    if (tipo === 'psicologia') return psicologiaIcon;
    if (tipo === 'abogadas') return abogadaIcon;
    return otraIcon;
  };

  const especialistasFiltrados = especialistas.filter((esp) => {
    const tipoDetectado = getTipo(esp);
    const matchTipo = filterType === 'todas' || tipoDetectado === filterType;

    const matchSearch =
      esp.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      esp.especializacion?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchTipo && matchSearch;
  });

  const conCoordenadas = especialistasFiltrados.filter(
    (e) =>
      typeof e.lat === 'number' &&
      !isNaN(e.lat) &&
      typeof e.lng === 'number' &&
      !isNaN(e.lng)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-nima-teal text-xl font-semibold">
        Cargando directorio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* PANEL */}
        <div className="bg-nima-teal text-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-6">Directorio</h1>

          <div className="space-y-3">
            {['todas', 'psicologia', 'abogadas'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFilterType(tipo)}
                className="block w-full text-left"
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* MAPA */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden">
          {conCoordenadas.length > 0 ? (
            <MapContainer
              center={[conCoordenadas[0].lat, conCoordenadas[0].lng]}
              zoom={11}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {conCoordenadas.map((esp) => (
                <Marker
                  key={esp._id}
                  position={[esp.lat, esp.lng]}
                  icon={iconFor(esp)}
                >
                  <Popup>
                    <strong>{esp.nombre}</strong>
                    <p>{esp.especializacion}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <p className="p-6 text-center text-gray-400">
              Sin ubicaciones disponibles
            </p>
          )}
        </div>
        </div>

          {/* ══════════════════════════════
              COLUMNA DERECHA
              Búsqueda + tarjetas + nota
          ══════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Búsqueda */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre o especialización..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-nima-teal focus:outline-none transition-colors"
              />
            </div>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {especialistasFiltrados.length > 0 ? (
                especialistasFiltrados.map((especialista) => (
                  <div
                    key={especialista._id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-nima-pink to-nima-purple rounded-full flex items-center justify-center">
                        <User size={40} className="text-white" />
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-bold text-gray-800">{especialista.nombre}</h3>
                      <p className="text-gray-600 font-medium">{especialista.especializacion}</p>

                      <div className="flex justify-center py-2">
                        <div className="w-20 h-px bg-nima-orange"></div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {/* Teléfonos */}
                        {especialista.telefono.length > 0 ? (
                          especialista.telefono.map((tel, i) => (
                            <div key={i} className="flex items-center justify-center gap-2 text-gray-700">
                              <Phone size={16} className="text-nima-teal shrink-0" />
                              <a href={`tel:${tel}`} className="hover:text-nima-teal transition-colors">
                                {tel}
                              </a>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-gray-400">
                            <Phone size={16} className="shrink-0" />
                            <span>Sin teléfono</span>
                          </div>
                        )}

                        {/* Correo */}
                        {especialista.correo ? (
                          <div className="flex items-center justify-center gap-2 text-gray-700">
                            <Mail size={16} className="text-nima-teal shrink-0" />
                            <a
                              href={`mailto:${especialista.correo}`}
                              className="hover:text-nima-teal transition-colors break-all"
                            >
                              {especialista.correo}
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-gray-400">
                            <Mail size={16} className="shrink-0" />
                            <span>Sin correo</span>
                          </div>
                        )}

                        {/* Dirección */}
                        {especialista.direccion && (
                          <div className="flex items-start justify-center gap-2 text-gray-700">
                            <MapPin size={16} className="text-nima-teal shrink-0 mt-0.5" />
                            {especialista.lat && especialista.lng ? (
                              <a
                                href={`https://www.google.com/maps?q=${especialista.lat},${especialista.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-nima-teal transition-colors text-left"
                              >
                                {especialista.direccion}
                              </a>
                            ) : (
                              <span className="text-left">{especialista.direccion}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-xl text-gray-500">
                    No se encontraron especialistas con los criterios seleccionados.
                  </p>
                </div>
              )}
            </div>

            {/* Nota al pie */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
              <p className="text-gray-700 leading-relaxed">
                Todos los profesionales listados están verificados y especializados en apoyo a
                mujeres en situaciones de violencia. No dudes en contactarlos.
              </p>
            </div>

          </div>
        </div>
  );
};
export default Directorio;

