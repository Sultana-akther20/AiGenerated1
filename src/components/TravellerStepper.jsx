function TravellerStepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Remove one traveler"
        className="h-9 w-9 rounded-full border border-line text-lg font-semibold hover:bg-mist"
      >
        −
      </button>
      <span className="w-6 text-center font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        aria-label="Add one traveler"
        className="h-9 w-9 rounded-full border border-line text-lg font-semibold hover:bg-mist"
      >
        +
      </button>
    </div>
  );
}

export default TravellerStepper;