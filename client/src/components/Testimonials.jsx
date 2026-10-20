import { testimonials } from "../data/siteData";

function Testimonials() {
  return (
    <section id="testimonials" className="bg-mist py-14 sm:py-24">
      <div className="mx-auto w-full max-w-[1120px] px-5">
        <h2 className="mb-10 text-3xl font-extrabold sm:text-4xl">
          What our travelers say
        </h2>

        <div className="flex flex-col gap-7 lg:flex-row">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-[10px] bg-white p-7 lg:flex-1"
            >
              <p
                className="mb-3 tracking-widest text-[#e69b00]"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </p>

              <blockquote className="mb-6 flex-1 text-[1.05rem]">
                {t.quote}
              </blockquote>

              <figcaption className="flex flex-wrap items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-full bg-lagoon font-semibold text-white"
                >
                  {t.initials}
                </span>
                <span className="flex flex-1 flex-col text-sm leading-snug text-muted">
                  <strong className="text-ink">{t.name}</strong>
                  {t.trip}
                </span>
                <span className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-muted">
                  {t.source}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;