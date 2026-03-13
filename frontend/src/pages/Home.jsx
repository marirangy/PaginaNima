import { MessageCircle, FileText, MapPin, Scale, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {

  const scrollToServices = () => {
    const servicesSection = document.getElementById('servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-pink-50">
      {/* Sección 1 - Hero */}
      <section className=" flex items-center justify-center p-4 py-20 relative">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-18 items-center">
          
          {/* Sección Izquierda - Texto */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h1 className="text-5xl font-bold text-nima-teal">NIMA</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-800">
                ¡Hola! Soy <span className="text-nima-purple">Nima</span>.
              </h2>
              <p className="text-2xl text-gray-700">
                Estoy aquí para ayudarte y acompañarte.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <p className="text-xl text-gray-700 leading-relaxed">
                Brindamos <span className="font-semibold text-nima-teal">orientación</span> y{' '}
                <span className="font-semibold text-nima-teal">apoyo</span> para mujeres en
                situaciones de violencia de género.
              </p>
            </div>
          </div>

          {/* Sección Derecha - Bot y Botones */}
          <div className="flex flex-col items-center space-y-8">
            {/* Ilustración del Bot */}
            <div className="relative">
              <div className="w-100 h-100 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/NIMA-saludo.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="w-full max-w-md space-y-4">
              <button 
                onClick={() => window.location.href = '/about'}
                className="w-full bg-white text-nima-teal border-2 border-nima-teal py-4 px-6 rounded-full text-xl font-semibold hover:bg-nima-teal hover:text-white transition-all duration-300 shadow-lg"
              >
                ¿Quienes somos?
              </button>
              
              <Link 
                to="/chat"
                className="w-full bg-nima-teal text-white py-4 px-6 rounded-full text-xl font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} />
                Iniciar chat
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-nima-orange focus:ring-offset-2 rounded-full p-2"
          aria-label="Scroll hacia abajo"
        >
          <svg className="w-8 h-8 text-nima-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* Sección 2 - Servicios */}
      <section id="servicios" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Tarjeta 1 - Recursos */}
            <Link 
              to="/recursos"
              className="bg-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md">
                  <FileText size={40} className="text-nima-teal" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Recursos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Toda la información sobre todos los tipos de violencia. ¿Cómo actúo? ¿Cómo puedo ayudar?
                </p>
              </div>
            </Link>

            {/* Tarjeta 2 - Centros de apoyo */}
            <Link 
              to="/centrosapoyo"
              className="bg-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md">
                  <MapPin size={40} className="text-nima-teal" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Centros de apoyo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Encuentra servicios cercanos como refugios, hospitales, psicólogos o acompañantes legales.
                </p>
              </div>
            </Link>

            {/* Tarjeta 3 - Procesos Legales */}
            <Link 
              to="/procesos-legales"
              className="bg-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md">
                  <Scale size={40} className="text-nima-teal" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Procesos Legales</h3>
                <p className="text-gray-600 leading-relaxed">
                  Conoce los pasos legales para presentar una denuncia, o incluso solo informarte.
                </p>
              </div>
            </Link>

            {/* Tarjeta 4 - Directorio */}
            <Link 
              to="/directorio"
              className="bg-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md">
                  <Phone size={40} className="text-nima-teal" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Directorio</h3>
                <p className="text-gray-600 leading-relaxed">
                  Contacta a profesionistas que pueden acompañarte en este proceso.
                </p>
              </div>
            </Link>
          </div>

          {/* Texto Central y Botón */}
          <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
            <div className="bg-nima-pink/30 backdrop-blur-sm rounded-3xl p-10 text-center shadow-lg">
              <p className="text-xl text-gray-800 leading-relaxed">
                Nuestro objetivo es brindarte información clara, accesible y actualizada para que puedas 
                tomar decisiones informadas y conocer tus derechos.
              </p>
            </div>

            <Link 
              to="/chat"
              className="bg-white border-2 border-nima-teal text-nima-teal px-12 py-4 rounded-full text-xl font-semibold hover:bg-nima-teal hover:text-white transition-all duration-300 shadow-lg"
            >
              Pregúntale a Nima.
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;