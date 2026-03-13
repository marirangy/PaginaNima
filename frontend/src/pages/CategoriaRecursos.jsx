import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText, ChevronRight, Loader, AlertCircle, Heart, Scale, Home, DollarSign } from 'lucide-react';
import '../styles/recursos.css';

const CategoriaRecursos = () => {
  const { categoria } = useParams();
  const [recursos, setRecursos] = useState([]);
  const [categoriaInfo, setCategoriaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de iconos
  const iconMap = {
    'Heart': Heart,
    'Scale': Scale,
    'Home': Home,
    'DollarSign': DollarSign
  };

  // Mapeo de colores
  const colorMap = {
    'pink': 'bg-pink-100 text-pink-600',
    'teal': 'bg-teal-100 text-teal-600',
    'purple': 'bg-purple-100 text-purple-600',
    'orange': 'bg-orange-100 text-orange-600'
  };

  useEffect(() => {
    const cargarRecursos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/recursos/recursosIndex.json');
        const data = await response.json();
        
        // Buscar la información de la categoría
        const catInfo = data.categorias.find(cat => cat.id === categoria);
        
        if (!catInfo) {
          setError('Categoría no encontrada');
          setLoading(false);
          return;
        }
        
        setCategoriaInfo(catInfo);
        
        // Filtrar recursos por categoría
        const recursosFiltrados = data.recursos.filter(recurso => 
          recurso.categorias.includes(categoria)
        );
        
        setRecursos(recursosFiltrados);
      } catch (error) {
        console.error('Error cargando recursos:', error);
        setError('Error al cargar los recursos');
      } finally {
        setLoading(false);
      }
    };

    cargarRecursos();
  }, [categoria]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando recursos...</p>
        </div>
      </div>
    );
  }

  if (error || !categoriaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Categoría no encontrada</h2>
          <p className="text-gray-600 mb-6">{error || 'La categoría solicitada no existe.'}</p>
          <Link 
            to="/recursos" 
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Volver a Recursos
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[categoriaInfo.icono] || FileText;
  const colorClasses = colorMap[categoriaInfo.color] || 'bg-teal-100 text-teal-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header de la categoría */}
        <div className="text-center mb-12">
          <div className={`w-20 h-20 ${colorClasses} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <IconComponent className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {categoriaInfo.nombre}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categoriaInfo.descripcion}
          </p>
          <div className="mt-6 inline-block px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="text-gray-600 font-medium">
              {recursos.length} recurso{recursos.length !== 1 ? 's' : ''} disponible{recursos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Lista de recursos */}
        {recursos.length > 0 ? (
          <div className="space-y-4">
            {recursos.map(recurso => (
              <Link
                key={recurso.id}
                to={`/contenido/${recurso.slug}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex-shrink-0 w-12 h-12 ${colorClasses} rounded-xl flex items-center justify-center`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {recurso.nombre}
                        </h3>
                        {recurso.destacado && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            Destacado
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {recurso.descripcion}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`px-3 py-1 ${colorClasses} rounded-full font-medium`}>
                          {recurso.tipo}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{recurso.fecha}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No hay recursos en esta categoría
            </h3>
            <p className="text-gray-600">
              Pronto agregaremos más contenido
            </p>
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-12 text-center">
          <Link 
            to="/recursos" 
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            ← Volver a Recursos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriaRecursos;