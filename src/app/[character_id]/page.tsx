import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;

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

const langLabel: Record<string, string> = {
  Japanese: "JP", English: "EN", French: "FR",
  Spanish: "ES", German: "DE", Italian: "IT",
  Portuguese: "PT", Korean: "KO",
};

async function fetchJikan<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return (json.data ?? null) as T | null;
  } catch (error) {
    console.error(`Failed to fetch Jikan resource: ${url}`, error);
    return null;
  }
}

export async function generateMetadata(props: characterProps): Promise<Metadata> {
  const { character_id } = await props.params;
  const char = await fetchJikan<CharacterDetail>(`https://api.jikan.moe/v4/characters/${character_id}`);

  if (!char) {
    return {
      title: "Personaje | Hunterpedia",
      description: "Información de personajes de Hunter x Hunter en Hunterpedia.",
    };
  }

  const description = char.about?.split("\n")[0]?.slice(0, 155) ?? `Información sobre ${char.name} en Hunter × Hunter.`;
  return {
    title: `${char.name} | Hunterpedia`,
    description,
    openGraph: {
      title: `${char.name} | Hunterpedia`,
      description,
      images: [{ url: char.images.jpg.image_url }],
    },
  };
}

export default async function CharacterPage(props: characterProps) {
  const { character_id } = await props.params;

  const [char, voices, animeAppearances] = await Promise.all([
    fetchJikan<CharacterDetail>(`https://api.jikan.moe/v4/characters/${character_id}`),
    fetchJikan<VoiceActor[]>(`https://api.jikan.moe/v4/characters/${character_id}/voices`),
    fetchJikan<AnimeAppearance[]>(`https://api.jikan.moe/v4/characters/${character_id}/anime`),
  ]);

  if (!char) notFound();

  let jaVoice: VoiceActor | undefined;
  let enVoice: VoiceActor | undefined;
  const otherVoices: VoiceActor[] = [];
  for (const v of voices ?? []) {
    if (v.language === "Japanese") jaVoice = v;
    else if (v.language === "English") enVoice = v;
    else otherVoices.push(v);
  }

  return (
    <div className="min-h-[calc(100vh-84px)] bg-(--color-contenedor)">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-2">
        <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/35 hover:text-(--color-boton) transition-colors">
          ← Volver
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,20rem)] gap-8 md:gap-12 items-start">
        <div className="w-48 sm:w-56 md:w-64 lg:w-72 mx-auto sm:mx-0">
          <div className="relative aspect-2/3 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
            <Image
              src={char.images.webp.image_url}
              alt={`imagen de ${char.name}`}
              fill priority sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end pt-2 min-w-0">
          <p className="text-xs tracking-[0.25em] uppercase text-(--color-boton) opacity-60 mb-3 font-sans">
            Hunter × Hunter
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bangers text-white tracking-wider leading-none">
            {char.name}
          </h2>
          {char.name_kanji && (
            <p className="text-lg md:text-2xl mt-2 font-bangers text-white/40 tracking-wide">
              {char.name_kanji}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {char.favorites > 0 && (
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-black/25 border border-white/10 text-white/55">
                <span className="text-(--color-boton)">♥</span>
                {char.favorites.toLocaleString()} favoritos
              </span>
            )}
            {char.nicknames.map((nick) => (
              <span key={nick} className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-white/55 border border-white/10">
                {nick}
              </span>
            ))}
          </div>

          {(jaVoice || enVoice) && (
            <div className="mt-7">
              <SectionTitle>Seiyuu / Doblaje</SectionTitle>
              <div className="mt-3 space-y-2 max-w-sm">
                {[jaVoice, enVoice].filter(Boolean).map((va) => (
                  <VoiceActorCard key={va!.person.mal_id} va={va!} />
                ))}
                {otherVoices.length > 0 && (
                  <details>
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
        </div>

        {(animeAppearances?.length ?? 0) > 0 && (
          <div className="min-w-0 pt-2">
            <SectionTitle>Apariciones</SectionTitle>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {animeAppearances!.map((a) => (
                <div key={a.anime.mal_id} className="flex items-center gap-2.5 p-2 rounded-lg bg-black/15 border border-white/5">
                  <div className="relative w-8 h-11 shrink-0 rounded overflow-hidden">
                    <Image
                      src={a.anime.images.webp.image_url}
                      alt={a.anime.title}
                      fill sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/75 leading-snug truncate">{a.anime.title}</p>
                    <p className="text-[10px] mt-0.5 text-white/30">{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {char.about && (
        <div className="border-t border-white/8 mt-4">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
            <SectionTitle>Biografía</SectionTitle>
            <div className="mt-5 max-w-3xl space-y-4">
              {char.about.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="leading-7 text-sm md:text-base text-white/75">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-1 h-5 bg-(--color-boton) rounded-full shrink-0" />
      <h3 className="text-lg md:text-xl font-bangers text-(--color-boton) tracking-wide">{children}</h3>
    </div>
  );
}

function VoiceActorCard({ va }: { va: VoiceActor }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-black/15 border border-white/5">
      <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5">
        <Image
          src={va.person.images.jpg.image_url}
          alt={va.person.name}
          fill sizes="36px"
          className="object-cover"
        />
      </div>
      <p className="text-xs text-white/75 truncate flex-1">{va.person.name}</p>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--color-boton)/15 text-(--color-boton) font-semibold tracking-wider shrink-0">
        {langLabel[va.language] ?? va.language}
      </span>
    </div>
  );
}
