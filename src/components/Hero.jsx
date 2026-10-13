function Hero() {
  return (
    <section id="home" className="relative grid min-h-[78vh] items-center bg-deep text-white">
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-deep/70" />

      <div className="relative mx-auto w-full max-w-[1120px] px-5 py-20">
        <h1 className="max-w-[16ch] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Visit the places you've always dreamed of
        </h1>
        <p className="mb-8 mt-4 max-w-[46ch] text-lg text-[#e1eef1] sm:text-xl">
          Small-group trips and private tours, planned by people who have been there.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#plan"
            className="rounded-full bg-sun px-6 py-3 font-semibold text-deep hover:bg-[#ffc933]"
          >
            Plan A Trip
          </a>
          <a
            href="#packages"
            className="rounded-full border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-deep"
          >
            Explore Gallery
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;

