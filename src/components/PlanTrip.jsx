import { useState } from "react";
import { stats } from "../data/siteData";

const fieldClass =
  "w-full rounded-lg border-[1.5px] border-[#b7cbd0] bg-white px-3 py-2.5 text-ink focus:border-lagoon focus:outline-3 focus:outline-lagoon/25";
const labelClass = "mb-1 mt-4 block text-[0.95rem] font-semibold";

function PlanTrip() {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("Thank you! We will send your custom itinerary within two working days.");
    event.target.reset();
  }

  return (
    <section id="plan" className="bg-deep py-14 text-white sm:py-24">
      <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="mb-2 text-3xl font-extrabold sm:text-4xl">
            Tell us where you want to go
          </h2>
          <p className="max-w-[44ch] text-[#cfe3e8]">
            Share a few details and we will send a custom itinerary and price
            within two working days.
          </p>

          <dl className="mt-8 flex flex-wrap gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-head text-4xl font-extrabold text-sun">
                  {stat.value}
                </dt>
                <dd className="text-[#cfe3e8]">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] bg-white p-8 text-ink"
        >
          <h3 className="mb-2 text-xl font-semibold">Get a custom quote</h3>

          <label htmlFor="name" className={labelClass}>Full name</label>
          <input id="name" name="name" type="text" autoComplete="name" required className={fieldClass} />

          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" placeholder="your.email@example.com" autoComplete="email" required className={fieldClass} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
            <div>
              <label htmlFor="destination" className={labelClass}>Destination</label>
              <select id="destination" name="destination" required className={fieldClass}>
                <option value="">Choose one</option>
                <option>Bali</option>
                <option>Lisbon and Porto</option>
                <option>Kyoto and Tokyo</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="travelers" className={labelClass}>Travelers</label>
              <input id="travelers" name="travelers" type="number" min="1" max="20" defaultValue="1" required className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="dates" className={labelClass}>Travel dates</label>
              <input id="dates" name="dates" type="text" placeholder="e.g. 01-05-2026 to 14-05-2026" required className={fieldClass} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-sun px-6 py-3 font-semibold text-deep hover:bg-[#ffc933]"
          >
            Submit
          </button>

          <p role="status" aria-live="polite" className="mt-4 min-h-6 font-semibold text-lagoon">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

export default PlanTrip;