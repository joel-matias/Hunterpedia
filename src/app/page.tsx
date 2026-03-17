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
  }[];
};

export default async function Home() {
  const characters_data = await fetch(`https://api.jikan.moe/v4/anime/11061/characters`);
  const characters_json: CharacterResponse = await characters_data.json();

  return (
    <div className="px-6 md:px-12 py-10">
      <div className="mb-8 flex items-end gap-4 border-b border-white/8 pb-6">
        <div className="border-l-4 border-(--color-boton) pl-4">
          <h2 className="font-bangers text-3xl md:text-4xl text-white tracking-wide leading-none">
            Personajes
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {characters_json.data.map((item) => (
          <Link
            key={item.character.mal_id}
            href={`/${item.character.mal_id}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-xl bg-(--color-contenedor) border border-white/5
              hover:border-(--color-boton)/40 hover:-translate-y-1.5
              hover:shadow-[0_8px_24px_rgba(246,199,68,0.12)]
              transition-all duration-300 ease-out">
              <div className="aspect-2/3 relative overflow-hidden">
                <Image
                  src={item.character.images.webp.image_url}
                  alt={item.character.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 px-3 py-3 font-bangers text-base md:text-lg text-white tracking-wide leading-tight">
                  {item.character.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
