import React, { useState, useEffect } from 'react';
import { getFaqs } from '../services/api';


function Faq() {

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    getFaqs()
      .then(setFaqs)
      .catch(err => console.error('Error al obtener FAQs:', err));
  }, []);
  
  useEffect(() => {
  setFilteredFaqs(faqs);
  }, [faqs]);

  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = faqs.filter(faq =>
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term)
    );
    setFilteredFaqs(filtered);
    setActiveIndex(null); // cerrar respuestas al buscar
  };

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 font-sans">
      {/* Encabezado */}
      <h2 className="text-4xl font-bold text-teal-700 mb-2 text-center font-poppins">
        Preguntas Frecuentes
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Encuentra respuestas rápidas y confiables
      </p>

      {/* Buscador */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Buscar por palabra clave..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-5 py-3 rounded-full border-2 border-purple-200 focus:border-teal-500 focus:outline-none bg-purple-50 text-gray-700"
        />
        <span className="absolute right-4 top-3 text-purple-400">🔍</span>
      </div>

      {/* Lista de FAQs */}
      {filteredFaqs.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron preguntas que coincidan.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((item, idx) => (
            <div
              key={idx}
              className="border-l-4 border-purple-400 rounded-lg shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAnswer(idx)}
                className="w-full text-left px-4 py-3 font-semibold text-gray-700 flex justify-between items-center hover:bg-purple-50 transition-colors"
              >
                {item.question}
                <span className="text-purple-500 font-bold text-xl">
                  {activeIndex === idx ? '−' : '+'}
                </span>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  activeIndex === idx ? 'max-h-96 px-4 py-3 bg-purple-50' : 'max-h-0 px-4'
                }`}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Faq;