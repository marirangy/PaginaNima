import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, ExternalLink, AlertCircle, AlertTriangle, Info, Phone, Download, FileCheck, MapPin, Clock } from 'lucide-react';
import VisorPDF from '../components/common/VisorPDF';
import '../styles/contenido.css';

export default function ContenidoDinamico() {
  const { slug } = useParams();
  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    fileUrl: '',
    fileName: ''
  });

  // =========================================================================
  // FUNCIÓN DE PARSEO DE TEXTO PARA NEGRITAS (**texto**), CURSIVA (*texto*) Y SUBRAYADO (__texto__)
  // =========================================================================
  const parseTextWithFormatting = (text) => {
    if (!text) return null;

    // Regex para encontrar los patrones: **negrita**, *cursiva*, __subrayado__
    const regex = /(\*\*.*?\*\*)|(\*.*?\*)|(__.*?__)/g;
    const parts = [];
    let lastIndex = 0;
    
    // Usamos replace con una función callback para iterar sobre los matches
    // y capturar también el texto plano intermedio.
    text.replace(regex, (match, bold, italic, underline, index) => {
      const key = `part-${index}`;
      
      // 1. Agregar el texto plano antes del match
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }

      // 2. Agregar el texto formateado
      if (bold) {
        // Eliminar los ** y envolver en <strong>
        parts.push(<strong key={key} className="font-bold">{bold.slice(2, -2)}</strong>);
      } else if (italic) {
        // Eliminar los * y envolver en <em>
        parts.push(<em key={key} className="italic">{italic.slice(1, -1)}</em>);
      } else if (underline) {
        // Eliminar los __ y envolver en un span con la clase underline
        parts.push(<span key={key} className="underline">{underline.slice(2, -2)}</span>);
      }
      
      // 3. Actualizar el índice de la última parte procesada
      lastIndex = index + match.length;
      return match; 
    });

    // 4. Agregar el texto plano restante al final
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };
  // =========================================================================

  useEffect(() => {
    const cargarContenido = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!slug) {
          throw new Error('No se especificó el contenido');
        }
        
        // Intentar cargar desde diferentes carpetas
        let response = await fetch(`/recursos/instrucciones/${slug}.json`);
        
        if (!response.ok) {
          // Si no está en instrucciones, intentar en data general
          response = await fetch(`/recursos/data/${slug}.json`);
        }
        
        if (!response.ok) {
          throw new Error('Archivo no encontrado');
        }
        
        const data = await response.json();
        setContenido(data);
      } catch (err) {
        console.error('Error cargando contenido:', err);
        setError('No se pudo cargar el contenido solicitado.');
        setContenido(null);
      } finally {
        setLoading(false);
      }
    };

    cargarContenido();
  }, [slug]);

  const openPDF = (fileUrl, fileName) => {
    setPdfViewer({ isOpen: true, fileUrl, fileName });
  };

  const closePDF = () => {
    setPdfViewer({ isOpen: false, fileUrl: '', fileName: '' });
  };

  const scrollToSection = (anchor) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderAlert = (alert) => {
    if (!alert) return null;
    
    const alertIcons = {
      danger: <AlertCircle className="w-5 h-5" />,
      warning: <AlertTriangle className="w-5 h-5" />,
      info: <Info className="w-5 h-5" />
    };

    return (
      <div className={`contenido-alert contenido-alert-${alert.type}`}>
        <div className="contenido-alert-title">
          {alertIcons[alert.type]}
          {alert.title}
        </div>
        <div className="contenido-alert-content">
          {alert.content.split('\n').map((line, idx) => (
            <p key={idx} style={{ marginBottom: idx < alert.content.split('\n').length - 1 ? '0.5rem' : '0' }}>
              {parseTextWithFormatting(line)}
            </p>
          ))}
        </div>
      </div>
    );
  };

  // =========================================================================
  // NUEVA FUNCIÓN: Renderizar ubicaciones con estructura mejorada
  // =========================================================================
  const renderLocations = (locations) => {
    if (!locations || locations.length === 0) return null;

    return (
      <div className="contenido-locations-grid">
        {locations.map((location, idx) => (
          <div key={idx} className="contenido-location-card">
            <h4 className="contenido-location-name">{location.name}</h4>
            
            {location.zone && (
              <div className="contenido-location-zone">
                Zona: {location.zone}
              </div>
            )}

            {location.address && (
              <div className="contenido-location-item">
                <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <div>{location.address.street}</div>
                  <div className="text-sm text-gray-600">
                    {location.address.colony}, {location.address.municipality}
                  </div>
                  <div className="text-sm text-gray-600">
                    C.P. {location.address.postalCode}, {location.address.city}
                  </div>
                </div>
              </div>
            )}

            {/* Teléfono único */}
            {location.phone && (
              <div className="contenido-location-item">
                <Phone className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <a href={`tel:${location.phone.replace(/\s|-/g, '')}`} className="contenido-location-link">
                  {location.phone}
                </a>
              </div>
            )}

            {/* Array de teléfonos */}
            {location.phones && location.phones.length > 0 && (
              <div className="contenido-location-item">
                <Phone className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  {location.phones.map((phone, phoneIdx) => (
                    <a 
                      key={phoneIdx} 
                      href={`tel:${phone.replace(/\s|-/g, '')}`} 
                      className="contenido-location-link"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            {location.email && (
              <div className="contenido-location-item">
                <ExternalLink className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <a href={`mailto:${location.email}`} className="contenido-location-link">
                  {location.email}
                </a>
              </div>
            )}

            {/* Horario */}
            {location.hours && (
              <div className="contenido-location-item">
                <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-gray-700">{location.hours}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  // =========================================================================

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contenido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenido no encontrado</h2>
          <p className="text-gray-600 mb-6">{error || 'El recurso solicitado no existe.'}</p>
          <a 
            href="/recursos" 
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Volver a Recursos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-12">
      <div className="contenido-wrapper">
        
        {/* Header */}
        <h1 className="contenido-title">{contenido.title}</h1>
        {contenido.description && (
          <p className="contenido-text text-center text-lg mb-8">
            {parseTextWithFormatting(contenido.description)}
          </p>
        )}

        {/* Referencia legal */}
        {contenido.legalReference && (
          <div className="text-center text-sm text-gray-600 italic mb-6">
            {parseTextWithFormatting(contenido.legalReference)}
          </div>
        )}

        {/* Alerta principal */}
        {contenido.alert && renderAlert(contenido.alert)}

        {/* Índice */}
        {contenido.indice && (
          <div className="contenido-indice">
            <div className="contenido-indice-title">
              <FileText className="w-5 h-5" />
              {contenido.indice.title}
            </div>
            <ul className="contenido-indice-list">
              {contenido.indice.items.map((item, idx) => (
                <li key={idx} className="contenido-indice-item">
                  <button 
                    onClick={() => scrollToSection(item.anchor)} 
                    className="contenido-indice-link"
                  >
                    {item.label}
                  </button>
                  {item.subitems && (
                    <ul className="contenido-indice-sublist">
                      {item.subitems.map((subitem, subidx) => (
                        <li key={subidx} className="contenido-indice-subitem">
                          <button 
                            onClick={() => scrollToSection(subitem.anchor)} 
                            className="contenido-indice-link"
                          >
                            {subitem.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Secciones */}
        {contenido.sections && contenido.sections.map((section, index) => (
          <div key={index} id={section.id} className="mb-8 scroll-mt-8">
            <h2 className="contenido-section-title">{section.title}</h2>
            
            {/* Contenido de la sección */}
            {section.content && (
              <div className="contenido-text">
                {section.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ marginBottom: '1rem' }}>
                    {parseTextWithFormatting(paragraph)}
                  </p>
                ))}
              </div>
            )}

            {/* NUEVA: Renderizar locations si existen */}
            {section.locations && renderLocations(section.locations)}

            {/* Lista simple/dinámica */}
            {section.list && section.list.length > 0 && (
              <ul className="contenido-list">
                {section.list.map((item, idx) => (
                  <li key={idx}>
                    {/* Case 1: Simple string item (with formatting) */}
                    {typeof item === 'string' ? (
                      <span className="contenido-text">{parseTextWithFormatting(item)}</span>
                    ) : 
                    /* Case 2: PDF Card */
                    item.type === 'pdf' ? (
                      <button
                        onClick={() => openPDF(item.file, item.title)}
                        className="contenido-list-item-link contenido-card flex items-center p-4 border rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-white"
                        style={{ display: 'flex', textDecoration: 'none', color: 'inherit', textAlign: 'left', width: '100%' }}
                      >
                        <div className="contenido-docx-icon">
                          <FileText className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="contenido-docx-info ml-4 flex-grow">
                          <div className="contenido-docx-title">{parseTextWithFormatting(item.title)}</div>
                          <div className="contenido-docx-desc">{parseTextWithFormatting(item.description)}</div>
                        </div>
                      </button>
                    ) : 
                    /* Case 3: External Link Card */
                    item.type === 'link' ? (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contenido-list-item-link contenido-card flex items-center p-4 border rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-white"
                        style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="contenido-docx-icon">
                          <ExternalLink className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="contenido-docx-info ml-4 flex-grow">
                          <div className="contenido-docx-title">{parseTextWithFormatting(item.title)}</div>
                          <div className="contenido-docx-desc">{parseTextWithFormatting(item.description)}</div>
                        </div>
                      </a>
                    ) : 
                    /* Case 4: Text item with optional inline links/buttons */
                    item.type === 'text' && item.content ? (
                      <div className="contenido-generic-list-item">
                        {/* Main Content with Formatting */}
                        <p className="contenido-text mb-2">
                          {parseTextWithFormatting(item.content)}
                        </p>

                        {/* Inline Links (Botones) */}
                        {item.links && item.links.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.links.map((link, linkIdx) => (
                              <a
                                key={linkIdx}
                                href={link.url}
                                target={link.url && link.url.startsWith('/') ? '_self' : '_blank'} 
                                rel="noopener noreferrer"
                                className="contenido-inline-button"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) :
                    /* Case 5: Generic Descriptive Item */
                    (item.title) ? (
                      <div className="contenido-generic-list-item">
                          <h4 className="contenido-item-title font-semibold text-gray-800">{parseTextWithFormatting(item.title)}</h4>
                          {item.description && (
                              <p className="contenido-item-desc text-gray-600 mt-1">{parseTextWithFormatting(item.description)}</p>
                          )}
                          {/* Manejo de sublistas anidadas */}
                          {item.sublist && item.sublist.length > 0 && (
                              <ul className="contenido-sublist ml-6 mt-2 list-disc list-outside">
                                  {item.sublist.map((subitem, subidx) => (
                                      <li key={subidx} className="contenido-sublist-item mb-1">
                                          <span className="font-medium text-gray-700">{parseTextWithFormatting(subitem.title)}: </span>
                                          <span className="text-gray-600">{parseTextWithFormatting(subitem.description)}</span>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>
                    ) : (
                      // Fallback
                      <span className="contenido-text text-red-500 italic">Error de formato en elemento de lista.</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Enlaces de la sección */}
            {section.links && section.links.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {section.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contenido-link" 
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Información adicional */}
            {section.additionalInfo && (
              <div className="contenido-text" style={{ marginTop: '1rem', fontStyle: 'italic', color: '#6b7280' }}>
                {section.additionalInfo.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ marginBottom: '0.5rem' }}>
                    {parseTextWithFormatting(paragraph)}
                  </p>
                ))}
              </div>
            )}

            {/* Pasos */}
            {section.pasos && section.pasos.length > 0 && (
              <div className="contenido-pasos-list">
                {section.pasos.map((paso, idx) => (
                  <div key={idx} className="contenido-paso-item">
                    <div className="contenido-paso-num">{idx + 1}</div>
                    <div>
                      {typeof paso === 'string' ? (
                        <p className="contenido-text">{paso}</p>
                      ) : (
                        <>
                          <h4 className="contenido-item-title">{paso.title}</h4>
                          {paso.description && (
                            <p className="contenido-item-desc">{paso.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alerta de sección */}
            {section.alert && renderAlert(section.alert)}

            {/* Subsecciones */}
            {section.subsections && section.subsections.map((subsection, subidx) => (
              <div key={subidx} id={subsection.id} className="ml-4 mt-6 scroll-mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {subsection.title}
                </h3>
                <div className="contenido-text">
                  {subsection.content.split('\n\n').map((paragraph, pidx) => (
                    <p key={pidx} style={{ marginBottom: '1rem' }}>
                      {parseTextWithFormatting(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Documentos PDF (Recursos de Apoyo) */}
        {contenido.documents && contenido.documents.length > 0 && (
          <div className="mt-12" id="recursos-apoyo">
            <h2 className="contenido-section-title">Recursos de Apoyo</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {contenido.documents.map((doc, index) => (
                // Lógica para documentos que se abren en el visor (pdf, Informacion, Guía)
                doc.type === 'pdf' || doc.type === 'Informacion' || doc.type === 'Guía' ? (
                  <button
                    key={index}
                    onClick={() => openPDF(doc.file, doc.title)}
                    className="contenido-docx-button"
                  >
                    <div className="contenido-docx-icon">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="contenido-docx-info">
                      <div className="contenido-docx-title">{doc.title}</div>
                      <div className="contenido-docx-desc">{doc.description}</div>
                      <span className="contenido-docx-badge">{doc.type}</span>
                    </div>
                  </button>
                ) : (
                  // Lógica para documentos que se descargan (word, etc.)
                  <a
                    key={index}
                    href={doc.file}
                    download
                    className="contenido-docx-button"
                  >
                    <div className="contenido-docx-icon">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="contenido-docx-info">
                      <div className="contenido-docx-title">{doc.title}</div>
                      <div className="contenido-docx-desc">{doc.description}</div>
                      <span className="contenido-docx-badge">{doc.type}</span>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </a>
                )
              ))}
            </div>
          </div>
        )}

        {/* Contactos de emergencia */}
        {contenido.emergency && (
          <div className="contenido-emergency">
            <div className="contenido-emergency-title">
              <Phone className="w-5 h-5" />
              {contenido.emergency.title}
            </div>
            <div className="contenido-emergency-list">
              {contenido.emergency.contacts.map((contact, idx) => (
                <div key={idx} className="contenido-emergency-item">
                  <span className="contenido-emergency-name">{contact.name}</span>
                  <a href={contact.link} className="contenido-emergency-number">
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enlaces externos generales */}
        {contenido.links && contenido.links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {contenido.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contenido-link"
              >
                <ExternalLink className="w-5 h-5" />
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-12 text-center">
          <a 
            href="/recursos" 
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            ← Volver a Recursos
          </a>
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
}