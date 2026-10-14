import { useState } from "react";
import { tours } from "../data/siteData";
import TourCard from "./TourCard";

const regions = ["All", "Asia", "Europe"];

function TourGrid() {
  const [selectedRegion, setSelectedRegion] = useState("All");

  const visibleTours =
    selectedRegion === "All"
      ? tours
      : tours.filter((tour) => tour.region === selectedRegion);

  return (
    <section id="packages" className="py-14 sm:py-24">
      <div className="mx-auto w-full max-w-[1120px] px-5">
        <h2 className="mb-2 text-3xl font-extrabold sm:text-4xl">
          Our best travel packages
        </h2>
        <p className="mb-8 text-muted">
          Flights, stays, and local guides are included in every package.
        </p>

        <div className="mb-8 flex flex-wrap gap-3">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              aria-pressed={selectedRegion === region}
              className={`rounded-full border-2 px-5 py-2 font-semibold ${
                selectedRegion === region
                  ? "border-deep bg-deep text-white"
                  : "border-line bg-white text-ink hover:bg-mist"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {visibleTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TourGrid;