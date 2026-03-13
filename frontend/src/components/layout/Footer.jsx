import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import nimaLogo from '../../assets/images/nima.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Sección Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1 - Sobre NIMA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <img
                    src={nimaLogo}
                    alt="logo"
                    className="w-16 h-auto object-contain invert"
                />

              <span className="text-2xl font-bold text-white">NIMA</span>
            </div>
            <p className="text-sm">
              Brindamos orientación y apoyo para mujeres en situaciones de violencia de género en la CDMX.
            </p>
          </div>

 
          {/* Columna 2 - Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-nima-pink transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-nima-pink transition-colors">
                  ¿Quiénes Somos?
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="hover:text-nima-pink transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link to="/directorio" className="hover:text-nima-pink transition-colors">
                  Directorio
                </Link>
              </li>
              <li>
                <Link to="/centrosapoyo" className="hover:text-nima-pink transition-colors">
                  Centros de Apoyo
                </Link>
              </li>
            </ul>
          </div>


          {/* Columna 3 - Ayuda */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-nima-pink transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/procesos-legales" className="hover:text-nima-pink transition-colors">
                  Procesos Legales
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-nima-pink transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-nima-pink transition-colors">
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Contacto de Emergencia */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Emergencias</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-nima-pink" />
                <a href="tel:911" className="hover:text-nima-pink transition-colors">
                  911
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-nima-pink" />
                <a href="tel:089" className="hover:text-nima-pink transition-colors">
                  089 - Denuncia
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-nima-pink mt-1" />
                <span className="text-sm">Ciudad de México</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Inferior */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 NIMA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Hecho con</span>
              <Heart size={16} className="text-nima-pink fill-current" />
              <span>para apoyar a mujeres</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;