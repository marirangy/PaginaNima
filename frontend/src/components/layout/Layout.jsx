import Header from './Header';
import Footer from './Footer';
import ExitButton from './ExitButton';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ExitButton SPA */}
      <ExitButton external={false} />

      <main className="flex-grow pt-20">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;