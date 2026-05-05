import {
  Calendar,
  Church,
  Clock,
  Copy,
  Gift,
  MapPin,
  Shirt,
  Wine,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { eventService } from "../lib/services";
import { Event } from "../lib/types";
import CountdownToDate from "./counter";

export default function HomePage() {
  const documentId = import.meta.env.VITE_EVENT_ID;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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
            primary: "#C27341",
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
          primary: "#C27341",
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

    if (isIOS) {
      // iOS: data URI con webcal — abre directo en Calendario
      const dataUrl =
        "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);
      window.location.href = dataUrl;
      toast.success("Evento agregado al calendario");
    } else if (isAndroid && navigator.share) {
      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      const file = new File([blob], `${event?.main_title || "event"}.ics`, {
        type: "text/calendar",
      });
      navigator
        .share({
          title: event?.main_title || "Event",
          text: "Agrega la boda a tu calendario",
          files: [file],
        })
        .catch(() => downloadICS(icsContent));
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
    return <div className="p-10 text-center">Cargando...</div>;
  }

  const mainLocation = event.locations?.[0];

  const strapiBaseUrl = import.meta.env.VITE_STRAPI_API_URL;

  const backgroundImageUrl = `${strapiBaseUrl}${event.background_image?.formats?.large?.url}`;
  const musicUrl = `${strapiBaseUrl}${event.music?.url}`;
  const galleryImageUrl = `${strapiBaseUrl}${event.gallery_image?.formats?.large?.url}`;

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          height: "100hv",
        }}
      >
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
            <audio controls className="mb-6" autoPlay={false}>
              <source src={musicUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <p className=" text-center my-12">
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

      <div className=" mt-10 mb-20 ">
        <p className="font-bold mt-6 text-center text-xl md:text-2xl items-center text-accent">
          <Shirt className="inline" /> Código de vestimenta:{" "}
          {event.dress_code || "Formal"}
        </p>
        <p className="text-center mt-4">{event.dress_code_note || ""}</p>
        <div className="flex justify-center gap-4 mt-6">
          <div className="bg-primary w-5 h-5 rounded-full"></div>
          <div className="bg-secondary w-5 h-5 rounded-full"></div>
          <div className="bg-accent w-5 h-5 rounded-full"></div>
          <div className="bg-background w-5 h-5 rounded-full"></div>
        </div>
      </div>

      {event.gallery_image && (
        <div className="inset-0 flex bg-black/30 justify-center">
          <img src={galleryImageUrl} className="" />
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-sm p-12 max-w-xl mx-auto border-t">
        <h2 className="text-3xl font-serif text-center text-accent mb-8 items-center">
          <Gift className="inline text-lg" /> Regalo
        </h2>

        <p className="text-gray-600 text-center">
          {event.gift_message ||
            "Tu presencia es el mejor regalo que podríamos pedir."}
        </p>

        {/* Liverpool */}
        {event.gift_registry?.map((registry) => (
          <div key={registry.id} className="mt-10 text-center">
            <p className="text-gray-800 font-semibold mb-2">{registry.name}</p>
            <a
              href={registry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline break-all"
            >
              Ver mesa de regalos
            </a>
            {registry.reference_number && (
              <p className="text-sm text-gray-600 mt-2">
                Número de referencia:{" "}
                <span className="font-bold">{registry.reference_number}</span>{" "}
                <button
                  className="link"
                  onClick={() => copy(registry.reference_number!)}
                >
                  <Copy className="inline" />
                </button>
              </p>
            )}
          </div>
        ))}

        {/* Transferencia como opción alternativa */}
        <div className="mt-10">
          <p className="text-gray-600 text-center mb-4">
            O si lo prefieres, nos haría muchísima ilusión que nos ayudes a
            hacer realidad nuestro viaje de bodas. Prometemos pensar en ti
            mientras disfrutamos cada aventura, cada paisaje y cada recuerdo
            inolvidable. ✈️🌍💛
          </p>

          {(event.bank_name || event.bank_account) && (
            <div className="flex gap-1 justify-center mb-6">
              {event.bank_account && (
                <p className="text-gray-600 font-bold">
                  Cuenta: {event.bank_account}
                </p>
              )}
              {event.bank_name && (
                <p className="text-gray-600 font-bold">
                  Banco: {event.bank_name}
                </p>
              )}
              <button
                className="link"
                onClick={() => copy(event.bank_account!)}
              >
                <Copy className="inline" />
              </button>
            </div>
          )}

          {event.clabe && (
            <div className="flex gap-1 justify-center">
              <p className="text-gray-600 font-bold">CLABE: {event.clabe}</p>
              <button
                className="link inline flex"
                onClick={() => copy(event.clabe!)}
              >
                <Copy className="inline" />
              </button>
            </div>
          )}
        </div>
      </div>

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

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-rose-100">
        <h2 className="text-3xl font-serif text-center text-accent mb-8">
          Confirma tu Asistencia
        </h2>

        <p className="text-center text-gray-600 leading-relaxed">
          Si has recibido una invitación, accede con tu código único para
          confirmar tu asistencia.
        </p>
        <p className="text-center text-gray-600 mb-8 leading-relaxed bold">
          Fecha limite de confirmación de asistencia:{" "}
          {new Date(event.confirmation_deadline!).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Ingresa tu código de invitación"
            className="w-full px-6 py-4 rounded-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-center text-lg tracking-wider uppercase"
            id="codigo-invitacion"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const codigo = (e.target as HTMLInputElement).value.trim();
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
