import { useStore } from "../store/useAiStore";
import { useState } from "react";
import {
  LightBulbIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  WrenchIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// import { LightBulbIcon, PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function OpenRouter() {
  const generarPregunta = useStore((state) => state.generarPregunta);
  const pregunta = useStore((state) => state.pregunta);
  const isGenerating = useStore((state) => state.isGenerating);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const form = new FormData(evt.currentTarget); // Crear el objeto de submit de formData con los campos lo mapea en automatico
    const promt = form.get("prompt"); // campo de input y sel convierte a trim si necesitas validarlo yu usar los funciones de string
    // const jsonObject = Object.fromEntries(form.entries()); cuando es mucho objetos
    if (promt.trim() === "") {
      showNotification({
        text: "La busqueda no puede ir vacia",
        error: true,
      });
      return;
    }
    await generarPregunta(promt);
  };

  // Estado local para el input
  const [inputQuestion, setInputQuestion] = useState("");

  // Ejemplos de preguntas
  const examples = [
    "¿Qué taladro me recomiendas?",
    "¿Cómo instalar una cerradura?",
    "¿Qué martillo necesito?",
  ];

  const handleExampleClick = (text) => {
    setInputQuestion(text);
  };

  return (
    <div className="open_router_container">
      <div className="open_router_header">
        <div className="open_router_title">
          <div className="open_router_icon-container">
            <LightBulbIcon className="open_router_hero-icon" />
          </div>
          <h1>Asistente de Herramientas</h1>
        </div>
        <p className="open_router_subtitle">
          Tu experto virtual en ferretería y construcción
        </p>
      </div>

      <div className="open_router_search-container">
        <form
          onSubmit={handleSubmit}
          className="open_router_search-box-wrapper"
        >
          <div className="open_router_search-icon">
            <QuestionMarkCircleIcon className="open_router_hero-icon" />
          </div>
          <input
            type="text"
            name="prompt"
            id="prompt"
            className="open_router_search-input"
            placeholder="¿Qué herramienta necesitas? ¿Tienes dudas sobre algún producto?"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
          />
          <button
            type="submit"
            className="open_router_search-button"
            disabled={isGenerating}
          >
            <PaperAirplaneIcon className="open_router_hero-icon" />
          </button>
        </form>
        <div className="open_router_search-examples">
          <p>
            Ejemplos:{" "}
            {examples.map((example, index) => (
              <span
                key={index}
                className="open_router_example-tag"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="open_router_response-container">
        <div className="open_router_response-header">
          <div className="open_router_assistant-info">
            <div className="open_router_assistant-avatar">
              <UserCircleIcon className="open_router_hero-icon" />
            </div>
            <div className="open_router_assistant-name">
              <h3>FERRE-BOT</h3>
              <p>Asistente especializado en herramientas</p>
            </div>
          </div>
        </div>
        <div className="open_router_response-content">
          {isGenerating && (
            <div className="open_router_loading-message">
              <p>Generando respuesta...</p>
              <div className="open_router_loading-spinner"></div>
            </div>
          )}

          {!isGenerating && pregunta && (
            <div className="open_router_ai-response">
              <div className="open_router_response-bubble">
                <p>{pregunta}</p>
              </div>
            </div>
          )}

          {!isGenerating && (
            <div className="open_router_welcome-message">
              <h2>¡Bienvenido al Asistente Virtual de FERREMAS!</h2>
              <p>
                Estoy aquí para ayudarte con todas tus dudas sobre herramientas,
                materiales y proyectos de construcción.
              </p>
              <p>Puedes preguntarme sobre:</p>
              <ul>
                <li>
                  <WrenchIcon className="open_router_hero-icon" />{" "}
                  Recomendaciones de herramientas
                </li>
                <li>
                  <WrenchScrewdriverIcon className="open_router_hero-icon" />{" "}
                  Consejos para proyectos DIY
                </li>
                <li>
                  <PaintBrushIcon className="open_router_hero-icon" />{" "}
                  Materiales y acabados
                </li>
                <li>
                  <ShieldCheckIcon className="open_router_hero-icon" /> Equipos
                  de seguridad
                </li>
              </ul>
              <p>¡Escribe tu pregunta arriba y te responderé al instante!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// return (
//       <>
//         <h1 className="text-6xl font-extrabold">Generar Preguntas con IA</h1>

//         <div className="max-w-4xl mx-auto">
//           <form
//             onSubmit={handleSubmit}
//             className='flex flex-col space-y-3 py-10'
//           >
//             <div className="relative">
//               <input
//                 name="prompt"
//                 id="prompt"
//                 className="border bg-white p-4 rounded-lg w-full border-slate-800"
//                 placeholder="Genera una receta con ingredientes. Ej. Bebida con Tequila y Fresa"
//               />
//               <button
//                 type="submit"
//                 aria-label="Enviar"
//                 className={`cursor-pointer absolute top-1/2 right-5 transform -translate-x-1/2 -translate-y-1/2 ${isGenerating ? 'cursor-not-allowed opacity-50': ''}`}
//                 disabled={isGenerating}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
//                   stroke="currentColor" className="w-10 h-10">
//                   <path strokeLinecap="round" strokeLinejoin="round"
//                     d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                 </svg>
//               </button>
//             </div>
//           </form>
//             {isGenerating && <p className="text-center animate-blink">Generando...</p>}
//           <div className="py-10 whitespace-pre-wrap">
//                 {pregunta}
//           </div>
//         </div>

//       </>
//     )
