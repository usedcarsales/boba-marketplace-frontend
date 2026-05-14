import Link from "next/link";
import Image from "next/image";
import StatsBanner from "@/components/StatsBanner";

const SETS = [
  { name: "Griffey Edition", count: "10,004", color: "from-glow/20 to-transparent" },
  { name: "Alpha Update", count: "3,809", color: "from-hex/20 to-transparent" },
  { name: "Alpha Edition", count: "2,291", color: "from-fire/20 to-transparent" },
  { name: "Alpha Blast", count: "1,385", color: "from-ice/20 to-transparent" },
  { name: "World Champions", count: "103", color: "from-super/20 to-transparent" },
  { name: "Promo Cards", count: "72", color: "from-brawl/20 to-transparent" },
  { name: "National 24 Starter Set", count: "65", color: "from-steel/20 to-transparent" },
  { name: "Battle Trainer Kit", count: "49", color: "from-gum/20 to-transparent" },
  { name: "Big League Chew", count: "17", color: "from-cyber/20 to-transparent" },
];

const WEAPONS = [
  { name: "Fire", color: "#D1493D", glow: "weapon-glow-fire", count: "3,216", icon: "🔥" },
  { name: "Ice", color: "#1EB2F2", glow: "weapon-glow-ice", count: "3,231", icon: "❄️" },
  { name: "Steel", color: "#A8B2C0", glow: "weapon-glow-steel", count: "2,915", icon: "⚔️" },
  { name: "Glow", color: "#79F528", glow: "weapon-glow-glow", count: "2,700", icon: "✨" },
  { name: "Hex", color: "#E23167", glow: "weapon-glow-hex", count: "2,498", icon: "🔮" },
  { name: "Brawl", color: "#F2841E", glow: "weapon-glow-brawl", count: "1,603", icon: "👊" },
  { name: "Gum", color: "#FF69B4", glow: "weapon-glow-gum", count: "497", icon: "🫧" },
  { name: "Super", color: "#FFD700", glow: "weapon-glow-super", count: "455", icon: "⭐" },
  { name: "Alt", color: "#FF6B35", glow: "weapon-glow-fire", count: "41", icon: "🔀" },
  { name: "Cyber", color: "#00D4FF", glow: "weapon-glow-ice", count: "26", icon: "🤖" },
];

const TOP_HEROES = [
  { name: "Dr. J", weapon: "Super", price: "$5,100", parallel: "Superfoil", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771614296/boba-cards/tytmb7rxbhbv1gkpeqep.jpg" },
  { name: "The Kid", weapon: "Hex", price: "$4,000", parallel: "GGL Battlefoil", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771609041/boba-cards/f8lt0oi5ps3d5snqhhfu.jpg" },
  { name: "Bojax", weapon: "Hex", price: "$3,553", parallel: "80's Rad", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613174/boba-cards/bc1duifr3di2mzrlt9tm.jpg" },
  { name: "Joystick", weapon: "Super", price: "$3,000", parallel: "Superfoil", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771614360/boba-cards/h5fqakfugosnycepstyo.jpg" },
  { name: "Gigante", weapon: "Super", price: "$2,550", parallel: "Superfoil", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771614374/boba-cards/t1y3hknyavepydcv0ast.jpg" },
  { name: "Bojax", weapon: "Steel", price: "$2,000", parallel: "GL Battlefoil", img: "https://storage.googleapis.com/cardeio-images/bo-jackson-battle-arena/cards/small/alphaedition-sets-linoleum380.webp" },
  { name: "Star-Bach", weapon: "Gum", price: "$1,895", parallel: "Inspired Ink", img: "https://storage.googleapis.com/cardeio-images/bo-jackson-battle-arena/cards/small/alphaedition-autos-only-setorder190.webp" },
  { name: "Butterfly Sting", weapon: "Brawl", price: "$1,400", parallel: "Power Glove", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613057/boba-cards/y7xnik4ycvvksskdg5jt.jpg" },
];

const TOP_PLAYS = [
  { name: "Roster Cuts", type: "PL", price: "$55", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613167/boba-cards/rakzwdb3oiyc5uqbmyib.jpg" },
  { name: "Rich Get Richer", type: "PL", price: "$35", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613097/boba-cards/xprph3bswkn9qmtxdwjj.jpg" },
  { name: "Sacrifice & Scheme", type: "PL", price: "$30", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613151/boba-cards/lkhbny1ko1jf1alpkq1a.jpg" },
  { name: "Grilled Bandit", type: "PL", price: "$25", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613091/boba-cards/rb4cpkgvcbpnacdkjtvx.jpg" },
  { name: "Protein Bar", type: "PL", price: "$16", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613124/boba-cards/oiko7dhpbpls7kshwrke.jpg" },
  { name: "Free Booster", type: "PL", price: "$10", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771613094/boba-cards/n50abxb4fa4yc4w1dwyb.jpg" },
];

const BONUS_PLAYS = [
  { name: "Cheap Draw", type: "BPL", price: "$700", img: "https://storage.googleapis.com/cardeio-images/bo-jackson-battle-arena/cards/small/alphaedition-bonusplays25.webp" },
  { name: "Drought", type: "BPL", price: "$350", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771605091/boba-cards/ygnbqtouclwzajpasas7.jpg" },
  { name: "Plays Or Dogs?", type: "BPL", price: "$350", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771605100/boba-cards/zcc6923giu3zjnyliqdj.jpg" },
  { name: "Hot Dog Thief", type: "BPL", price: "$325", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771605079/boba-cards/eljxhggrb61zwafjojqt.jpg" },
];

const BLAST_PLAYS = [
  { name: "1-4-1 Play", cn: "HTD-16", set: "Alpha Blast" },
  { name: "3rd Time Charm", cn: "HTD-4", set: "Alpha Blast" },
  { name: "Adding Depth", cn: "HTD-17", set: "Alpha Blast" },
  { name: "Blind Substitution", cn: "HTD-40", set: "Alpha Blast" },
  { name: "Brothers In Arms", cn: "HTD-48", set: "Alpha Blast" },
  { name: "Deep Discount", cn: "HTD-35", set: "Alpha Blast" },
];

const HOT_DOGS = [
  { name: "Wurst Wayne", price: "$2.50", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771610669/boba-cards/envh9gxtjvbrlbyebmoc.jpg" },
  { name: "Mario Marinara", price: "$1.99", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771610663/boba-cards/hlcokeoxc0hmfzqmlgh4.jpg" },
  { name: "Mustard Man", price: "$1.99", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771610670/boba-cards/hg0wzbchjt2lersbua4b.jpg" },
  { name: "Brawler", price: "$1.75", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771610649/boba-cards/dmv4errgyutqnsqflohg.jpg" },
  { name: "King Ketchup", price: "$1.50", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771610639/boba-cards/bs9w9lnsi200hz9o99sh.jpg" },
  { name: "Vincent Van Dough", price: "$1.50", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771610628/boba-cards/evxnpznh2mwsxuiegieg.jpg" },
];

const PAPER_CARDS = [
  { name: "Rook", price: "$319", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771601118/boba-cards/pbweqisdzyyhxhbk31jb.jpg" },
  { name: "Showtime", price: "$176", img: "https://storage.googleapis.com/cardeio-images/bo-jackson-battle-arena/cards/small/alphaedition-sets-basepaper1.webp" },
  { name: "Cruze-Control", price: "$171", img: "https://storage.googleapis.com/cardeio-images/bo-jackson-battle-arena/cards/small/alphaedition-sets-basepaper35.webp" },
  { name: "Wild Bill", price: "$166", img: "https://res.cloudinary.com/dw64l2yyw/image/upload/v1771600958/boba-cards/jihktzcvjrvcab4etr60.jpg" },
];

const WEAPON_COLOR_MAP: Record<string, string> = {
  Fire: "text-fire", Ice: "text-ice", Steel: "text-steel", Glow: "text-glow",
  Hex: "text-hex", Brawl: "text-brawl", Gum: "text-gum", Super: "text-super",
};

const WEAPON_BORDER_MAP: Record<string, string> = {
  Fire: "border-fire/50", Ice: "border-ice/50", Steel: "border-steel/50", Glow: "border-glow/50",
  Hex: "border-hex/50", Brawl: "border-brawl/50", Gum: "border-gum/50", Super: "border-super/50",
};

function CardImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
      unoptimized
    />
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-boba-dark" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(209,73,61,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(121,245,40,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(226,49,103,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark/50 via-transparent to-boba-dark" />
        <div className="absolute top-0 left-0 right-0 h-1 gradient-hex-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hex/50 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-boba bg-gradient-to-br from-hex via-boba-red to-super flex items-center justify-center shadow-lg shadow-hex/30">
                  <span className="text-white font-display font-black text-3xl leading-none">B</span>
                </div>
                <div>
                  <h2 className="text-base font-display text-white/70 uppercase tracking-[0.3em]">The Trading Platform For</h2>
                  <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                    Bo Jackson Battle Arena™ <span className="text-gradient-hex-glow">Cards</span>
                  </h1>
                </div>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-black text-white leading-[0.9] mb-6">
                Buy & Sell<br />
                <span className="text-gradient-hex-glow">Bo Jackson</span><br />
                <span className="text-gradient-hex-glow">Battle Arena</span>™ Cards
              </h1>
              <p className="text-xl text-white/70 mb-10 max-w-lg font-body leading-relaxed">
                The #1 independent marketplace for Bo Jackson Battle Arena™ trading cards.
                Browse 17,236 cards across every set, parallel, and weapon type.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Link href="/browse" className="btn-primary text-xl px-10 py-3.5">
                  Browse All Cards →
                </Link>
                <Link href="/dashboard/sell/onboard" className="btn-secondary text-xl px-10 py-3.5">
                  Start Selling
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-base text-white/40 font-display uppercase tracking-wider">
                <span className="flex items-center gap-2"><span className="text-hex text-lg">●</span> 17,236 Cards</span>
                <span className="flex items-center gap-2"><span className="text-glow text-lg">●</span> 9 Sets</span>
                <span className="flex items-center gap-2"><span className="text-ice text-lg">●</span> Free Listings</span>
                <span className="flex items-center gap-2"><span className="text-super text-lg">●</span> 8% Fee</span>
              </div>

              {/* eBay import CTA */}
              <div className="mt-4">
                <Link
                  href="/dashboard/sell/import-ebay"
                  className="inline-flex items-center gap-2 text-base text-hex/70 hover:text-hex transition-colors font-display"
                >
                  📥 Already selling on eBay? <span className="underline">Import your listings in seconds →</span>
                </Link>
              </div>
            </div>

            {/* Hero card images */}
            <div className="hidden md:flex flex-shrink-0 gap-3 -rotate-3">
              <div className="space-y-3">
                <div className="relative w-40 h-56 rounded-boba overflow-hidden border-2 border-super/50 shadow-weapon-super">
                  <CardImage src={TOP_HEROES[0].img} alt={TOP_HEROES[0].name} />
                </div>
                <div className="relative w-40 h-56 rounded-boba overflow-hidden border-2 border-hex/50 shadow-weapon-hex">
                  <CardImage src={TOP_HEROES[1].img} alt={TOP_HEROES[1].name} />
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <div className="relative w-40 h-56 rounded-boba overflow-hidden border-2 border-glow/50 shadow-weapon-glow">
                  <CardImage src={TOP_HEROES[4].img} alt={TOP_HEROES[4].name} />
                </div>
                <div className="relative w-40 h-56 rounded-boba overflow-hidden border-2 border-brawl/50 shadow-weapon-brawl">
                  <CardImage src={TOP_HEROES[7].img} alt={TOP_HEROES[7].name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Banner */}
      <StatsBanner />

      {/* Weapon divider */}
      <div className="flex h-2 overflow-hidden">
        {WEAPONS.slice(0, 8).map((w) => (
          <div key={w.name} className="flex-1" style={{ backgroundColor: w.color }} />
        ))}
      </div>

      {/* Top Heroes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-display font-black text-white mb-2">
          🏆 Top Heroes
        </h2>
        <p className="text-xl text-white/40 font-body mb-8">Highest recent sales across all sets</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOP_HEROES.map((card, i) => (
            <Link key={i} href={`/browse?q=${encodeURIComponent(card.name)}`}>
              <div className={`card border ${WEAPON_BORDER_MAP[card.weapon] || "border-white/10"} group cursor-pointer`}>
                <div className="relative aspect-[2.5/3.5] overflow-hidden bg-boba-panel">
                  <CardImage src={card.img} alt={card.name} className="group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-hex transition-colors">
                    {card.name}
                  </h3>
                  <p className={`text-sm font-display ${WEAPON_COLOR_MAP[card.weapon] || "text-white/40"}`}>
                    {card.weapon} · {card.parallel}
                  </p>
                  <p className="text-2xl font-display font-black text-super mt-2">{card.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/browse?card_type=Hero" className="btn-secondary text-base px-8 py-2">
            View All Heroes →
          </Link>
        </div>
      </section>

      {/* Plays Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-boba-panel/30 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-2">
            🃏 Plays (PL)
          </h2>
          <p className="text-xl text-white/40 font-body mb-8">Strategy cards that change the game</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOP_PLAYS.map((card, i) => (
              <Link key={i} href={`/browse?q=${encodeURIComponent(card.name)}`}>
                <div className="card border border-ice/30 group cursor-pointer">
                  <div className="relative aspect-[2.5/3.5] overflow-hidden bg-boba-panel">
                    <CardImage src={card.img} alt={card.name} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-base font-display font-bold text-white group-hover:text-ice transition-colors truncate">
                      {card.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="badge badge-ice text-xs">{card.type}</span>
                      <span className="text-lg font-display font-black text-super">{card.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/browse?card_type=Play" className="btn-secondary text-base px-8 py-2">
              View All Plays →
            </Link>
          </div>
        </div>
      </section>

      {/* Bonus Plays Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-display font-black text-white mb-2">
          ⚡ Bonus Plays (BPL)
        </h2>
        <p className="text-xl text-white/40 font-body mb-8">Rare plays with game-breaking abilities</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BONUS_PLAYS.map((card, i) => (
            <Link key={i} href={`/browse?q=${encodeURIComponent(card.name)}`}>
              <div className="card border border-glow/30 group cursor-pointer">
                <div className="relative aspect-[2.5/3.5] overflow-hidden bg-boba-panel">
                  <CardImage src={card.img} alt={card.name} className="group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-glow transition-colors">
                    {card.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="badge badge-glow text-xs">{card.type}</span>
                    <span className="text-2xl font-display font-black text-super">{card.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/browse?card_type=Bonus+Play" className="btn-secondary text-base px-8 py-2">
            View All Bonus Plays →
          </Link>
        </div>
      </section>

      {/* Blast Plays (HTD) Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-boba-panel/30 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-2">
            💥 Blast Plays (HTD)
          </h2>
          <p className="text-xl text-white/40 font-body mb-8">Exclusive plays from Blast Boxes · 60 cards in Alpha Blast</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BLAST_PLAYS.map((card, i) => (
              <Link key={i} href={`/browse?q=${encodeURIComponent(card.name)}`}>
                <div className="card border border-hex/30 group cursor-pointer">
                  <div className="relative aspect-[2.5/3.5] bg-gradient-to-br from-hex/20 via-boba-panel to-ice/20 overflow-hidden flex items-center justify-center">
                    <div className="text-center p-3">
                      <span className="text-3xl block mb-2">💥</span>
                      <span className="text-xs font-display text-hex uppercase tracking-wider">{card.cn}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-base font-display font-bold text-white group-hover:text-hex transition-colors truncate">
                      {card.name}
                    </h3>
                    <p className="text-xs text-white/30 font-display mt-1">{card.set}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/browse?q=HTD" className="btn-secondary text-base px-8 py-2">
              View All 60 Blast Plays →
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Dogs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-display font-black text-white mb-2">
          🌭 Hot Dogs
        </h2>
        <p className="text-xl text-white/40 font-body mb-8">The beloved mascot characters of the arena · 148 cards</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {HOT_DOGS.map((card, i) => (
            <Link key={i} href={`/browse?q=${encodeURIComponent(card.name)}`}>
              <div className="card border border-brawl/30 group cursor-pointer">
                <div className="relative aspect-[2.5/3.5] overflow-hidden bg-boba-panel">
                  <CardImage src={card.img} alt={card.name} className="group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-display font-bold text-white group-hover:text-brawl transition-colors truncate">
                    {card.name}
                  </h3>
                  <span className="text-lg font-display font-black text-super">{card.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/browse?parallel=Hotdog" className="btn-secondary text-base px-8 py-2">
            View All Hot Dogs →
          </Link>
        </div>
      </section>

      {/* Paper Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-boba-panel/30 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-2">
            📄 Paper
          </h2>
          <p className="text-xl text-white/40 font-body mb-8">The base set cards · 668 total across all sets</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PAPER_CARDS.map((card, i) => (
              <Link key={i} href={`/browse?q=${encodeURIComponent(card.name)}`}>
                <div className="card border border-steel/30 group cursor-pointer">
                  <div className="relative aspect-[2.5/3.5] overflow-hidden bg-boba-panel">
                    <CardImage src={card.img} alt={card.name} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-steel transition-colors">
                      {card.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="badge badge-steel text-xs">Paper</span>
                      <span className="text-2xl font-display font-black text-super">{card.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/browse?parallel=Paper" className="btn-secondary text-base px-8 py-2">
              View All Paper Cards →
            </Link>
          </div>
        </div>
      </section>

      {/* Championship Foil / World Champions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-display font-black text-white mb-2">
          🏅 World Champions
        </h2>
        <p className="text-xl text-white/40 font-body mb-8">Championship set · 103 elite cards</p>
        <div className="flex flex-col items-center">
          <div className="card border border-super/40 p-10 text-center max-w-lg w-full bg-gradient-to-br from-super/10 via-boba-gray to-super/5">
            <span className="text-6xl block mb-4">🏆</span>
            <h3 className="text-3xl font-display font-black text-super mb-2">World Champions Set</h3>
            <p className="text-white/40 font-body mb-6">103 championship-tier cards celebrating the ultimate BoBA competitors</p>
            <Link href="/browse?set_name=World+Champions" className="btn-primary text-base px-8 py-2.5">
              Browse World Champions →
            </Link>
          </div>
        </div>
      </section>

      {/* Blast (Alpha Blast Set) */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-boba-panel/30 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-2">
            💣 Alpha Blast
          </h2>
          <p className="text-xl text-white/40 font-body mb-8">1,385 cards · Blue, Orange, Pink, Silver, Green, Bubble Gum parallels</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Blue Blast", count: "183", color: "border-ice/50 bg-ice/10 text-ice", param: "Blue Blast" },
              { name: "Orange Blast", count: "181", color: "border-brawl/50 bg-brawl/10 text-brawl", param: "Orange Blast" },
              { name: "Pink Blast", count: "181", color: "border-gum/50 bg-gum/10 text-gum", param: "Pink Blast" },
              { name: "Silver Blast", count: "180", color: "border-steel/50 bg-steel/10 text-steel", param: "Silver Blast" },
              { name: "Green Blast", count: "180", color: "border-glow/50 bg-glow/10 text-glow", param: "Green Blast" },
              { name: "Bubble Gum Blast", count: "181", color: "border-hex/50 bg-hex/10 text-hex", param: "Bubble Gum Blast" },
            ].map((blast) => (
              <Link key={blast.name} href={`/browse?parallel=${encodeURIComponent(blast.param)}`}>
                <div className={`card p-5 text-center border ${blast.color} group cursor-pointer transition-all duration-300 hover:scale-105`}>
                  <span className="text-3xl block mb-2">💣</span>
                  <h3 className={`text-lg font-display font-bold ${blast.color.split(' ')[2]}`}>
                    {blast.name}
                  </h3>
                  <p className="text-sm text-white/40 font-display mt-1">{blast.count} cards</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/browse?set_name=Alpha+Blast" className="btn-secondary text-base px-8 py-2">
              View All Alpha Blast →
            </Link>
          </div>
        </div>
      </section>

      {/* Sealed Product Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-super/5 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-2">
            📦 Sealed Product
          </h2>
          <p className="text-xl text-white/40 font-body mb-8">Hobby Boxes, Booster Packs, Blast Boxes & more</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Alpha Edition Hobby Box", set: "Alpha Edition", type: "Hobby Box", icon: "📦", color: "border-fire/40", glow: "hover:shadow-weapon-fire" },
              { name: "Griffey Edition Hobby Box", set: "Griffey Edition", type: "Hobby Box", icon: "📦", color: "border-glow/40", glow: "hover:shadow-weapon-glow" },
              { name: "Alpha Update Hobby Box", set: "Alpha Update", type: "Hobby Box", icon: "📦", color: "border-hex/40", glow: "hover:shadow-weapon-hex" },
              { name: "Blast Box", set: "Alpha Blast", type: "Blast Box", icon: "💥", color: "border-super/40", glow: "hover:shadow-weapon-super" },
              { name: "Battle Trainer Kit", set: "Starter", type: "Starter Kit", icon: "🎮", color: "border-ice/40", glow: "hover:shadow-weapon-ice" },
              { name: "Griffey Edition Jumbo Pack", set: "Griffey Edition", type: "Jumbo Pack", icon: "🃏", color: "border-glow/40", glow: "hover:shadow-weapon-glow" },
              { name: "Alpha Edition Booster Pack", set: "Alpha Edition", type: "Booster Pack", icon: "🃏", color: "border-fire/40", glow: "hover:shadow-weapon-fire" },
              { name: "Big League Chew Promo Box", set: "Big League Chew", type: "Promo Box", icon: "🫧", color: "border-gum/40", glow: "hover:shadow-weapon-gum" },
            ].map((product, i) => (
              <Link key={i} href={`/browse?category=sealed&q=${encodeURIComponent(product.name)}`}>
                <div className={`card border ${product.color} ${product.glow} group cursor-pointer transition-all duration-300`}>
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 via-boba-panel to-white/5 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.icon}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-white/30 font-display uppercase tracking-wider mb-1">{product.set} · {product.type}</p>
                    <h3 className="text-base font-display font-bold text-white group-hover:text-super transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-sm font-display font-bold text-hex">List Yours →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/browse?category=sealed" className="btn-secondary text-base px-8 py-2">
              View All Sealed Product →
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Weapon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-display font-black text-white mb-8">
          ⚔️ Browse by Weapon
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {WEAPONS.map((w) => (
            <Link
              key={w.name}
              href={`/browse?weapon=${encodeURIComponent(w.name)}`}
              className={`card p-5 text-center ${w.glow} border border-white/10 transition-all duration-300`}
            >
              <span className="text-4xl block mb-2">{w.icon}</span>
              <h3 className="text-xl font-display font-bold" style={{ color: w.color }}>
                {w.name}
              </h3>
              <p className="text-sm text-white/40 font-display">{w.count} cards</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Set */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-boba-panel/30 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-8">
            📦 Browse by Set
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {SETS.map((set) => (
              <Link
                key={set.name}
                href={`/browse?set_name=${encodeURIComponent(set.name)}`}
                className={`card p-6 group bg-gradient-to-r ${set.color}`}
              >
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-hex transition-colors">
                  {set.name}
                </h3>
                <p className="text-base text-white/40 font-display mt-1">{set.count} cards</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Parallels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-display font-black text-white mb-2">✨ Parallels</h2>
        <p className="text-xl text-white/40 font-body mb-8">Browse by rarity and treatment</p>
        <div className="flex flex-wrap gap-3">
          {[
            "Paper", "Battlefoil", "Superfoil (1/1)", "Bubble Gum Battlefoil",
            "80's Rad Battlefoil", "Blizzard Battlefoil", "Grandma's Linoleum Battlefoil",
            "Great Grandma's Linoleum Battlefoil", "Headliner Battlefoil", "Pink Battlefoil",
            "Green Battlefoil", "Orange Battlefoil", "Blue Battlefoil", "Silver Battlefoil",
            "Foil Stamp (Serialized)", "Battlefoil (Serialized)",
            "Inspired Ink Battlefoil", "Inspired Ink Superfoil (1/1)",
            "Inspired Ink Bubble Gum Battlefoil", "Sandstorm Battlefoil",
            "Power Glove Battlefoil", "Kanji Battlefoil", "Logofoil",
            "Miami Ice Battlefoil", "Mixtape Battlefoil", "Colosseum Battlefoil",
            "Slime Battlefoil", "Icon Battlefoil", "Promo", "Sidekick",
          ].map((p) => (
            <Link
              key={p}
              href={`/browse?parallel=${encodeURIComponent(p)}`}
              className="bg-white/5 text-white/60 hover:bg-hex/20 hover:text-hex border border-white/10 hover:border-hex/30 transition-all cursor-pointer px-5 py-2.5 rounded-full font-display text-base uppercase tracking-wider font-semibold"
            >
              {p}
            </Link>
          ))}
        </div>
      </section>

      {/* Card Types */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-boba-dark via-boba-panel/30 to-boba-dark" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white mb-8">
            🎯 Card Types
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { name: "Heroes", desc: "10,000+ fighters", icon: "⚔️", color: "border-fire/50 hover:shadow-weapon-fire", param: "" },
              { name: "Plays", desc: "330 strategy cards", icon: "🃏", color: "border-ice/50 hover:shadow-weapon-ice", param: "PL" },
              { name: "Bonus Plays", desc: "75 game-changers", icon: "⚡", color: "border-glow/50 hover:shadow-weapon-glow", param: "BPL" },
              { name: "Blast Plays", desc: "60 Blast exclusives", icon: "💥", color: "border-hex/50 hover:shadow-weapon-hex", param: "HTD" },
              { name: "Hot Dogs", desc: "148 mascots", icon: "🌭", color: "border-brawl/50 hover:shadow-weapon-brawl", param: "HD" },
            ].map((type) => (
              <Link
                key={type.name}
                href={`/browse?q=${type.param}`}
                className={`card p-6 text-center border ${type.color} transition-all duration-300`}
              >
                <span className="text-4xl block mb-3">{type.icon}</span>
                <h3 className="text-xl font-display font-bold text-white">{type.name}</h3>
                <p className="text-sm text-white/40 font-display mt-1">{type.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-display font-black text-white text-center mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "🔍", title: "Find Cards", desc: "Search 17,236 BoBA cards. Filter by set, weapon, parallel, and price.", color: "hex" },
              { icon: "🛒", title: "Buy Instantly", desc: "Secure checkout powered by Stripe. Payment protected until delivery confirmed.", color: "glow" },
              { icon: "💰", title: "Sell Your Cards", desc: "List for free. Only 8% + $0.25 when you sell. Paid directly to your bank account.", color: "super" },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className={`w-24 h-24 rounded-full bg-${step.color}/10 border-2 border-${step.color}/30 flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-5xl">{step.icon}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/40 text-base font-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hex/10 via-boba-dark to-glow/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hex/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-5">
            Ready to <span className="text-gradient-hex-glow">Battle</span>?
          </h2>
          <p className="text-white/40 mb-10 text-xl font-body">
            Buy and sell Bo Jackson Battle Arena™ cards. Free to sign up, free to list.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/browse" className="btn-secondary text-xl px-10 py-3.5">
              Browse Cards
            </Link>
            <Link href="/auth" className="btn-primary text-xl px-10 py-3.5">
              Sign Up Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
