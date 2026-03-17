import Image from 'next/image';
import Link from 'next/link';

interface characterProps {
  params: { character_id: string }
}

type CharacterDetail = {
  mal_id: number;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  images: { jpg: { image_url: string }; webp: { image_url: string } };
};

type VoiceActor = {
  language: string;
  person: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
};

type AnimeAppearance = {
  role: string;
  anime: {
    mal_id: number;
    title: string;
    images: { webp: { image_url: string } };
  };
};

export default async function CharacterPage(props: characterProps) {
  const { character_id } = await props.params;

  const [charRes, voicesRes, animeRes] = await Promise.all([
    fetch(`https://api.jikan.moe/v4/characters/${character_id}`),
    fetch(`https://api.jikan.moe/v4/characters/${character_id}/voices`),
    fetch(`https://api.jikan.moe/v4/characters/${character_id}/anime`),
  ]);

  const char: CharacterDetail = (await charRes.json()).data;
  const voices: VoiceActor[] = (await voicesRes.json()).data ?? [];
  const animeAppearances: AnimeAppearance[] = (await animeRes.json()).data ?? [];

  const jaVoice = voices.find((v) => v.language === "Japanese");
  const enVoice = voices.find((v) => v.language === "English");
  const otherVoices = voices.filter((v) => v.language !== "Japanese" && v.language !== "English");

  return (
    <div className="min-h-[calc(100vh-84px)]">
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/90 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent z-10" />

        <Image
          src={char.images.webp.image_url}
          alt={`imagen de ${char.name}`}
          fill priority sizes="100vw"
          className="object-cover object-top"
        />

        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/40 hover:text-(--color-boton) transition-colors">
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

      <div className="bg-(--color-contenedor)">
        {(char.nicknames.length > 0 || char.favorites > 0) && (
          <div className="border-b border-white/8 px-6 md:px-16 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {char.favorites > 0 && (
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="text-(--color-boton)">♥</span>
                <span>{char.favorites.toLocaleString()} favoritos</span>
              </div>
            )}
            {char.nicknames.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/30 uppercase tracking-wider">Alias:</span>
                {char.nicknames.map((nick) => (
                  <span key={nick} className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/60 border border-white/10">
                    {nick}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <SectionTitle>Biografía</SectionTitle>
              <div className="rounded-xl p-6 md:p-8 bg-black/20 border border-white/5 mt-4">
                <p className="leading-relaxed text-sm md:text-base text-white/85 whitespace-pre-line">
                  {char.about || "No hay información biográfica disponible para este personaje."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {(jaVoice || enVoice) && (
              <div>
                <SectionTitle>Seiyuu / Doblaje</SectionTitle>
                <div className="mt-4 space-y-3">
                  {[jaVoice, enVoice].filter(Boolean).map((va) => (
                    <VoiceActorCard key={va!.person.mal_id} va={va!} />
                  ))}
                  {otherVoices.length > 0 && (
                    <details className="group">
                      <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors py-1 select-none">
                        + {otherVoices.length} idioma{otherVoices.length > 1 ? "s" : ""} más
                      </summary>
                      <div className="mt-2 space-y-2">
                        {otherVoices.map((va) => (
                          <VoiceActorCard key={va.person.mal_id} va={va} />
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            )}

            {animeAppearances.length > 0 && (
              <div>
                <SectionTitle>Apariciones</SectionTitle>
                <div className="mt-4 space-y-2">
                  {animeAppearances.map((a) => (
                    <div key={a.anime.mal_id} className="flex items-center gap-3 p-2.5 rounded-lg bg-black/15 border border-white/5">
                      <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={a.anime.images.webp.image_url}
                          alt={a.anime.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white/80 leading-snug truncate">{a.anime.title}</p>
                        <p className="text-[10px] mt-0.5 text-white/35">{a.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 bg-(--color-boton) rounded-full flex-shrink-0" />
      <h3 className="text-xl md:text-2xl font-bangers text-(--color-boton) tracking-wide">{children}</h3>
    </div>
  );
}

function VoiceActorCard({ va }: { va: VoiceActor }) {
  const langLabel: Record<string, string> = {
    Japanese: "JP",
    English: "EN",
    French: "FR",
    Spanish: "ES",
    German: "DE",
    Italian: "IT",
    Portuguese: "PT",
    Korean: "KO",
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-black/15 border border-white/5">
      <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-white/5">
        <Image
          src={va.person.images.jpg.image_url}
          alt={va.person.name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/80 truncate">{va.person.name}</p>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--color-boton)/15 text-(--color-boton) font-semibold tracking-wider flex-shrink-0">
        {langLabel[va.language] ?? va.language}
      </span>
    </div>
  );
}
