import Image from 'next/image';
import Link from 'next/link';

interface characterProps {
  params: {
    character_id: string
  }
};

export default async function CharacterPage(props: characterProps) {
  const { character_id } = await props.params;
  const character_data = await fetch(`https://api.jikan.moe/v4/characters/${character_id}`)
  const character_json = await character_data.json();
  const char = character_json.data;

  return (
    <div className="min-h-[calc(100vh-84px)]">
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/90 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent z-10" />

        <Image
          src={char.images.webp.image_url}
          alt={`imagen de ${char.name}`}
          fill priority sizes="100vw"
          className="object-cover object-top" />

        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 hover:text-(--color-boton) transition-colors"
          >
            ← Volver
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-16 pb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-(--color-boton) mb-3 opacity-70 font-sans">
            Hunter × Hunter
          </p>
          <h2 className="text-5xl md:text-7xl tracking-wider font-bangers text-white leading-none drop-shadow-2xl">
            {char.name}
          </h2>
          {char.name_kanji && (
            <p className="text-xl md:text-2xl mt-2 font-bangers text-white/50 tracking-wide">
              {char.name_kanji}
            </p>
          )}
        </div>
      </div>

      <section className="bg-(--color-contenedor)">
        <div className="max-w-4xl mx-auto px-6 md:px-16 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-(--color-boton) rounded-full" />
            <h3 className="text-2xl md:text-3xl font-bangers text-(--color-boton) tracking-wide">
              Biografía
            </h3>
          </div>

          <div className="rounded-xl p-6 md:p-8 bg-black/20 border border-white/5">
            <p className="leading-relaxed text-sm md:text-base text-white/85 whitespace-pre-line">
              {char.about || "No hay información biográfica disponible para este personaje."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
