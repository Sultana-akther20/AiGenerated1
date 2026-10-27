import { useState } from "react";
import { api } from "../api";
import TravellerStepper from "./TravellerStepper";

function TourCard({ tour, user, onSignInClick }) {
  const [travellers, setTravellers] = useState(1);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setError("");

    // Not signed in: open the sign-in form instead
    if (!user) {
      onSignInClick();
      return;
    }

    setBuying(true);
    try {
      // We send only WHICH tour and HOW MANY people. The price is looked up on the server.
      const { url } = await api("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ tourId: tour.id, travellers }),
      });
      window.location.href = url; // go to Stripe's hosted checkout page
    } catch (err) {
      if (err.status === 401) {
        onSignInClick();
      } else {
        setError(err.message);
      }
      setBuying(false);
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-white">
      <img
        src={tour.image}
        alt={tour.image_alt}
        className="h-[180px] w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3.5 self-start rounded-full bg-mist px-3 py-0.5 text-sm font-semibold text-lagoon">
          {tour.duration}
        </span>

        <h3 className="mb-2 text-xl font-semibold">{tour.title}</h3>

        <ul className="mb-6 flex-1">
          {tour.features.map((feature) => (
            <li key={feature} className="mb-2 flex items-start gap-2.5 text-muted">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-lagoon" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mb-4 flex items-center justify-between rounded-lg bg-mist px-3 py-2">
          <TravellerStepper value={travellers} onChange={setTravellers} />
          <p className="text-sm text-muted">
            Total{" "}
            <strong className="text-ink">
              £{(tour.price * travellers).toLocaleString("en-GB")}
            </strong>
          </p>
        </div>

        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <p className="font-head text-2xl font-extrabold">
            <span className="font-body text-sm font-medium text-muted">From </span>
            £{tour.price.toLocaleString("en-GB")}
          </p>
          <a href="#plan" className="font-semibold text-lagoon underline">
            View Details
          </a>
        </div>

        <button
          type="button"
          onClick={handleBuy}
          disabled={buying}
          className="mt-4 w-full rounded-full bg-sun px-6 py-3 font-semibold text-deep hover:bg-[#ffc933] disabled:opacity-60"
        >
          {buying ? "Redirecting to payment..." : "Buy now"}
        </button>

        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

export default TourCard;
