import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-40">
          {/* Background Mesh/Gradient Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-black to-zinc-900" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-6">
            REAL ESTATE <br />
            <span className="text-red-600">REDEFINED</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Leading Islamabad-based agency for Industrial, Commercial, and Residential properties. Exclusively handling CDA projects.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/listings" className="w-full md:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-xl shadow-red-900/20">
              Browse Properties
            </Link>
            <Link href="/contact" className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all">
              Consult an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Our Expertise</h2>
              <p className="text-zinc-500 mt-2">Tailored solutions for Islamabad's real estate market.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Industrial Rentals"
              desc="I-9, I-10, Rawat, and Humak specialized industrial listings."
              link="/rent/industrial"
            />
            <ServiceCard
              title="Commercial Leasing"
              desc="Premium commercial spaces in F-6, F-8, and CDA sectors."
              link="/rent/commercial"
            />
            <ServiceCard
              title="Residential Services"
              desc="Luxury residential rentals and leasing across Islamabad."
              link="/rent/residential"
            />
          </div>
        </div>
      </section>

      {/* Sales Rule Highlight */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Exclusive Sales
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            We exclusively handle <span className="text-red-600">Commercial Projects</span> in CDA Sectors.
          </h2>
          <p className="text-zinc-500 leading-relaxed">
            Square21 Marketing maintains a focused approach to sales, prioritizing high-value commercial investments in Islamabad's prime sectors.
          </p>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ title, desc, link }: { title: string; desc: string; link: string }) {
  return (
    <div className="p-8 border border-zinc-100 rounded-2xl hover:border-red-600 transition-all group hover:shadow-2xl hover:shadow-zinc-100">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{desc}</p>
      <Link href={link} className="text-red-600 font-bold text-sm flex items-center group-hover:translate-x-2 transition-transform">
        Explore Category <span className="ml-2">→</span>
      </Link>
    </div>
  );
}
