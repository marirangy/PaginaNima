import React, { useState, useEffect } from 'react';
import { Phone, Mail, User, Search, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDirectorios } from '../services/directoriosService';
import { useEffect, useState } from 'react';
import { getDirectorios } from '../services/api';  // 👈 Importa la función centralizada

function Directorio() {
  const [directorios, setDirectorios] = useState([]);

  useEffect(() => {
    getDirectorios()
      .then(setDirectorios)
      .catch(err => console.error('Error al obtener directorios:', err));
  }, []);

/* =========================
   ICONOS SVG PARA EL MAPA
   ========================= */
const psicologiaIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#a855f7" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="9" r="3" fill="white" stroke="none"/></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const abogadaIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#0d9488" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="9" r="3" fill="white" stroke="none"/></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


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
        const adaptados = data.map((d) => ({
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
    if (spec.includes('psic') || spec.includes('psicología')) return 'psicologia';
    if (spec.includes('derecho') || spec.includes('abogad') || spec.includes('legal'))
      return 'abogadas';
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
      esp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (esp.especializacion?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchTipo && matchSearch;
  });

  const conCoordenadas = especialistasFiltrados.filter(
    (e) =>
      typeof e.lat === 'number' && !isNaN(e.lat) &&
      typeof e.lng === 'number' && !isNaN(e.lng)
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ══════════════════════════════
              COLUMNA IZQUIERDA
              1) Panel teal (sin sticky)
              2) Mapa debajo
          ══════════════════════════════ */}
          <div className="lg:col-span-1 flex flex-col gap-8">

            {/* Panel teal — fluye normal, NO sticky */}
            <div className="bg-nima-teal text-white rounded-3xl p-8 shadow-xl">
              <div className="w-6 h-6 bg-nima-orange rounded-full mb-6"></div>
              <h1 className="text-4xl font-bold mb-6">Directorio</h1>
              <p className="text-lg leading-relaxed mb-8">
                Si necesitas ayuda profesional, aquí contamos con especialistas que pueden
                brindarte apoyo según sean tus necesidades.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Todas', value: 'todas' },
                  { label: 'Psicología', value: 'psicologia' },
                  { label: 'Abogadas', value: 'abogadas' },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setFilterType(value)}
                    className={`w-full text-left py-3 px-4 rounded-xl transition-all ${
                      filterType === value
                        ? 'bg-white text-nima-teal font-semibold'
                        : 'bg-teal-700 hover:bg-teal-600'
                    }`}
                  >
                    • {label}
                  </button>
                ))}
              </div>

              {/* Leyenda */}
              <div className="mt-8 pt-6 border-t border-teal-600">
                <p className="text-sm font-semibold mb-3 text-teal-100">LEYENDA DEL MAPA</p>
                <div className="space-y-2">
                  {[
                    { color: 'bg-purple-400', label: 'Psicología' },
                    { color: 'bg-teal-300', label: 'Abogadas' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${color} rounded-full`}></div>
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── MAPA (debajo del panel teal, misma columna) ── */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-nima-teal to-teal-600 text-white p-5 flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <h2 className="text-lg font-bold">Ubicación en el mapa</h2>
              </div>

              {conCoordenadas.length > 0 ? (
                <>
                  <div className="h-72">
                    <MapContainer
                      center={[conCoordenadas[0].lat, conCoordenadas[0].lng]}
                      zoom={11}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {conCoordenadas.map((esp) => (
                        <Marker
                          key={esp._id}
                          position={[esp.lat, esp.lng]}
                          icon={iconFor(esp)}
                          eventHandlers={{ click: () => setSelectedEspecialista(esp) }}
                        >
                          <Popup>
                            <div className="p-1 min-w-[160px]">
                              <p className="font-bold text-sm text-gray-800">{esp.nombre}</p>
                              <p className="text-xs text-gray-500">{esp.especializacion}</p>
                              {esp.direccion && (
                                <p className="text-xs text-gray-400 mt-1">{esp.direccion}</p>
                              )}
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${esp.lat},${esp.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-teal-600 font-semibold flex items-center gap-1 mt-2"
                              >
                                <Navigation size={10} /> Cómo llegar
                              </a>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Detalle del especialista al hacer clic en marcador */}
                  {selectedEspecialista && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-sm text-gray-800">
                            {selectedEspecialista.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedEspecialista.especializacion}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedEspecialista(null)}
                          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-1 text-xs mb-3">
                        {selectedEspecialista.telefono.length > 0 && (
                          <p className="flex items-center gap-1 text-gray-600">
                            <Phone size={11} className="text-nima-teal" />
                            {selectedEspecialista.telefono.join(' / ')}
                          </p>
                        )}
                        {selectedEspecialista.correo && (
                          <p className="flex items-center gap-1 text-gray-600 break-all">
                            <Mail size={11} className="text-nima-teal" />
                            {selectedEspecialista.correo}
                          </p>
                        )}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEspecialista.lat},${selectedEspecialista.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-nima-teal text-white text-xs px-3 py-2 rounded-full hover:bg-teal-700 transition-colors"
                      >
                        <Navigation size={12} /> Cómo llegar
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sin ubicaciones disponibles</p>
                  </div>
                </div>
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
      </div>
    </div>
  );
};
}
export default Directorio;

