// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
      {
        source: '/api/excel/upload',
        destination: 'http://localhost:5000/api/excel/upload'
      },
      // Puedes agregar más rewrites si necesitas otros endpoints
    ],
    // Mantén tus configuraciones existentes
    eslint: {
      ignoreDuringBuilds: true, // Opcional: para evitar errores de ESLint en build
    },
    typescript: {
      ignoreBuildErrors: true, // Opcional: si tienes problemas con TypeScript
    }
  };
  
  export default nextConfig;