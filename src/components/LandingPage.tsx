import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Gift,
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  Shirt,
  Smartphone,
  Star,
  Table2,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Invitaciones con código único",
    desc: "Cada invitado recibe un código personalizado para acceder a su RSVP. Sin contraseñas ni cuentas.",
  },
  {
    icon: UserCheck,
    title: "RSVP con acompañantes",
    desc: "Los invitados confirman asistencia y registran a sus acompañantes en un flujo simple y elegante.",
  },
  {
    icon: LayoutDashboard,
    title: "Panel de administración",
    desc: "Dashboard completo con estadísticas en tiempo real: confirmados, pendientes y declinados.",
  },
  {
    icon: Table2,
    title: "Asignación de mesas drag & drop",
    desc: "Arrastra invitados a las mesas visualmente. Valida capacidad y asigna capitanes de mesa.",
  },
  {
    icon: Upload,
    title: "Importación CSV masiva",
    desc: "Sube tu lista de invitados desde Excel. Vista previa antes de confirmar, con detección de errores.",
  },
  {
    icon: Download,
    title: "Exportación de datos",
    desc: "Exporta la lista completa con nombre, tipo, teléfono, confirmación y mesa en un clic.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp integrado",
    desc: "Genera y envía el enlace de invitación directamente por WhatsApp para cada invitado.",
  },
  {
    icon: Calendar,
    title: "Añadir al calendario",
    desc: "Compatible con iOS, Android y escritorio. Agrega el evento al calendario del invitado automáticamente.",
  },
  {
    icon: MapPin,
    title: "Múltiples ubicaciones",
    desc: "Muestra la ceremonia y la recepción con horarios y enlaces a Google Maps para cada lugar.",
  },
  {
    icon: Clock,
    title: "Cuenta regresiva en vivo",
    desc: "Contador dinámico hacia la fecha del evento visible en la página principal para invitados.",
  },
  {
    icon: Gift,
    title: "Mesa de regalos",
    desc: "Integra tus mesas de regalos y datos bancarios con botón de copiar para mayor comodidad.",
  },
  {
    icon: Shirt,
    title: "Código de vestimenta",
    desc: "Sección visual de paleta de colores y notas del dress code para orientar a tus invitados.",
  },
];

const steps = [
  {
    num: "01",
    title: "Configura tu evento",
    desc: "Define fecha, lugares, itinerario, mesa de regalos y paleta de colores desde el backend.",
  },
  {
    num: "02",
    title: "Carga tu lista de invitados",
    desc: "Importa desde CSV o agrega uno a uno. El sistema genera códigos únicos automáticamente.",
  },
  {
    num: "03",
    title: "Comparte las invitaciones",
    desc: "Envía el enlace personalizado por WhatsApp. Los invitados confirman en segundos.",
  },
  {
    num: "04",
    title: "Gestiona en tiempo real",
    desc: "Visualiza confirmaciones, asigna mesas y monitorea todo desde el panel de administración.",
  },
];

const adminFeatures = [
  "Estadísticas en vivo: confirmados, pendientes y rechazados",
  "CRUD completo de invitados y acompañantes",
  "Búsqueda y filtrado por nombre",
  "Vista expandida de acompañantes por invitado",
  "Asignación de mesas con validación de capacidad",
  "Capitán de mesa con ícono de corona",
  "Importación/exportación CSV con codificación UTF-8",
  "Autenticación segura con JWT",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF6F0] font-sans text-[#333333]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8d5c4]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-serif text-xl text-primary tracking-wide">EventosBoda</span>
          </div>
          <a
            href="mailto:hola@brendayarturo.com"
            className="bg-primary text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-secondary transition-colors"
          >
            Solicitar demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex items-center gap-16">
            {/* Copy */}
            <div className="flex-1 space-y-7">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full font-medium">
                <Star className="w-3.5 h-3.5 fill-primary" />
                Plataforma de bodas todo en uno
              </div>
              <h1 className="text-5xl md:text-6xl font-serif leading-tight text-[#2a1810]">
                Tu boda,<br />
                <span className="text-primary">perfectamente</span><br />
                organizada
              </h1>
              <p className="text-lg text-[#666666] leading-relaxed max-w-lg">
                Gestiona invitados, confirmaciones, mesas y más desde un panel elegante.
                Tus invitados viven una experiencia moderna y memorable.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:hola@brendayarturo.com"
                  className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-medium hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
                >
                  Solicitar demo <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 border border-[#e8d5c4] text-[#555] px-7 py-3.5 rounded-full font-medium hover:bg-white transition-colors"
                >
                  Ver ejemplo en vivo
                </a>
              </div>
            </div>

            {/* Mockup visual */}
            <div className="flex-1 mt-12 md:mt-0">
              <div className="relative">
                {/* Card principal */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/60">
                  <div className="text-center mb-6">
                    <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-2">Invitación personalizada</p>
                    <h2 className="text-4xl font-serif text-primary mb-1">Brenda & Arturo</h2>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto my-3"></div>
                    <p className="text-accent font-light tracking-wider">31 · Octubre · 2026</p>
                  </div>
                  {/* Stats mini */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { val: "180", label: "Invitados" },
                      { val: "142", label: "Confirmados" },
                      { val: "20", label: "Mesas" },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#FDF6F0] rounded-2xl p-3 text-center">
                        <p className="text-2xl font-serif text-primary">{s.val}</p>
                        <p className="text-xs text-[#999] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Guest list mini */}
                  <div className="space-y-2">
                    {[
                      { name: "María González", status: "yes" },
                      { name: "Carlos Ramírez", status: "pending" },
                      { name: "Ana López", status: "yes" },
                    ].map((g) => (
                      <div key={g.name} className="flex items-center justify-between bg-[#FDF6F0] rounded-xl px-4 py-2.5">
                        <span className="text-sm text-[#444]">{g.name}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          g.status === "yes"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {g.status === "yes" ? "Confirmado" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Badge flotante */}
                <div className="absolute -top-4 -right-4 bg-primary text-white text-xs px-4 py-2 rounded-full shadow-lg font-medium">
                  Actualización en vivo
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white border border-[#e8d5c4] text-xs px-4 py-2.5 rounded-2xl shadow-lg text-[#555]">
                  <Smartphone className="inline w-3.5 h-3.5 mr-1 text-primary" />
                  100% responsive
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y border-[#e8d5c4] py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "∞", label: "Invitados por evento" },
            { val: "5s", label: "Actualización automática" },
            { val: "100%", label: "Responsive y móvil" },
            { val: "24h", label: "Acceso al panel" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-serif text-primary mb-1">{s.val}</p>
              <p className="text-sm text-[#888]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-3">Funcionalidades</p>
            <h2 className="text-4xl font-serif text-[#2a1810]">Todo lo que necesitas</h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-[#e8d5c4] hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-[#2a1810] mb-2">{f.title}</h3>
                <p className="text-sm text-[#777] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin panel showcase */}
      <section className="py-24 px-6 bg-white border-y border-[#e8d5c4]">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex items-center gap-16">
            {/* Visual */}
            <div className="flex-1 mb-12 md:mb-0">
              <div className="bg-[#FDF6F0] rounded-3xl p-6 border border-[#e8d5c4]">
                {/* Tabs mock */}
                <div className="flex gap-2 mb-5">
                  <span className="bg-primary text-white text-xs px-4 py-1.5 rounded-full">Invitados</span>
                  <span className="text-[#999] text-xs px-4 py-1.5 rounded-full border border-[#e8d5c4] bg-white">Mesas</span>
                  <span className="text-[#999] text-xs px-4 py-1.5 rounded-full border border-[#e8d5c4] bg-white">Estadísticas</span>
                </div>
                {/* Guest rows */}
                <div className="space-y-2 mb-4">
                  {[
                    { name: "Familia García", passes: 4, conf: 4, table: "Mesa 3" },
                    { name: "Roberto Silva", passes: 2, conf: 2, table: "Mesa 7" },
                    { name: "Daniela Torres", passes: 3, conf: 0, table: "—" },
                  ].map((g) => (
                    <div key={g.name} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-[#e8d5c4]">
                      <div>
                        <p className="text-sm font-medium text-[#333]">{g.name}</p>
                        <p className="text-xs text-[#aaa]">{g.passes} pases · {g.table}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        g.conf > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {g.conf > 0 ? `${g.conf} conf.` : "Pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Action buttons mock */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-white border border-[#e8d5c4] text-[#888] px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Importar CSV
                  </span>
                  <span className="text-xs bg-white border border-[#e8d5c4] text-[#888] px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Download className="w-3 h-3" /> Exportar
                  </span>
                  <span className="text-xs bg-white border border-[#e8d5c4] text-[#888] px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </span>
                </div>
              </div>
            </div>
            {/* Copy */}
            <div className="flex-1">
              <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-3">Panel de administración</p>
              <h2 className="text-4xl font-serif text-[#2a1810] mb-5">Control total de tu evento</h2>
              <p className="text-[#666] leading-relaxed mb-7">
                Un panel intuitivo donde tienes visibilidad completa de tu evento.
                Sin necesidad de hojas de cálculo ni grupos de WhatsApp desordenados.
              </p>
              <ul className="space-y-3">
                {adminFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#555]">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Guest experience */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex items-center gap-16">
            {/* Copy */}
            <div className="flex-1 mb-12 md:mb-0">
              <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-3">Experiencia del invitado</p>
              <h2 className="text-4xl font-serif text-[#2a1810] mb-5">Elegante desde el primer clic</h2>
              <p className="text-[#666] leading-relaxed mb-7">
                Tus invitados abren su enlace personalizado y confirman asistencia en segundos.
                Diseño adaptado a tu evento, sin distracciones.
              </p>
              <div className="space-y-5">
                {[
                  { icon: QrCode, t: "Acceso con código único", d: "Sin registros ni contraseñas. Solo su código." },
                  { icon: Users, t: "Confirmación de acompañantes", d: "Registran el nombre de cada acompañante." },
                  { icon: Calendar, t: "Agrega a su calendario", d: "Un botón para iOS, Android y escritorio." },
                  { icon: Mail, t: "Notificación instantánea", d: "El admin ve la confirmación en tiempo real." },
                ].map((item) => (
                  <div key={item.t} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2a1810] text-sm">{item.t}</p>
                      <p className="text-sm text-[#777] mt-0.5">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Phone mockup */}
            <div className="flex-1 flex justify-center">
              <div className="w-64 bg-white rounded-[2.5rem] border-4 border-[#e8d5c4] shadow-2xl overflow-hidden">
                {/* Phone notch */}
                <div className="bg-[#e8d5c4] h-6 flex justify-center items-end pb-1">
                  <div className="w-16 h-1 bg-[#c9a98a] rounded-full"></div>
                </div>
                {/* Screen content */}
                <div className="p-5 bg-[#FDF6F0] min-h-96">
                  <div className="text-center mb-5">
                    <p className="text-xs text-accent uppercase tracking-widest mb-2">Tu invitación</p>
                    <h3 className="text-2xl font-serif text-primary">Brenda & Arturo</h3>
                    <div className="w-10 h-0.5 bg-primary/40 mx-auto my-2"></div>
                    <p className="text-xs text-[#888]">31 de Octubre, 2026</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 mb-3 border border-[#e8d5c4]">
                    <p className="text-xs text-[#aaa] mb-1">Invitado</p>
                    <p className="text-sm font-medium text-[#333]">María González</p>
                    <p className="text-xs text-[#bbb] mt-0.5">2 pases confirmados</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-3">
                    <p className="text-xs text-emerald-700 font-medium">✓ Asistencia confirmada</p>
                  </div>
                  <button className="w-full bg-primary text-white text-xs py-2.5 rounded-xl font-medium">
                    Añadir al calendario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white border-y border-[#e8d5c4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-3">Proceso</p>
            <h2 className="text-4xl font-serif text-[#2a1810]">Cómo funciona</h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5">
                <div className="flex-shrink-0">
                  <span className="text-4xl font-serif text-primary/20 leading-none">{s.num}</span>
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-[#2a1810] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#777] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-3">Tecnología</p>
          <h2 className="text-4xl font-serif text-[#2a1810] mb-5">Construido para durar</h2>
          <p className="text-[#666] leading-relaxed max-w-xl mx-auto mb-12">
            Stack moderno, confiable y de alto rendimiento.
            Actualizaciones en tiempo real cada 5 segundos sin recargar la página.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "React + TypeScript", desc: "Frontend robusto" },
              { name: "Strapi v5", desc: "Backend headless" },
              { name: "Tailwind CSS", desc: "UI elegante" },
              { name: "JWT Auth", desc: "Acceso seguro" },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-[#e8d5c4] rounded-2xl p-5 hover:border-primary/30 transition-colors">
                <p className="font-semibold text-[#2a1810] text-sm mb-1">{t.name}</p>
                <p className="text-xs text-[#999]">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#e8d5c4] shadow-xl p-12 text-center">
            <Heart className="w-10 h-10 text-primary fill-primary/20 mx-auto mb-6" />
            <h2 className="text-4xl font-serif text-[#2a1810] mb-4">
              ¿Listo para tu evento perfecto?
            </h2>
            <p className="text-[#666] leading-relaxed mb-8">
              Agenda una demostración gratuita y te mostramos cómo personalizar
              la plataforma para tu boda o evento especial.
            </p>
            <a
              href="mailto:hola@brendayarturo.com"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors shadow-lg shadow-primary/20 text-lg"
            >
              <Mail className="w-5 h-5" />
              Contáctanos
            </a>
            <p className="text-xs text-[#bbb] mt-6">Sin compromisos · Respuesta en 24 horas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8d5c4] py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <span className="font-serif text-primary">EventosBoda</span>
        </div>
        <p className="text-xs text-[#bbb]">Plataforma de gestión de eventos</p>
      </footer>
    </div>
  );
}
