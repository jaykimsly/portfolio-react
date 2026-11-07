import { GlassCard } from "./ui/GameUI";
import { content, otherPortfolios, portfolio } from "../content/content";
import { telHref, whatsAppHref } from "../content/types";

const linkClass =
  "inline-block rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300 transition-colors focus-visible:outline-2 focus-visible:outline-amber-400";

export function ContactPanel() {
  const { person, phones, hub } = content;

  return (
    <section aria-labelledby="contact-title" className="mt-14 grid gap-4 md:grid-cols-2">
      <GlassCard className="p-6" glow="#F59E0B" accentColor="#F59E0B">
        <p className="text-amber-400 font-mono text-xs font-medium mb-2 tracking-widest uppercase">
          {portfolio.audience}
        </p>
        <h2 id="contact-title" className="text-2xl font-black text-white mb-2">
          Hire {person.shortName}
        </h2>
        <p className="text-zinc-400 text-sm mb-5">{portfolio.pitch}</p>
        <ul className="space-y-4">
          {phones.map((phone) => (
            <li key={phone.number} className="flex flex-wrap items-center gap-3">
              <span className="text-white text-lg font-mono min-w-44">{phone.display}</span>
              {phone.calls && (
                <a className={linkClass} href={telHref(phone)}>
                  Call<span className="sr-only"> {phone.display}</span>
                </a>
              )}
              {phone.whatsapp && (
                <a className={linkClass} href={whatsAppHref(phone)} target="_blank" rel="noopener noreferrer">
                  WhatsApp<span className="sr-only"> {phone.display}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="text-zinc-500 text-sm mt-5">{person.location}</p>
      </GlassCard>

      <GlassCard className="p-6" glow="#3B82F6" accentColor="#3B82F6">
        <h2 className="text-2xl font-black text-white mb-2">{hub.title}</h2>
        <p className="text-zinc-400 text-sm mb-5">{hub.text}</p>
        <ul className="space-y-3">
          {otherPortfolios.map((other) => (
            <li key={other.id} className="flex items-center justify-between gap-3">
              <span className="text-white text-sm">
                {other.title} <span className="text-zinc-500">· {other.framework}</span>
              </span>
              {other.status === "live" ? (
                <a className="text-sm font-semibold text-blue-300 hover:text-blue-200 underline" href={other.url}>
                  Open<span className="sr-only"> the {other.title} portfolio</span>
                </a>
              ) : (
                <span className="text-zinc-500 text-sm">Coming soon</span>
              )}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 mt-6">
          <a className={linkClass} href={person.siteUrl}>Full profile</a>
          <a className={linkClass} href={hub.url}>All portfolios</a>
        </div>
      </GlassCard>
    </section>
  );
}
