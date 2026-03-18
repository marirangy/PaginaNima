import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const PALABRAS_LIMITE = 60;

import React from "react";

function TestimoniosCarousel({ testimonios }) {
  if (!testimonios || testimonios.length === 0) {
    return <p>No hay testimonios disponibles</p>;
  }

  return (
    <div>
      {testimonios.map((t) => (
        <div key={t._id} style={{ marginBottom: "20px" }}>
          <h3>{t.nombre}</h3>
          <p>{t.mensaje}</p>
        </div>
      ))}
    </div>
  );
}

function TextoExpandible({ content }) {
  const [expandido, setExpandido] = useState(false);

  const parrafos = Array.isArray(content) ? content : [content];
  const textoCompleto = parrafos.join(" ");
  const palabras = textoCompleto.split(" ");
  const esLargo = palabras.length > PALABRAS_LIMITE;
  const textoCorto = palabras.slice(0, PALABRAS_LIMITE).join(" ") + "…";

  return (
    <div className="testi-texto-wrap">
      <p className="testi-paragraph">
        {!esLargo || expandido ? textoCompleto : textoCorto}
      </p>
      {esLargo && (
        <button
          className="testi-leer-mas"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Leer menos ↑" : "Leer más ↓"}
        </button>
      )}
    </div>
  );
}

function TestimoniosCarousel() {
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/testimonios")
      .then(res => res.json())
      .then(data => setTestimonios(data))
      .catch(err => console.error("Error cargando testimonios:", err));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400&display=swap');

        .testi-section {
          min-height: 100vh;
          background: linear-gradient(160deg, #f5f0ff 0%, #ede6ff 60%, #fdf8ff 100%);
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
          font-family: 'Lato', sans-serif;
        }

        .testi-section::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          top: -100px; left: -100px;
          pointer-events: none;
        }
        .testi-section::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          pointer-events: none;
        }

        .testi-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .testi-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 14px;
        }

        .testi-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          color: #2e1065;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
        }

        .testi-title span {
          font-style: italic;
          color: #7c3aed;
        }

        .testi-subtitle {
          font-size: 1rem;
          font-weight: 300;
          color: #6b7280;
          letter-spacing: 0.04em;
        }

        .testi-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 18px;
        }
        .testi-divider-line {
          width: 50px; height: 1px;
          background: linear-gradient(to right, transparent, #a78bfa);
        }
        .testi-divider-line:last-child {
          background: linear-gradient(to left, transparent, #a78bfa);
        }
        .testi-divider-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #7c3aed;
        }

        .testi-swiper-wrap {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Card — altura automática, sin stretch */
        .testi-card {
          background: #ffffff;
          border-radius: 4px;
          padding: 36px 32px 28px;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 1px solid rgba(139,92,246,0.15);
          box-shadow:
            0 2px 8px rgba(109,40,217,0.06),
            0 12px 40px rgba(109,40,217,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }

        .testi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #a78bfa, #c4b5fd);
        }

        .testi-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 4px 16px rgba(109,40,217,0.1),
            0 24px 60px rgba(109,40,217,0.12);
        }

        .testi-card-quote {
          font-family: 'Playfair Display', serif;
          font-size: 72px;
          line-height: 1;
          color: #7c3aed;
          opacity: 0.1;
          position: absolute;
          top: 10px; right: 20px;
          user-select: none;
          pointer-events: none;
          font-style: italic;
        }

        /* Texto */
        .testi-texto-wrap {
          margin-bottom: 20px;
        }

        .testi-paragraph {
          font-size: 0.93rem;
          line-height: 1.8;
          color: #4b5563;
          font-weight: 300;
        }

        /* Botón leer más */
        .testi-leer-mas {
          background: none;
          border: none;
          cursor: pointer;
          margin-top: 10px;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #7c3aed;
          padding: 0;
          font-family: 'Lato', sans-serif;
          transition: opacity 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .testi-leer-mas:hover {
          opacity: 0.7;
        }

        /* Autor */
        .testi-card-author {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 18px;
          border-top: 1px solid rgba(139,92,246,0.15);
          margin-top: auto;
        }

        .testi-card-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          color: #fff;
          font-style: italic;
          flex-shrink: 0;
        }

        .testi-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: #2e1065;
        }

        .testi-card-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7c3aed;
          font-weight: 300;
          margin-top: 2px;
        }

        /* Swiper */
        .testi-swiper-wrap .swiper {
          padding-bottom: 52px !important;
        }

        /* Altura automática para que cada slide se ajuste a su contenido */
        .testi-swiper-wrap .swiper-wrapper {
          align-items: flex-start;
        }

        .testi-swiper-wrap .swiper-pagination-bullet {
          background: #c4b5fd;
          opacity: 1;
          width: 7px; height: 7px;
        }
        .testi-swiper-wrap .swiper-pagination-bullet-active {
          background: #7c3aed;
          transform: scale(1.4);
        }

        .testi-swiper-wrap .swiper-button-prev,
        .testi-swiper-wrap .swiper-button-next {
          width: 42px; height: 42px;
          background: #fff;
          border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.25);
          box-shadow: 0 4px 16px rgba(109,40,217,0.1);
          top: 40%;
          transition: all 0.2s ease;
        }
        .testi-swiper-wrap .swiper-button-prev:hover,
        .testi-swiper-wrap .swiper-button-next:hover {
          background: #7c3aed;
          border-color: #7c3aed;
        }
        .testi-swiper-wrap .swiper-button-prev::after,
        .testi-swiper-wrap .swiper-button-next::after {
          font-size: 12px;
          font-weight: 700;
          color: #7c3aed;
        }
        .testi-swiper-wrap .swiper-button-prev:hover::after,
        .testi-swiper-wrap .swiper-button-next:hover::after {
          color: #fff;
        }

        @media (max-width: 640px) {
          .testi-section { padding: 60px 20px; }
          .testi-card { padding: 24px 20px 20px; }
        }
      `}</style>

      <section className="testi-section">
        <div className="testi-header">
          <span className="testi-eyebrow">Voces que importan</span>
          <h2 className="testi-title">Testi<span>monios</span></h2>
          <p className="testi-subtitle">Historias de fuerza y esperanza</p>
          <div className="testi-divider">
            <div className="testi-divider-line" />
            <div className="testi-divider-dot" />
            <div className="testi-divider-line" />
          </div>
        </div>

        <div className="testi-swiper-wrap">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640:  { slidesPerView: 1 },
              768:  { slidesPerView: 2 },
            }}
          >
            {testimonios.map(t => (
              <SwiperSlide key={t._id}>
                <article className="testi-card">
                  <span className="testi-card-quote">"</span>

                  <TextoExpandible content={t.content} />

                  <div className="testi-card-author">
                    <div className="testi-card-avatar">
                      {t.authorName?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div className="testi-card-name">{t.authorName}</div>
                      <div className="testi-card-label">testimonio</div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}

export default TestimoniosCarousel;