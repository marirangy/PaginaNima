import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, File, ChevronRight, Loader } from 'lucide-react';
import '../styles/recursos.css';

const TodosRecursos = () => {
  const [recursos, setRecursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');

  useEffect(() => {
    const cargarRecursos = async () => {
      try {
        const response = await fetch('/recursos/recursosIndex.json');
        const data = await response.json();
        setRecursos(data.recursos);
        setCategorias(data.categorias);
      } catch (error) {
        console.error('Error cargando recursos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarRecursos();
  }, []);

  // Filtrar recursos
  const recursosFiltrados = recursos.filter(recurso => {
    const matchSearch = recurso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       recurso.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategoria = selectedCategoria === 'todas' || 
                          recurso.categorias.includes(selectedCategoria);
    
    return matchSearch && matchCategoria;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Todos los Recursos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra biblioteca completa de guías, documentación y materiales de apoyo
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            {recursosFiltrados.length} recurso{recursosFiltrados.length !== 1 ? 's' : ''} encontrado{recursosFiltrados.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Lista de recursos */}
        <div className="space-y-4">
          {recursosFiltrados.length > 0 ? (
            recursosFiltrados.map(recurso => (
              <Link
                key={recurso.id}
                to={`/contenido/${recurso.slug}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-teal-600" />
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
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                          {recurso.tipo}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{recurso.categoria}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{recurso.fecha}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No se encontraron recursos
              </h3>
              <p className="text-gray-600">
                Intenta cambiar los filtros o el término de búsqueda
              </p>
            </div>
          )}
        </div>

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

export default TodosRecursos;