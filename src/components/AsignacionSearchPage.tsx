import { useEffect, useState } from "react";
import { eventService, guestService } from "../lib/services";
import type { Event, GuestSearchResult } from "../lib/types";
import { Heart, Loader, Search } from "lucide-react";

export default function AsignacionSearchPage() {
  const documentId = import.meta.env.VITE_EVENT_ID;
  const [evento, setEvento] = useState<Event | null>(null);
  const [loadingEvento, setLoadingEvento] = useState(true);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<GuestSearchResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  useEffect(() => {
    eventService
      .getOne(documentId)
      .then(setEvento)
      .finally(() => setLoadingEvento(false));
  }, [documentId]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResultados([]);
      return;
    }

    setBuscando(true);
    const timeoutId = setTimeout(() => {
      guestService
        .search(q)
        .then(setResultados)
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const irAAsignacion = (persona: GuestSearchResult) => {
    const params = new URLSearchParams({ n: persona.nombre });
    window.location.href = `/asignacion/${persona.codigo}?${params.toString()}`;
  };

  if (loadingEvento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-accent animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <a href="/" className="inline-block">
            <Heart className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-5xl font-serif text-gray-800 mb-4">
              {evento?.main_title || "Nuestra Boda"}
            </h1>
          </a>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8"></div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-accent/30">
          <h2 className="text-3xl font-serif text-center text-accent mb-4">
            Asignación de mesa
          </h2>
          <p className="text-center text-gray-600 mb-8 leading-relaxed">
            Busca tu nombre o el de tu acompañante para conocer tu mesa asignada.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setMostrarDropdown(true);
              }}
              onFocus={() => setMostrarDropdown(true)}
              onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && resultados.length > 0) {
                  irAAsignacion(resultados[0]);
                }
              }}
              placeholder="Ingresa tu nombre"
              className="w-full pl-12 pr-6 py-4 rounded-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-lg"
            />

            {mostrarDropdown && query.trim().length >= 2 && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-accent/20 overflow-hidden">
                {buscando ? (
                  <p className="px-6 py-3 text-gray-500 text-sm flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Buscando...
                  </p>
                ) : resultados.length > 0 ? (
                  resultados.map((persona, index) => (
                    <button
                      key={`${persona.codigo}-${persona.nombre}-${index}`}
                      onMouseDown={() => irAAsignacion(persona)}
                      className="w-full text-left px-6 py-3 hover:bg-background/20 transition-colors border-b border-accent/10 last:border-b-0"
                    >
                      <p className="text-gray-800 font-light">{persona.nombre}</p>
                      {persona.esAcompanante && (
                        <p className="text-xs text-gray-500">
                          Acompañante de {persona.nombrePadre}
                        </p>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="px-6 py-3 text-gray-500 text-sm">
                    Sin coincidencias
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-gray-600 hover:text-gray-800 transition-colors font-light"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
