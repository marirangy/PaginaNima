import { Heart, Target, Lightbulb, Users, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Heart size={40} className="text-nima-pink" />,
      title: 'Empatía',
      description: 'Escuchamos y acompañamos con comprensión genuina cada situación.'
    },
    {
      icon: <Target size={40} className="text-nima-teal" />,
      title: 'Compromiso',
      description: 'Nos dedicamos a brindar apoyo integral y de calidad a cada mujer.'
    },
    {
      icon: <Lightbulb size={40} className="text-orange-500" />,
      title: 'Innovación',
      description: 'Utilizamos tecnología para hacer más accesible el apoyo y orientación.'
    },
    {
      icon: <Award size={40} className="text-nima-purple" />,
      title: 'Excelencia',
      description: 'Mantenemos altos estándares de profesionalismo y atención.'
    }
  ];

  const team = [
    {
      name: 'Equipo de Psicólogas',
      role: 'Apoyo Emocional',
      description: 'Profesionales especializadas en violencia de género y trauma.'
    },
    {
      name: 'Asesoras Legales',
      role: 'Orientación Legal',
      description: 'Expertas en derechos de las mujeres y procesos legales.'
    },
    {
      name: 'Coordinadoras',
      role: 'Gestión y Logística',
      description: 'Garantizan el acceso a los servicios de forma oportuna y efectiva.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-nima-teal font-semibold">QUIÉNES SOMOS</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Conoce a <span className="text-nima-purple">NIMA</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Somos una iniciativa dedicada a brindar apoyo integral a mujeres en situaciones de violencia de género en la Ciudad de México.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* Misión */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-nima-teal rounded-full flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-nima-teal">Misión</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Proporcionar orientación, apoyo emocional y asesoramiento legal a mujeres que enfrentan situaciones de violencia de género, facilitando su acceso a recursos especializados y contribuyendo a su proceso de recuperación.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-nima-purple rounded-full flex items-center justify-center">
                <Lightbulb size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-nima-purple">Visión</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ser una plataforma de referencia en la Ciudad de México que integre tecnología, profesionales especializados y recursos comunitarios para crear un ecosistema de apoyo accesible y efectivo para mujeres en situaciones de violencia.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nuestros <span className="text-nima-teal">Valores</span>
            </h2>
            <p className="text-xl text-gray-600">
              Los principios que guían nuestro trabajo diario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nuestro <span className="text-nima-purple">Equipo</span>
            </h2>
            <p className="text-xl text-gray-600">
              Profesionales especializados comprometidos con tu bienestar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-nima-teal to-nima-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-nima-teal font-semibold text-center mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-center leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-nima-teal to-nima-purple rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            ¿Necesitas apoyo?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Estamos aquí para ayudarte. Accede a nuestros recursos, directorio de profesionales y centros de apoyo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:911"
              className="bg-white text-nima-teal px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              📞 Emergencia
            </a>
            <a
              href="/chat"
              className="bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
            >
              Iniciar Chat
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
