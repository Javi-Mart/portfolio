import HeroPinned from "@/components/HeroPinned";

export default function Page() {
  return (
    <main>
      <HeroPinned />

      {/* Siguiente sección (placeholder) */}
      <section id="sobre-mi" style={{ minHeight: "100vh", background: "#1f1f1f" }} />
      <section id="proyectos" style={{ minHeight: "100vh", background: "#151515" }} />
      <section id="contacto" style={{ minHeight: "100vh", background: "#101010" }} />
    </main>
  );
}
