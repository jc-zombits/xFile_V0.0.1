import Link from 'next/link';

const Navbar = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Statistics', path: '/statistics' },
    { name: 'Models', path: '/models' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Nombre del proyecto - Izquierda */}
          <h1 className='text-2xl font-bold text-amber-300'>xFile_V0.0.1</h1>

          {/* Links de navegación - Derecha */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.path}
                  className="text-amber-100 hover:text-amber-200 font-semibold px-2 py-2 rounded-md text-md relative group transition-colors duration-300"
                >
                  {link.name}
                  {/* Efecto de línea inferior al hacer hover */}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-200 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;