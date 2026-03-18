import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Páginas
import Home from './pages/Home';
import About from './pages/About';
import Directorio from './pages/Directorio';
import CentrosApoyo from './pages/CentrosApoyo';
import Recursos from './pages/Recursos';
import ContenidoDinamico from './pages/ContenidoDinamico';
import TodosRecursos from './pages/todosRecursos';
import CategoriaRecursos from './pages/CategoriaRecursos';
import Chat from "./pages/Chat";
import Faq from "./pages/Faq";   
import Testimonios from "./pages/Testimonios"; 

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/directorio" element={<Directorio />} />
          <Route path="/centrosapoyo" element={<CentrosApoyo />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/contenido/:slug" element={<ContenidoDinamico />} />
          <Route path="/recursos/todos" element={<TodosRecursos />} />
          <Route path="/categoria/:categoria" element={<CategoriaRecursos />} />  
          <Route path="/chat" element={<Chat />} />
          <Route path="/faq" element={<Faq />} />          
          <Route path="/testimonios" element={<Testimonios />} /> 
          
          {/* ⚡ Ruta wildcard para atrapar cualquier URL y evitar 404 en Vercel */}
          <Route path="*" element={<Home />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;