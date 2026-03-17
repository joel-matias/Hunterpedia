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

export default async function Home() {
  const characters_data = await fetch(`https://api.jikan.moe/v4/anime/11061/characters`);
  const characters_json: CharacterResponse = await characters_data.json();

  const mainChars = characters_json.data.filter((c) => c.role === "Main");
  const supportingChars = characters_json.data.filter((c) => c.role === "Supporting");

  return (
    <div className="px-6 md:px-12 py-10 space-y-12">
      <CharacterSection title="Personajes Principales" characters={mainChars} />
      <CharacterSection title="Personajes Secundarios" characters={supportingChars} />
    </div>
  );
}

type CharacterItem = CharacterResponse["data"][number];

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
          return (
            <Link key={item.character.mal_id} href={`/${item.character.mal_id}`} className="group block">
              <div className="relative overflow-hidden rounded-xl bg-(--color-contenedor) border border-white/5
                hover:border-(--color-boton)/40 hover:-translate-y-1.5
                hover:shadow-[0_8px_24px_rgba(246,199,68,0.12)]
                transition-all duration-300 ease-out">
                <div className="aspect-2/3 relative overflow-hidden">
                  <Image
                    src={item.character.images.webp.image_url}
                    alt={item.character.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
