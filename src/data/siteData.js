export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Tour Packages", href: "#packages" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Plan A Trip", href: "#plan" },
];

export const tours = [
  {
    id: 1,
    title: "Bali Slow Escape",
    region: "Asia",
    duration: "7 days",
    price: 1290,
    image: "/images/bali.jpg",
    imageAlt: "Rice terraces in Bali",
    features: [
      "Ubud villa stay with breakfast",
      "Private temple and rice terrace tour",
      "Two beach days in Uluwatu",
    ],
  },
  {
    id: 2,
    title: "Lisbon and Porto",
    region: "Europe",
    duration: "5 days",
    price: 740,
    image: "/images/lisbon-porto.jpg",
    imageAlt: "Rooftops of Lisbon",
    features: [
      "Boutique hotels in old town",
      "Fado dinner and food walk",
      "Scenic train along the Douro",
    ],
  },
  {
    id: 3,
    title: "Kyoto to Tokyo",
    region: "Asia",
    duration: "10 days",
    price: 2150,
    image: "/images/kyoto.jpg",
    imageAlt: "Temple gate in Kyoto",
    features: [
      "Ryokan night with kaiseki dinner",
      "Bullet train rail pass included",
      "English-speaking city guides",
    ],
  },
];

export const testimonials = [
  {
    id: 1,
    rating: 5,
    quote: "Every day was planned, but never rushed. Our guide in Ubud knew the quiet spots.",
    initials: "AR",
    name: "Amira R.",
    trip: "Bali Slow Escape",
    source: "Tripadvisor",
  },
  {
    id: 2,
    rating: 5,
    quote: "They rebooked our Porto train within minutes when a strike hit. Stress-free from start to finish.",
    initials: "DK",
    name: "Daniel K.",
    trip: "Lisbon and Porto",
    source: "Google",
  },
  {
    id: 3,
    rating: 4,
    quote: "The ryokan night was the highlight of our year. I would have liked one more free afternoon.",
    initials: "SP",
    name: "Sofia P.",
    trip: "Kyoto to Tokyo",
    source: "Trustpilot",
  },
];

export const stats = [
  { value: "500+", label: "Destinations" },
  { value: "12k", label: "Happy travelers" },
  { value: "150+", label: "Expert guides" },
];