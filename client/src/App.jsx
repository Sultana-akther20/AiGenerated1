import { useState, useEffect } from "react";
import { api } from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TourGrid from "./components/TourGrid";
import Testimonials from "./components/Testimonials";
import PlanTrip from "./components/PlanTrip";
import Footer from "./components/Footer";
import AuthForm from "./components/AuthForm";

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // On page load, ask the server who is logged in (this is why a refresh keeps you signed in)
  useEffect(() => {
    api("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  async function handleSignOut() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <>
      <Header
        user={user}
        onSignInClick={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />
      <main>
        <Hero />
        <TourGrid />
        <Testimonials />
        <PlanTrip />
      </main>
      <Footer />

      {showAuth && (
        <AuthForm
          onSuccess={(u) => {
            setUser(u);
            setShowAuth(false);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </>
  );
}

export default App;