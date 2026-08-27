import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Church,
  Clock,
  Copy,
  Gift,
  Heart,
  Loader,
  MapPin,
  Shirt,
  Wine,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { eventService } from "../lib/services";
import { primaryColor } from "../lib/theme";
import { Event, FamilyMember, GiftRegistry, Godparent } from "../lib/types";
import ConfirmationForm from "./ConfirmationForm";
import CountdownToDate from "./counter";

// TODO: mock temporal — vendrá desde Strapi (Event.groom_parents / bride_parents / godparents)
const MOCK_GROOM_PARENTS: FamilyMember[] = [
  { id: 1, full_name: "Arturo Olvera Guerra" },
  { id: 2, full_name: "Erika Nelly Herrera Navarro" },
];

const MOCK_BRIDE_PARENTS: FamilyMember[] = [
  { id: 1, full_name: "Gerardo Arreguin Pantoja" },
  { id: 2, full_name: "Teresa Orduña Aguilar" },
];

const MOCK_GODPARENTS: Godparent[] = [
  {
    id: 1,
    role: "Padrinos de Velación",
    names: "Armando Olvera & Beatriz Cruz",
  },
  {
    id: 2,
    role: "Padrinos de Anillos",
    names: "David Aranda",
  },
  {
    id: 3,
    role: "Padrinos de Arras",
    names: "Israel Olvera",
  },
  { id: 4, role: "Padrinos de Lazo", names: "Isis León & Pablo Navarrete" },
];

export default function HomePage() {
  const documentId = import.meta.env.VITE_EVENT_ID;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<
    "registry" | "bank" | "cash" | null
  >(null);
  const [selectedRegistry, setSelectedRegistry] = useState<GiftRegistry | null>(
    null,
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const codigoParam = new URLSearchParams(window.location.search).get("q");

  const galleryImages = event?.gallery_image ?? [];

  useEffect(() => {
    if (galleryImages.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  useEffect(() => {
    eventService
      .getOne(documentId)
      .then((events) => {
        setEvent(events);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar la información del evento", {
          className: "bg-background text-white px-4 py-2 rounded-lg",
          iconTheme: {
            primary: primaryColor,
            secondary: "#fff",
          },
        });
      });
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("¡Texto copiado!", {
        className: "bg-background text-white px-4 py-2 rounded-lg",
        iconTheme: {
          primary: primaryColor,
          secondary: "#fff",
        },
      });
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const addEventToCalendar = () => {
    const formatUtc = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const pad = (n: number) => String(n).padStart(2, "0");

    // Fecha del evento desde el backend
    const eventDate = new Date(event!.event_date);
    const dateStr = eventDate.toISOString().slice(0, 10).replace(/-/g, "");

    // Hora de inicio desde la primera ubicación (ej. "18:00", "18:00 hrs")
    const loc = event!.locations?.[0];
    let startHour = 18;
    let startMin = 0;
    if (loc?.time) {
      const m = loc.time.match(/(\d{1,2}):(\d{2})/);
      if (m) {
        startHour = parseInt(m[1]);
        startMin = parseInt(m[2]);
      }
    }

    const dtstart = `${dateStr}T${pad(startHour)}${pad(startMin)}00`;

    // Fin: +8 horas
    const endTotalMin = startHour * 60 + startMin + 8 * 60;
    const endHour = Math.floor(endTotalMin / 60) % 24;
    const endMin = endTotalMin % 60;
    const daysOver = Math.floor(endTotalMin / (24 * 60));
    const endDate = new Date(eventDate);
    endDate.setUTCDate(endDate.getUTCDate() + daysOver);
    const endDateStr = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const dtend = `${endDateStr}T${pad(endHour)}${pad(endMin)}00`;

    const dtstamp = formatUtc(new Date());

    const title = event!.main_title || event!.name;
    const locationParts = [loc?.name, loc?.city].filter(Boolean).join("\\, ");

    // ICS sin indentación — cada línea debe comenzar en columna 0
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${title}//EN`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${title}`,
      "X-WR-TIMEZONE:America/Mexico_City",
      "BEGIN:VTIMEZONE",
      "TZID:America/Mexico_City",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:-0500",
      "TZOFFSETTO:-0600",
      "TZNAME:CST",
      "DTSTART:19701025T020000",
      "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
      "END:STANDARD",
      "BEGIN:DAYLIGHT",
      "TZOFFSETFROM:-0600",
      "TZOFFSETTO:-0500",
      "TZNAME:CDT",
      "DTSTART:19700405T020000",
      "RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=4",
      "END:DAYLIGHT",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      `UID:event-${dateStr}-${event?.documentId}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=America/Mexico_City:${dtstart}`,
      `DTEND;TZID=America/Mexico_City:${dtend}`,
      `SUMMARY:${title} 💍`,
      `DESCRIPTION:Celebración de la boda de ${title}`,
      `LOCATION:${locationParts}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const file = new File([blob], `${event?.main_title || "event"}.ics`, {
      type: "text/calendar",
    });

    if (isAndroid && navigator.canShare?.({ files: [file] })) {
      navigator
        .share({
          title: event?.main_title || "Event",
          text: "Agrega la boda a tu calendario",
          files: [file],
        })
        .catch(() => downloadICS(icsContent));
    } else if (isIOS) {
      // iOS bloquea navegación a data: URIs — usamos un link a Blob para abrir el visor nativo de .ics
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success("Evento agregado al calendario");
    } else {
      downloadICS(icsContent);
    }
  };

  const downloadICS = (icsContent: string) => {
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event?.main_title || "event"}.ics`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    toast.success("Evento agregado al calendario");
  };

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-accent animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const mainLocation = event.locations?.[0];

  const backgroundImageUrl = event.background_image?.url;
  const musicUrl = `${event.music?.url}`;
  const groomParents = event.groom_parents?.length
    ? event.groom_parents
    : MOCK_GROOM_PARENTS;
  const brideParents = event.bride_parents?.length
    ? event.bride_parents
    : MOCK_BRIDE_PARENTS;
  const godparents = event.godparents?.length
    ? event.godparents
    : MOCK_GODPARENTS;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: backgroundImageUrl
              ? `url(${backgroundImageUrl})`
              : `
                radial-gradient(ellipse at 20% 30%, rgba(199,98,61,0.15) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 70%, rgba(144,64,41,0.12) 0%, transparent 55%),
                radial-gradient(ellipse at 60% 10%, rgba(135,66,33,0.08) 0%, transparent 50%),
                linear-gradient(160deg, #1a1208 0%, #2c1a0e 40%, #1e120a 100%)
              `,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative w-full max-w-7xl mx-auto px-4 py-16">
          <div className="md:flex items-center justify-between gap-12">
            <div className="flex-1"></div>

            <div className="flex-1 space-y-8">
              <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/30">
                <div className="text-center mb-6 space-y-4">
                  <h1 className="text-6xl md:text-7xl font-serif text-primary tracking-wide">
                    {event.main_title}
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto"></div>
                  <p className="text-2xl text-accent font-light tracking-wider">
                    {event.subtitle}
                  </p>
                </div>

                <CountdownToDate
                  targetDate={event.event_date}
                  onFinish={() => {}}
                />

                <div className="space-y-6 mt-6 mb-10">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-accent uppercase tracking-widest font-semibold">
                        Fecha
                      </p>
                      <p className="text-lg text-text-primary font-light">
                        {new Date(event.event_date).toLocaleDateString(
                          "es-ES",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-accent uppercase tracking-widest font-semibold">
                        Hora
                      </p>
                      <p className="text-lg text-text-primary font-light">
                        {mainLocation?.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-accent uppercase tracking-widest font-semibold">
                        Lugar
                      </p>
                      <a
                        href="https://maps.app.goo.gl/LshwTAz9JAqrQnAcA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-text-primary font-light hover:text-accent transition-colors"
                      >
                        {mainLocation?.name}
                      </a>
                      <p className="text-sm text-text-secondary">
                        {mainLocation?.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-xl mx-auto">
        {event.music && (
          <div className=" flex justify-center">
            <audio controls className="mb-6" autoPlay={true}>
              <source src={musicUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <p className=" text-center whitespace-pre-line my-12">
          {event.message ||
            "¡Estamos muy emocionados de compartir este día tan especial con ustedes! Gracias por ser parte de nuestras vidas y acompañarnos en esta nueva aventura que estamos por comenzar juntos."}
        </p>
        <button
          className="bg-primary w-full mb-12 py-4 px-8 text-white rounded-lg font-light tracking-wider uppercase shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          onClick={addEventToCalendar}
        >
          Añadir al calendario
        </button>
        {/* <h2 className="text-3xl font-serif text-center text-gray-800 mb-8">
          Información
        </h2> */}

        {/* <button onClick={addEventToCalendar}>Añadir al calendario</button> */}
        <div className="md:flex justify-between border-t pt-12">
          {event.locations?.[0] && (
            <div>
              <div className="text-center">
                <Church className="mr-2 inline text-accent" />
                <p className="text-accent text-lg">Ceremonia Religiosa:</p>
              </div>
              <p className="my-4 text-center">{event.locations[0].name}</p>
              <p className="my-4 text-center">{event.locations[0]?.time}</p>
              <p className="underline text-center">
                <a href={event.locations[0]?.map_url!} target="_blank">
                  Cómo llegar
                </a>
              </p>
            </div>
          )}
          {event.locations?.[1] && (
            <div className="mt-6 md:mt-0">
              <div className="text-center">
                <Wine className="mr-1 inline text-accent" />
                <p className="text-accent text-lg">Recepción:</p>
              </div>
              <p className="my-4 text-center">{event.locations[1]?.name}</p>
              <p className="my-4 text-center">{event.locations[1]?.time}</p>
              <p className="underline text-center">
                <a
                  href="https://maps.app.goo.gl/oa77oRujWEWmKoVi8"
                  target="_blank"
                >
                  Cómo llegar
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-2xl mx-auto border-t">
        <h2 className="text-3xl font-serif text-center text-accent mb-2">
          Con la bendición de Dios y de nuestros padres
        </h2>
        <div className="w-16 h-px bg-secondary/40 mx-auto my-6"></div>

        <div className="md:flex justify-between gap-12 mb-14">
          <div className="flex-1 text-center mb-10 md:mb-0">
            <p className="text-xs text-accent uppercase tracking-[0.2em] font-semibold mb-4">
              Padres del Novio
            </p>
            <div className="space-y-2">
              {groomParents.map((parent) => (
                <p key={parent.id} className="text-lg font-light text-gray-700">
                  {parent.full_name}
                </p>
              ))}
            </div>
          </div>

          <div className="flex-1 text-center">
            <p className="text-xs text-accent uppercase tracking-[0.2em] font-semibold mb-4">
              Padres de la Novia
            </p>
            <div className="space-y-2">
              {brideParents.map((parent) => (
                <p key={parent.id} className="text-lg font-light text-gray-700">
                  {parent.full_name}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="h-px w-10 bg-secondary/30"></span>
          <Heart className="w-4 h-4 text-accent" />
          <span className="h-px w-10 bg-secondary/30"></span>
        </div>

        <p className="text-xs text-accent uppercase tracking-[0.2em] font-semibold text-center mb-8">
          Padrinos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
          {godparents.map((godparent) => (
            <div key={godparent.id} className="text-center">
              <p className="text-sm text-secondary tracking-wide mb-1">
                {godparent.role}
              </p>
              <p className="text-lg font-light text-gray-700">
                {godparent.names}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-2xl mx-auto border-t">
        <div className="md:flex gap-2 justify-center">
          <p className="font-bold mt-6 text-center text-xl md:text-2xl items-center text-accent">
            <Shirt className="inline" /> Código de vestimenta:{" "}
          </p>
          <p className="font-extrabold mt-6 text-center text-2xl md:text-2xl items-center text-accent underline">
            {event.dress_code || "Formal"}
          </p>
        </div>
        <p className="text-center mt-4">{event.dress_code_note || ""}</p>
        <div className="flex justify-center gap-4 mt-6">
          {event.color_palette?.map((color) => (
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>

      {galleryImages.length > 0 && (
        <div className="relative w-full overflow-hidden bg-black/5">
          <div
            className="relative w-full"
            style={{ height: "clamp(320px, 60vw, 640px)" }}
          >
            {galleryImages.map((image, index) => {
              const imageUrl = image.url;
              return (
                <div
                  key={image.id}
                  className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    opacity: index === activeSlide ? 1 : 0,
                  }}
                />
              );
            })}

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveSlide(
                      (prev) =>
                        (prev - 1 + galleryImages.length) %
                        galleryImages.length,
                    )
                  }
                  aria-label="Foto anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-accent hover:bg-white/90 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % galleryImages.length)
                  }
                  aria-label="Foto siguiente"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-accent hover:bg-white/90 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Ir a la foto ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeSlide
                          ? "w-8 bg-white"
                          : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-xl mx-auto border-t">
        <h2 className="text-3xl font-serif text-center text-accent mb-8 items-center">
          <Gift className="inline text-lg" /> Regalo
        </h2>

        <p className="text-gray-600 text-center whitespace-pre-line mb-8">
          {event.gift_message ||
            "Tu presencia es el mejor regalo que podríamos pedir."}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {event.gift_registry?.map((registry) => (
            <button
              key={registry.id}
              onClick={() => {
                setSelectedRegistry(registry);
                setActiveModal("registry");
              }}
              className="py-4 px-8 bg-primary text-sm text-white rounded-lg font-light tracking-wider uppercase shadow-lg hover:shadow-xl transition-all"
            >
              {registry.name}
            </button>
          ))}

          {event.gift_cash_message && (
            <button
              onClick={() => setActiveModal("cash")}
              className="py-4 px-8 bg-secondary text-sm text-white rounded-lg font-light tracking-wider uppercase shadow-lg hover:shadow-xl transition-all"
            >
              Efectivo
            </button>
          )}

          {(event.bank_name ||
            event.bank_account ||
            event.clabe ||
            event.gift_bank_message) && (
            <button
              onClick={() => setActiveModal("bank")}
              className="py-4 px-8 bg-secondary text-sm text-white rounded-lg font-light tracking-wider uppercase shadow-lg hover:shadow-xl transition-all"
            >
              Transferencia
            </button>
          )}
        </div>
      </div>

      {/* Modal mesa de regalos */}
      {activeModal === "registry" && selectedRegistry && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-serif text-accent text-center mb-6">
              {selectedRegistry.name}
            </h3>
            <div className="space-y-4 text-center">
              <a
                href={selectedRegistry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-6 bg-primary text-white rounded-lg font-light tracking-wider uppercase hover:shadow-lg transition-all"
              >
                Ver mesa de regalos
              </a>
              {selectedRegistry.reference_number && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">
                    Número de referencia
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-gray-800">
                      {selectedRegistry.reference_number}
                    </span>
                    <button
                      onClick={() => copy(selectedRegistry.reference_number!)}
                      className="text-accent hover:text-secondary"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal transferencia bancaria */}
      {activeModal === "bank" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-serif text-accent text-center mb-2">
              Transferencia
            </h3>
            <p className="text-gray-500 text-center text-sm mb-4 whitespace-pre-line">
              {event.gift_bank_message}
            </p>
            <div className="space-y-4">
              {event.bank_name && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Banco
                    </p>
                    <p className="font-semibold text-gray-800">
                      {event.bank_name}
                    </p>
                  </div>
                </div>
              )}
              {event.bank_account && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Cuenta
                    </p>
                    <p className="font-semibold text-gray-800">
                      {event.bank_account}
                    </p>
                  </div>
                  <button
                    onClick={() => copy(event.bank_account!)}
                    className="text-accent hover:text-secondary ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
              {event.clabe && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      CLABE
                    </p>
                    <p className="font-semibold text-gray-800">{event.clabe}</p>
                  </div>
                  <button
                    onClick={() => copy(event.clabe!)}
                    className="text-accent hover:text-secondary ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal efectivo */}
      {activeModal === "cash" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-serif text-accent text-center mb-2">
              Efectivo
            </h3>
            <p className="text-gray-500 text-center text-sm whitespace-pre-line">
              {event.gift_cash_message}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-xl mx-auto border-t">
        <h2 className="text-3xl font-serif text-center text-accent mb-10">
          Itinerario
        </h2>

        <div className="relative border-l border-[#e8d5c4] pl-10 space-y-10">
          {/* Evento 1 */}
          {event.schedule?.map((item, index) => (
            <div className="relative" key={item.id}>
              <div
                className="absolute -left-[22px] top-0 w-5 h-5 rounded-full border border-white"
                style={{
                  backgroundColor:
                    event.color_palette![index % event.color_palette!.length],
                }}
              ></div>
              <p className="text-sm text-accent tracking-widest uppercase">
                {item.time}
              </p>
              <p className="text-lg text-gray-800 font-light">{item.title}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-xl mx-auto border-t">
        <h2 className="text-3xl font-serif text-center text-accent mb-8">
          Confirma tu Asistencia
        </h2>

        {codigoParam ? (
          <ConfirmationForm codigo={codigoParam} variant="embedded" showDetails={false} />
        ) : (
          <>
            <p className="text-center text-gray-600 leading-relaxed">
              Si has recibido una invitación, accede con tu código único para
              confirmar tu asistencia.
            </p>
            <p className="text-center text-gray-600 mb-8 leading-relaxed bold">
              Fecha limite de confirmación de asistencia:{" "}
              {new Date(event.confirmation_deadline!).toLocaleDateString(
                "es-ES",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Ingresa tu código de invitación"
                className="w-full px-6 py-4 rounded-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-center text-lg tracking-wider uppercase"
                id="codigo-invitacion"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const codigo = (
                      e.target as HTMLInputElement
                    ).value.trim();
                    if (codigo) {
                      window.location.href = `/invitacion/${codigo}`;
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById(
                    "codigo-invitacion",
                  ) as HTMLInputElement;
                  const codigo = input?.value.trim();
                  if (codigo) {
                    window.location.href = `/invitacion/${codigo}`;
                  }
                }}
                className="w-full mt-4 px-8 py-4 bg-primary text-white rounded-lg hover:from-rose-500 hover:to-amber-500 transition-all duration-300 font-light tracking-wider uppercase shadow-lg hover:shadow-xl"
              >
                Acceder
              </button>
            </div>
          </>
        )}
      </div>

      {event.event_host_names && (
        <div className="text-center mt-16 text-gray-500 font-light mb-6">
          <p>Con todo nuestro amor,</p>
          <p className="mt-2">{event.event_host_names}</p>
        </div>
      )}
      <Toaster />
    </>
  );
}
