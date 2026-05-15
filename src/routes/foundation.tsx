import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/foundation")({
  component: FoundationPage,
  head: () => ({
    meta: [
      { title: "The Foundation Network — Jinasena Padanama" },
      {
        name: "description",
        content:
          "Four pillars working toward a more conscious society: SELF, MOU, ECO and JTF.",
      },
    ],
  }),
});

const pillars = [
  {
    n: "01",
    code: "SELF",
    title: "Shape and Enliven Lives Foundation",
    si: "සමාජයේ පොදු ජීවන තත්ත්වය ඉහළ නැංවීම සඳහා දැනුම බෙදා හදා ගැනීම සහ පහසුකම් සැලසීම තුළින් ධනාත්මක සමාජ වෙනසක් ඇති කිරීම මෙහි අරමුණයි.",
    en: "Creating positive social change by sharing knowledge and resources to elevate everyday life.",
  },
  {
    n: "02",
    code: "MOU",
    title: "Mattegoda Osu Uyana",
    si: "දුර්ලභ ඖෂධීය ශාක ප්‍රදර්ශනය කිරීම, ජෛව විවිධත්වයේ වැදගත්කම සහ දේශීය වෛද්‍ය ක්‍රම පිළිබඳ දැනුම වර්ධනය කිරීම සඳහා වෙන්වූ ඖෂධීය උයනකි.",
    en: "A medicinal garden showcasing rare healing plants, biodiversity, and indigenous Sri Lankan medicine.",
  },
  {
    n: "03",
    code: "ECO",
    title: "Jinasena EcoSAT",
    si: "තිරසාර කෘෂිකර්මාන්තය සහ කාබනික ගොවිතැන් පිළිබඳ දැනුම ග්‍රාමීය තරුණ ප්‍රජාවට ලබා දෙමින් ඔවුන්ගේ ආදායම් මාර්ග සහ ජීවන තත්ත්වය ඉහළ නැංවීමට කටයුතු කරයි.",
    en: "Bringing sustainable agriculture and organic farming knowledge to rural youth — improving income and life.",
  },
  {
    n: "04",
    code: "JTF",
    title: "Jinasena Training Foundation",
    si: "ආචාර්ය තිස්ස ජිනසේන මහතාගේ අරමුණ වන්නේ නවීන කෘතිම බුද්ධිය (AI) සහ උසස් තාක්ෂණය මානව සේවයක් සඳහා යොදා ගැනීමයි. 'ලෝඩ්ස්ටාර්' (Loadstar) වැනි දැවැන්ත කර්මාන්තශාලා ගොඩනැගීමට ඉදිරිපත් වන තරුණ පරපුරක් බිහි කරමින්, ග්‍රාමීය තරුණයින් ලෝක මට්ටමේ වෘත්තිකයන් බවට පත් කරයි.",
    en: "AI technology meets an enlightened social mission. Dr. Tissa Jinasena's vision: harness modern AI and advanced technology for human service — building the next generation of entrepreneurs ready to create Loadstar-scale industries from rural Sri Lanka.",
  },
];

function FoundationPage() {
  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">
            — The Network
          </div>
          <p className="font-sinhala text-base text-muted-foreground mb-6">අපගේ පදනම් ජාලය</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            Four pillars working toward a more conscious society.
          </h1>
        </section>

        <section className="mx-auto max-w-6xl px-6 md:px-12 pb-32">
          {pillars.map((p, i) => (
            <div
              key={p.code}
              className={`grid md:grid-cols-12 gap-8 py-16 ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="md:col-span-2">
                <div className="font-serif text-5xl text-accent">{p.n}</div>
                <div className="text-[11px] tracking-display uppercase text-muted-foreground mt-2">
                  {p.code}
                </div>
              </div>
              <div className="md:col-span-5">
                <h2 className="font-serif text-3xl md:text-4xl leading-tight">{p.title}</h2>
              </div>
              <div className="md:col-span-5 space-y-4">
                <p className="font-sinhala leading-relaxed text-sm">{p.si}</p>
                <p className="text-muted-foreground italic text-sm leading-relaxed">{p.en}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
