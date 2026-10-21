import { useState, useEffect } from "react";
import { api } from "../api";
import TourCard from "./TourCard";

const regions = ["All", "Asia", "Europe"];

function TourGrid() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    api("/api/tours")
      .then(setTours)
      .catch(() => setError("Could not load tours. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

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

        {loading && <p className="text-muted">Loading tours...</p>}
        {error && <p className="font-semibold text-red-600">{error}</p>}

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