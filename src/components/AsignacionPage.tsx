import { useEffect, useState } from "react";
import { guestService } from "../lib/services";
import type { Guest } from "../lib/types";
import { Armchair, Heart, Loader, XCircle } from "lucide-react";

interface AsignacionPageProps {
  codigo: string;
}

export default function AsignacionPage({ codigo }: AsignacionPageProps) {
  const [invitado, setInvitado] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nombreBuscado = new URLSearchParams(window.location.search).get("n");

  useEffect(() => {
    setLoading(true);
    setError("");

    guestService
      .getByCode(codigo.toUpperCase())
      .then((guest) => {
        if (!guest) {
          setError("Código de invitación no encontrado");
          return;
        }
        setInvitado(guest);
      })
      .catch(() => setError("Error al cargar la asignación de mesa"))
      .finally(() => setLoading(false));
  }, [codigo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-accent animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Buscando tu mesa...</p>
        </div>
      </div>
    );
  }

  if (error || !invitado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-accent/30">
          <XCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-gray-800 mb-4">
            Invitación no encontrada
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => (window.location.href = "/asignacion")}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:from-rose-500 hover:to-amber-500 transition-all duration-300 font-light tracking-wider uppercase"
          >
            Buscar otro nombre
          </button>
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
          </a>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8"></div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-accent/30 text-center">
          <p className="text-gray-600 mb-2">Asignación de mesa para:</p>
          <h2 className="text-3xl font-serif text-gray-800 mb-8">
            {nombreBuscado || invitado.full_name}
          </h2>

          {invitado.table ? (
            <div className="rounded-xl border border-accent/20 bg-white/50 p-8">
              <Armchair className="w-10 h-10 text-accent mx-auto mb-4" />
              <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">
                Mesa asignada
              </p>
              <p className="text-5xl font-serif text-gray-800">
                {invitado.table.name}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-accent/20 bg-white/50 p-8">
              <Armchair className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                La asignación de mesa aún no está disponible.
              </p>
            </div>
          )}

          <button
            onClick={() => (window.location.href = "/asignacion")}
            className="w-full mt-8 px-8 py-4 bg-primary text-white rounded-lg hover:from-rose-500 hover:to-amber-500 transition-all duration-300 font-light tracking-wider uppercase shadow-lg hover:shadow-xl"
          >
            Buscar otro nombre
          </button>
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
