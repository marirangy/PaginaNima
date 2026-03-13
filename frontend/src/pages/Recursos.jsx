import React, { useState, useRef, useEffect } from 'react';
import { FileText, Users, Heart, BookOpen, AlertCircle, Shield, ChevronRight, File, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';
import VisorPDF from '../components/common/VisorPDF';
import '../styles/recursos.css';

const Recursos = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [recursosIndex, setRecursosIndex] = useState(null);
  const contentRef = useRef(null);
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    fileUrl: '',
    fileName: ''
  });

  // Cargar el índice de recursos
  useEffect(() => {
    const cargarIndex = async () => {
      try {
        const response = await fetch('/recursos/recursosIndex.json');
        const data = await response.json();
        setRecursosIndex(data);
      } catch (error) {
        console.error('Error cargando índice de recursos:', error);
      }
    };
    cargarIndex();
  }, []);

  useEffect(() => {
    if (selectedCard && contentRef.current) {
      setTimeout(() => {
        contentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [selectedCard]);

  const handleCardClick = (cardType) => {
    setSelectedCard(selectedCard === cardType ? null : cardType);
  };

  const openPDF = (fileUrl, fileName) => {
    setPdfViewer({
      isOpen: true,
      fileUrl,
      fileName
    });
  };

  const closePDF = () => {
    setPdfViewer({
      isOpen: false,
      fileUrl: '',
      fileName: ''
    });
  };

  // Función para contar recursos por categoría
  const contarRecursosPorCategoria = (categoriaId) => {
    if (!recursosIndex) return 0;
    return recursosIndex.recursos.filter(recurso => 
      recurso.categorias.includes(categoriaId)
    ).length;
  };

  // Contenido de las secciones principales
  const recursosSections = {
    clasificacion: {
      titulo: "Clasificación",
      icono: <FileText className="w-8 h-8" />,
      contenido: [
        { tipo: "Violencia Física", ejemplos: "Golpes, empujones, jalones de cabello" },
        { tipo: "Violencia Psicológica", ejemplos: "Insultos, humillaciones, manipulación" },
        { tipo: "Violencia Sexual", ejemplos: "Acoso, violación, contacto no deseado" },
        { tipo: "Violencia Económica", ejemplos: "Control del dinero, impedir trabajar" },
        { tipo: "Violencia Patrimonial", ejemplos: "Destrucción de documentos, robo" }
      ]
    },
    conocesAlguien: {
      titulo: "¿Conoces a alguien?",
      icono: <Users className="w-8 h-8" />,
      contenido: [
        "Escucha sin juzgar y brinda un espacio seguro",
        "Cree en su palabra y valida sus sentimientos",
        "Ofrece información sin presionar",
        "Apoya respetando su proceso y autonomía"
      ]
    },
    recomendaciones: {
      titulo: "Recomendaciones",
      icono: <Shield className="w-8 h-8" />,
      contenido: [
        "Identifica lugares seguros y ten números de emergencia",
        "Prepara documentos importantes en un lugar seguro",
        "911 - Emergencias | 089 - Denuncia | 800-108-4053 - Línea de la Mujer"
      ]
    }
  };

  const documentacionBasica = [
    {
      id: 1,
      nombre: "Ley General de Acceso de las Mujeres",
      tipo: "PDF",
      url: "/recursos/documentacionBasica/Ley_del_INMUJERES.pdf"
    },
    {
      id: 2,
      nombre: "Instrumentos Internacionales",
      tipo: "Contenido",
      slug: 'instrumentosInternacionales'
    },
    {
      id: 3,
      nombre: "Ley General de Acceso de las Mujeres a una Vida Libre de Violencia",
      tipo: "PDF",
      url: "/recursos/documentacionBasica/lgamvv.pdf"
    }
  ];

  // Obtener recursos destacados del índice
  const archivosGenerales = recursosIndex 
    ? recursosIndex.recursos.filter(r => r.destacado).slice(0, 4)
    : [];

  // Obtener categorías con conteo dinámico
  const relacionadoCon = recursosIndex 
    ? recursosIndex.categorias.map(cat => ({
        id: cat.id,
        slug: cat.id,
        nombre: cat.nombre,
        count: contarRecursosPorCategoria(cat.id)
      }))
    : [];

  return (
    <div className="recursos-container">
      <div className="recursos-wrapper">
        
        {/* Header */}
        <div className="recursos-header">
          <div className="recursos-title-container">
            <div className="recursos-dot"></div>
            <h1 className="recursos-title">Recursos</h1>
          </div>
          <p className="recursos-subtitle">
            Encontrarás herramientas y materiales diseñados para orientarte y protegerte en situaciones de violencia.
          </p>
        </div>

        {/* Layout de 2 columnas */}
        <div className="recursos-grid-main">
          
          {/* Columna Izquierda - Botones */}
          <div className="recursos-buttons-column">
            <button
              onClick={() => handleCardClick('clasificacion')}
              className={`recursos-card-button recursos-card-button-teal ${selectedCard === 'clasificacion' ? 'active' : ''}`}
            >
              <div className="recursos-card-icon">{recursosSections.clasificacion.icono}</div>
              <h3 className="recursos-card-title">Clasificación</h3>
              <ChevronRight className={`recursos-card-chevron ${selectedCard === 'clasificacion' ? 'rotated' : ''}`} />
            </button>

            <button
              onClick={() => handleCardClick('conocesAlguien')}
              className={`recursos-card-button recursos-card-button-white ${selectedCard === 'conocesAlguien' ? 'active' : ''}`}
            >
              <div className="recursos-card-icon recursos-card-icon-pink">{recursosSections.conocesAlguien.icono}</div>
              <h3 className="recursos-card-title">¿Conoces a alguien?</h3>
              <ChevronRight className={`recursos-card-chevron recursos-card-chevron-pink ${selectedCard === 'conocesAlguien' ? 'rotated' : ''}`} />
            </button>

            <button
              onClick={() => handleCardClick('recomendaciones')}
              className={`recursos-card-button recursos-card-button-teal ${selectedCard === 'recomendaciones' ? 'active' : ''}`}
            >
              <div className="recursos-card-icon">{recursosSections.recomendaciones.icono}</div>
              <h3 className="recursos-card-title">Recomendaciones</h3>
              <ChevronRight className={`recursos-card-chevron ${selectedCard === 'recomendaciones' ? 'rotated' : ''}`} />
            </button>
          </div>

          {/* Columna Derecha - Video */}
          <div className="recursos-animation-container">
            <div className="relative flex items-center justify-center">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-contain"
                style={{ 
                  maxWidth: '700px',
                  maxHeight: '700px',
                  transition: 'opacity 0.3s ease-in-out'
                }}
                onEnded={(e) => {
                  e.currentTarget.style.opacity = '0';
                  setTimeout(() => {
                    e.currentTarget.style.opacity = '1';
                  }, 100);
                }}
              >
                <source src="/NIMA-pensativo.webm" type="video/webm" />
                {/* Fallback si el video no carga */}
                Tu navegador no soporta el video.
              </video>
            </div>
          </div>
        </div>

        {/* Contenido expandido - Clasificación */}
        {selectedCard === 'clasificacion' && (
          <div ref={contentRef} className="recursos-expanded-content">
            <h2 className="recursos-expanded-title">
              <FileText className="w-8 h-8 text-teal-600" />
              Tipos de Violencia
            </h2>
            <div className="recursos-type-list">
              {recursosSections.clasificacion.contenido.map((item, index) => (
                <div key={index} className="recursos-type-item">
                  <h3 className="recursos-type-title">{item.tipo}</h3>
                  <p className="recursos-type-description">{item.ejemplos}</p>
                </div>
              ))}
            </div>
            <div className="recursos-alert recursos-alert-orange">
              <p className="recursos-alert-text">
                <strong>Importante:</strong> La violencia puede presentarse en múltiples formas. 
                Si reconoces alguna situación, busca ayuda profesional.
              </p>
            </div>
          </div>
        )}

        {/* Contenido expandido - ¿Conoces a alguien? */}
        {selectedCard === 'conocesAlguien' && (
          <div ref={contentRef} className="recursos-expanded-content">
            <h2 className="recursos-expanded-title">
              <Users className="w-8 h-8 text-pink-600" />
              Cómo Ayudar
            </h2>
            <div className="recursos-help-list">
              {recursosSections.conocesAlguien.contenido.map((item, index) => (
                <div key={index} className="recursos-help-item">
                  <div className="recursos-help-number">{index + 1}</div>
                  <p className="recursos-help-text">{item}</p>
                </div>
              ))}
            </div>
            <div className="recursos-alert recursos-alert-teal">
              <p className="recursos-alert-text">
                <strong>Recuerda:</strong> Tu apoyo es fundamental, pero también cuida tu propia salud emocional.
              </p>
            </div>
          </div>
        )}

        {/* Contenido expandido - Recomendaciones */}
        {selectedCard === 'recomendaciones' && (
          <div ref={contentRef} className="recursos-expanded-content">
            <h2 className="recursos-expanded-title">
              <Shield className="w-8 h-8 text-teal-600" />
              Medidas de Seguridad
            </h2>
            <div className="recursos-safety-list">
              {recursosSections.recomendaciones.contenido.map((item, index) => (
                <div key={index} className="recursos-safety-item">
                  <div className="recursos-safety-dot"></div>
                  <p className="recursos-safety-text">{item}</p>
                </div>
              ))}
            </div>
            <div className="recursos-alert recursos-alert-red">
              <div className="recursos-alert-content">
                <AlertCircle className="w-5 h-5 text-red-500 recursos-alert-icon" />
                <div>
                  <p className="recursos-alert-title">Emergencia Inmediata</p>
                  <p className="recursos-alert-text" style={{marginBottom: '0.75rem'}}>
                    Si estás en peligro, llama al 911. No esperes.
                  </p>
                  <div className="recursos-emergency-links">
                    <a href="tel:911" className="recursos-emergency-link">911 - Emergencias</a>
                    <a href="tel:089" className="recursos-emergency-link">089 - Denuncia</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Texto introductorio a las nuevas secciones */}
        <div className="recursos-section-header">
          <h2 className="recursos-section-title">Explora Más Recursos</h2>
          <p className="recursos-section-description">
            Accede a documentación, guías paso a paso y una biblioteca completa de materiales para apoyarte en tu proceso.
          </p>
        </div>

        {/* Sección: Documentación Básica */}
        <div className="recursos-section-card">
          <h3 className="recursos-section-card-title">
            <File className="w-7 h-7 text-teal-600" />
            Documentación Básica
          </h3>
          <div className="recursos-docs-grid">
            {documentacionBasica.map((doc) => (
              doc.url ? (
                <button 
                  key={doc.id}
                  onClick={() => openPDF(doc.url, doc.nombre)}
                  className="recursos-doc-card"
                >
                  <div className="recursos-doc-card-content">
                    <FileText className="w-10 h-10 text-teal-600" />
                    <div>
                      <h4 className="recursos-doc-card-title">{doc.nombre}</h4>
                      <p className="recursos-doc-card-type">{doc.tipo}</p>
                    </div>
                  </div>
                </button>
              ) : (
                <Link 
                  key={doc.id}
                  to={`/contenido/${doc.slug}`}
                  className="recursos-doc-card"
                >
                  <div className="recursos-doc-card-content">
                    <FileText className="w-10 h-10 text-teal-600" />
                    <div>
                      <h4 className="recursos-doc-card-title">{doc.nombre}</h4>
                      <p className="recursos-doc-card-type">{doc.tipo || "Contenido"}</p>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Sección: General */}
        <div className="recursos-section-card">
          <h3 className="recursos-section-card-title">
            <Folder className="w-7 h-7 text-orange-600" />
            Biblioteca
          </h3>
          <p className="recursos-section-description" style={{textAlign: 'left', marginBottom: '1.5rem'}}>
            Explora nuestra biblioteca completa de recursos. Cada archivo te llevará a una página dedicada con información detallada.
          </p>
          <div className="recursos-files-list">
            {archivosGenerales.map((archivo) => (
              <Link 
                key={archivo.id}
                to={`/contenido/${archivo.slug}`}
                className="recursos-file-item"
              >
                <div className="recursos-file-content">
                  <div className="recursos-file-icon-container">
                    <File className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="recursos-file-info">
                    <h4 className="recursos-file-title">{archivo.nombre}</h4>
                    <div className="recursos-file-meta">
                      <span className="recursos-file-category">{archivo.categoria}</span>
                      <span className="recursos-file-separator">•</span>
                      <span className="recursos-file-date">{archivo.fecha}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 recursos-file-chevron" />
              </Link>
            ))}
          </div>
          
          <div className="recursos-view-more-container">
            <Link to="/recursos/todos" className="recursos-view-more-button">
              Ver todos los recursos →
            </Link>
          </div>
        </div>

        {/* Sección: Relacionado con */}
        <div className="recursos-section-card">
          <h3 className="recursos-section-card-title">
            <Folder className="w-7 h-7 text-purple-600" />
            Relacionado con
          </h3>
          <div className="recursos-categories-grid">
            {relacionadoCon.map((categoria) => (
              <Link 
                key={categoria.id}
                to={`/categoria/${categoria.slug}`}
                className="recursos-category-card"
              >
                <h4 className="recursos-category-title">{categoria.nombre}</h4>
                <p className="recursos-category-count">{categoria.count} recursos</p>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Visor PDF Modal */}
      <VisorPDF
        isOpen={pdfViewer.isOpen}
        fileUrl={pdfViewer.fileUrl}
        fileName={pdfViewer.fileName}
        onClose={closePDF}
      />
    </div>
  );
};

export default Recursos;