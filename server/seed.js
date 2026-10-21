import { pool } from "./db.js";

const tours = [
  {
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

await pool.query("TRUNCATE tours RESTART IDENTITY");

for (const t of tours) {
  await pool.query(
    `INSERT INTO tours (title, region, duration, price, image, image_alt, features)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [t.title, t.region, t.duration, t.price, t.image, t.imageAlt, t.features]
  );
}

console.log("Seeded", tours.length, "tours");
await pool.end();