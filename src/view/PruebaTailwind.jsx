export default function PruebaTailwind() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white">
      <h1 className="text-5xl font-extrabold drop-shadow-lg">¡Tailwind Funciona! ✨</h1>
      <p className="mt-4 text-lg">Estás lista para diseñar con estilo 💖</p>
      <button className="mt-6 px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
        ¡Haz clic aquí!
      </button>
    </div>
  );
}
