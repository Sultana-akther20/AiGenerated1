import { useState, useEffect } from "react";
import { api } from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TourGrid from "./components/TourGrid";
import Testimonials from "./components/Testimonials";
import PlanTrip from "./components/PlanTrip";
import Footer from "./components/Footer";
import AuthForm from "./components/AuthForm";
import OrderStatus from "./components/OrderStatus";

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // Stripe sends people back to /?order=ID after paying, or /?canceled=1 if they cancel
  const params = new URLSearchParams(window.location.search);
  const [orderId, setOrderId] = useState(params.get("order"));
  const [canceled, setCanceled] = useState(params.get("canceled") === "1");

  useEffect(() => {
    api("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  async function handleSignOut() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  function closeNotice() {
    window.history.replaceState({}, "", "/"); // clear ?order=... from the address bar
    setOrderId(null);
    setCanceled(false);
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
        <TourGrid user={user} onSignInClick={() => setShowAuth(true)} />
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

      {orderId && <OrderStatus orderId={orderId} onClose={closeNotice} />}

      {canceled && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md rounded-[10px] bg-white p-8 text-ink">
            <h2 className="mb-2 text-2xl font-extrabold">Payment cancelled</h2>
            <p className="mb-4 text-muted">
              No money was taken. You can try again any time.
            </p>
            <button
              type="button"
              onClick={closeNotice}
              className="w-full rounded-full bg-sun px-6 py-3 font-semibold text-deep hover:bg-[#ffc933]"
            >
              Back to the site
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
