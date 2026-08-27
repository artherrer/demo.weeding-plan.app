import { useEffect, useState } from "react";
import { guestService } from "../lib/services";
import type { Guest, Companion, Event } from "../lib/types";
import {
  Heart,
  Users,
  CheckCircle,
  XCircle,
  Loader,
  Church,
  Wine,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { primaryColor } from "../lib/theme";

interface ConfirmationFormProps {
  codigo: string;
  /** "full": página completa (usado en /invitacion/:codigo). "embedded": solo el contenido del formulario, para incrustar en otra página (Home). */
  variant?: "full" | "embedded";
  showDetails?: boolean;
}

export default function ConfirmationForm({
  codigo,
  variant = "full",
  showDetails = true,
}: ConfirmationFormProps) {
  const [invitado, setInvitado] = useState<Guest | null>(null);
  const [evento, setEvento] = useState<Event | null>(null);
  const [acompanantes, setAcompanantes] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pasesSeleccionados, setPasesSeleccionados] = useState(0);
  const [confirmarAsistencia, setConfirmarAsistencia] = useState<
    boolean | null
  >(null);
  const [restriccionesAlimentarias, setRestriccionesAlimentarias] =
    useState("");

  useEffect(() => {
    loadInvitacion();
  }, [codigo]);

  const loadInvitacion = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await guestService.getByCode(codigo.toUpperCase());

      if (!data) {
        setError("Código de invitación no encontrado");
        return;
      }

      if (data.event) {
        setEvento(data.event);
      }
      setInvitado(data);
      setPasesSeleccionados(data.confirmed_passes);
      setConfirmarAsistencia(
        data.status === "yes" ? true : data.status === "no" ? false : null,
      );
      setAcompanantes(data.companions ?? []);
      setRestriccionesAlimentarias(data.dietary_restrictions ?? "");
    } catch (err) {
      setError("Error al cargar la invitación");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!invitado) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const statusValue =
        confirmarAsistencia === true
          ? "yes"
          : confirmarAsistencia === false
            ? "no"
            : "pending";

      await guestService.confirm(codigo, {
        status: statusValue,
        confirmed_passes: confirmarAsistencia === true ? pasesSeleccionados : 0,
        dietary_restrictions:
          confirmarAsistencia === true
            ? restriccionesAlimentarias.trim() || null
            : null,
        ...(confirmarAsistencia !== true ? { table: null } : {}),
      });


      toast.success("Confirmación guardada exitosamente");
      
      await loadInvitacion();
    } catch (err) {
      toast.error("Error al guardar la confirmación");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    if (variant === "embedded") {
      return (
        <div className="flex items-center justify-center py-10">
          <Loader className="w-8 h-8 text-accent animate-spin" />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-accent animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error && !invitado) {
    if (variant === "embedded") {
      return (
        <div className="text-center py-6">
          <XCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-accent/30">
          <XCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-gray-800 mb-4">
            Invitación no encontrada
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:from-rose-500 hover:to-amber-500 transition-all duration-300 font-light tracking-wider uppercase"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const formContent = (
    <>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center mb-4">
          {success}
        </div>
      )}
      {error && invitado && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
          {error}
        </div>
      )}
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-2">Invitación para:</p>
        <h2 className="text-3xl font-serif text-gray-800">
          {invitado?.full_name}
        </h2>
      </div>

      {/* DETALLES DEL EVENTO */}
      {showDetails && (
        <div className="mb-8 rounded-xl border border-accent/20 bg-white/50 p-6 space-y-5">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">
              {evento?.event_date
                ? new Date(evento.event_date).toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha por confirmar"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-white/60">
              <Church className="w-6 h-6 text-accent" />
              <p className="text-xs text-accent uppercase tracking-widest font-semibold">
                {evento?.locations?.[0]?.title || "Ceremonia"}
              </p>
              <p className="text-gray-800 font-light">
                {evento?.locations?.[0]?.name || "Lugar por confirmar"}
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {evento?.locations?.[0]?.time || "Hora por confirmar"}
                </span>
              </div>
              {evento?.locations?.[0]?.map_url && (
                <a
                  href={evento?.locations?.[0]?.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary text-sm underline hover:text-accent transition-colors mt-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Cómo llegar
                </a>
              )}
            </div>

            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-white/60">
              <Wine className="w-6 h-6 text-accent" />
              <p className="text-xs text-accent uppercase tracking-widest font-semibold">
                {evento?.locations?.[1]?.title || "Recepción"}
              </p>
              <p className="text-gray-800 font-light">
                {evento?.locations?.[1]?.name || "Lugar por confirmar"}
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {evento?.locations?.[1]?.time || "Hora por confirmar"}
                </span>
              </div>
              {evento?.locations?.[1]?.map_url && (
                <a
                  href={evento?.locations?.[1]?.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary text-sm underline hover:text-accent transition-colors mt-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Cómo llegar
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div>
          <label className="block text-center mb-6">
            <span className="text-lg text-gray-700 font-light">
              ¿Confirmas tu asistencia?
            </span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setConfirmarAsistencia(true);
                if (pasesSeleccionados === 0) setPasesSeleccionados(1);
              }}
              className={`py-4 px-6 rounded-lg border-2 transition-all duration-300 ${
                confirmarAsistencia === true
                  ? "bg-primary text-white border-transparent shadow-lg"
                  : "bg-white border-gray-200 text-gray-600 hover:border-primary"
              }`}
            >
              <CheckCircle className="text-green-500 w-6 h-6 mx-auto mb-2" />
              <span className="font-light tracking-wide">Sí, asistiré</span>
            </button>
            <button
              onClick={() => {
                setConfirmarAsistencia(false);
                setPasesSeleccionados(0);
              }}
              className={`py-4 px-6 rounded-lg border-2 transition-all duration-300 ${
                confirmarAsistencia === false
                  ? "bg-gray-600 text-white border-transparent shadow-lg"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              <XCircle className="text-red-500 w-6 h-6 mx-auto mb-2" />
              <span className="font-light tracking-wide">No podré asistir</span>
            </button>
          </div>
        </div>

        {confirmarAsistencia === true && (
          <div className="space-y-4 border-t border-background pt-8">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-lg font-light">
                Número de pases a utilizar
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setPasesSeleccionados(Math.max(1, pasesSeleccionados - 1))
                }
                disabled={pasesSeleccionados <= 1}
                className="w-12 h-12 rounded-full bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-xl font-light"
              >
                -
              </button>

              <div className="text-center">
                <div className="text-5xl font-serif text-gray-800 mb-1">
                  {pasesSeleccionados}
                </div>
                <div className="text-sm text-gray-500">
                  de {invitado?.max_passes} disponibles
                </div>
              </div>

              <button
                onClick={() =>
                  setPasesSeleccionados(
                    Math.min(invitado?.max_passes || 0, pasesSeleccionados + 1),
                  )
                }
                disabled={pasesSeleccionados >= (invitado?.max_passes || 0)}
                className="w-12 h-12 rounded-full bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-xl font-light"
              >
                +
              </button>
            </div>

            <div className="pt-4">
              <label
                htmlFor="restricciones-alimentarias"
                className="block text-center text-sm text-gray-600 font-light mb-2"
              >
                ¿Alguna restricción alimentaria?{" "}
                <span className="text-gray-400">(opcional)</span>
              </label>
              <textarea
                id="restricciones-alimentarias"
                value={restriccionesAlimentarias}
                onChange={(e) => setRestriccionesAlimentarias(e.target.value)}
                placeholder="Ej. vegetariano, alergia a los mariscos, sin gluten..."
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-700 resize-none"
              />
            </div>
          </div>
        )}

        {/* ACOMPAÑANTES REGISTRADOS */}
        {acompanantes.length > 0 && (
          <div className="border-t border-background pt-6 space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-light">
                Tu grupo familiar también está invitado
              </span>
            </div>
            <div className="space-y-2">
              {acompanantes.map((a) => (
                <div
                  key={a.documentId}
                  className="flex items-center gap-3 bg-white/50 rounded-lg px-4 py-2 border border-accent/20"
                >
                  <span className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-light">
                    {a.full_name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">
              Cada integrante recibirá su invitación con el mismo código:{" "}
              <span className="font-mono font-semibold">
                {invitado?.unique_code}
              </span>
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 px-8 bg-primary text-white rounded-lg hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-light tracking-wider uppercase shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Confirmación"
          )}
        </button>
      </div>
    </>
  );

  if (variant === "embedded") {
    return <div>{formContent}</div>;
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
          {formContent}
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
