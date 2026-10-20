import Header from "./components/Header";
import Hero from "./components/Hero";
import TourGrid from "./components/TourGrid";
import Testimonials from "./components/Testimonials";
import PlanTrip from "./components/PlanTrip";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TourGrid />
        <Testimonials />
        <PlanTrip />   
      </main>
      <Footer />
    </>
  );
}

export default App;

