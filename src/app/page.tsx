import Image from "next/image";
import Link from "next/link";

type CharacterResponse = {
  data: {
    character: {
      mal_id: number;
      name: string;
      images: {
        jpg: { image_url: string };
        webp: { image_url: string };
      };
    };
    role: string;
    favorites: number;
    voice_actors: {
      person: { name: string };
      language: string;
    }[];
  }[];
};

type CharacterItem = CharacterResponse["data"][number];

export default async function Home() {
  const res = await fetch(`https://api.jikan.moe/v4/anime/11061/characters`, {
    next: { revalidate: 3600 },
  });
  const { data }: CharacterResponse = await res.json();

  const mainChars: CharacterItem[] = [];
  const supportingChars: CharacterItem[] = [];
  for (const c of data) {
    if (c.role === "Main") mainChars.push(c);
    else supportingChars.push(c);
  }

  return (
    <div className="px-6 md:px-12 py-10 space-y-12">
      <CharacterSection title="Personajes Principales" characters={mainChars} />
      <CharacterSection title="Personajes Secundarios" characters={supportingChars} />
    </div>
  );
}

function CharacterSection({ title, characters }: { title: string; characters: CharacterItem[] }) {
  return (
    <div>
      <div className="mb-6 border-b border-white/8 pb-4">
        <div className="border-l-4 border-(--color-boton) pl-4">
          <h2 className="font-bangers text-2xl md:text-3xl text-white tracking-wide leading-none">
            {title}
          </h2>
          <p className="text-xs text-white/40 mt-1 tracking-wider">{characters.length} personajes</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {characters.map((item) => {
          const jaVA = item.voice_actors.find((va) => va.language === "Japanese");
          const licenseId = String(item.character.mal_id).padStart(7, "0");
          return (
            <div key={item.character.mal_id} className="card-3d">
              <Link
                href={`/${item.character.mal_id}`}
                className="relative w-full"
                style={{ aspectRatio: "2/3" }}
              >
                <div className="card-face absolute inset-0 rounded-xl overflow-hidden bg-(--color-contenedor) border border-white/5 shadow-md">
                  <Image
                    src={item.character.images.webp.image_url}
                    alt={item.character.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-3">
                    <p className="font-bangers text-base md:text-lg text-white tracking-wide leading-tight">
                      {item.character.name}
                    </p>
                    {jaVA && (
                      <p className="text-[10px] text-white/45 mt-0.5 leading-tight truncate">
                        CV: {jaVA.person.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="card-face card-back absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                  style={{ background: "linear-gradient(150deg, #d4d7de 0%, #b8bcc8 50%, #c8ccd6 100%)" }}>

                  <div className="absolute inset-1 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col">
                    {/* Logo */}
                    <div className="bg-black flex items-center justify-center px-3 py-2" style={{ height: "46%" }}>
                      <div className="bg-white w-full h-full rounded-sm flex items-center justify-center p-1">
                        <svg viewBox="0 0 110 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <line x1="5" y1="4" x2="54" y2="76" stroke="black" strokeWidth="9" strokeLinecap="butt" />
                          <line x1="54" y1="4" x2="5" y2="76" stroke="black" strokeWidth="9" strokeLinecap="butt" />
                          <line x1="56" y1="4" x2="105" y2="76" stroke="black" strokeWidth="9" strokeLinecap="butt" />
                          <line x1="105" y1="4" x2="56" y2="76" stroke="black" strokeWidth="9" strokeLinecap="butt" />
                          <polygon points="55,20 72,40 55,60 38,40" fill="#b91c1c" />
                          <rect x="0" y="1" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="48" y="1" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="0" y="74" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="48" y="74" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="49" y="1" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="97" y="1" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="49" y="74" width="13" height="5" rx="0.5" fill="black" />
                          <rect x="97" y="74" width="13" height="5" rx="0.5" fill="black" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center px-1.5 gap-1" style={{ height: "8%", background: "#c8cbd4" }}>
                      <div className="flex gap-0.5 items-center">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-0.5 h-3 bg-gray-500/50 rounded-full" />
                        ))}
                      </div>
                      <div className="flex-1 h-0.5 bg-gray-400/30 rounded" />
                      <div className="flex gap-0.5 items-center">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-0.5 h-3 bg-gray-500/50 rounded-full" />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col px-2 pt-1.5 pb-2 gap-1" style={{ background: "#c2daf0" }}>
                      <div className="border border-gray-500/50 bg-white/70 rounded-sm px-1.5 py-0.5">
                        <p className="font-bangers text-sm text-gray-800 tracking-wider truncate leading-tight">
                          {item.character.name}
                        </p>
                      </div>
                      <div className="space-y-0.5 px-0.5">
                        <p className="text-[8px] text-gray-700 font-mono">
                          {item.character.name} · #{licenseId}
                        </p>
                        <p className="text-[8px] text-gray-700">
                          {item.role === "Main" ? "★ Cazador Principal" : "◆ Cazador"}
                        </p>
                        {jaVA && (
                          <p className="text-[8px] text-gray-600 truncate">
                            CV: {jaVA.person.name}
                          </p>
                        )}
                        {item.favorites > 0 && (
                          <p className="text-[8px] text-gray-600">
                            ♥ {item.favorites >= 1000 ? `${(item.favorites / 1000).toFixed(1)}k` : item.favorites} fans
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
