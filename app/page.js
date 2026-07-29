import MuvApp from "./MuvApp";
import { client } from "../tina/__generated__/client";

async function getTina() {
  try {
    const rel = (n) => ({ relativePath: n });
    const [home, services, process, works, posts, brands, marquee] = await Promise.all([
      client.queries.home(rel("home.json")),
      client.queries.services(rel("services.json")),
      client.queries.process(rel("process.json")),
      client.queries.works(rel("works.json")),
      client.queries.posts(rel("posts.json")),
      client.queries.brands(rel("brands.json")),
      client.queries.marquee(rel("marquee.json")),
    ]);
    return { home, services, process, works, posts, brands, marquee };
  } catch (e) {
    // Sem rede pro TinaCloud (ex: build local) ou falha -> cai pro render estático.
    return null;
  }
}

export default async function Page() {
  const tina = await getTina();
  return <MuvApp page="home" tina={tina} />;
}
