import { useState, useEffect } from "react";
import { api } from "../api";

function OrderStatus({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  // The webhook can arrive a moment after the redirect, so check a few times
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function check() {
      try {
        const data = await api(`/api/orders/${orderId}`);
        if (cancelled) return;
        setOrder(data);
        if (data.status !== "paid") {
          attempts += 1;
          if (attempts < 6) {
            setTimeout(check, 2000); // try again in 2 seconds
          } else {
            setTimedOut(true);
          }
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err.status === 401
            ? "Please sign in to see your order."
            : err.message
        );
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const money = (pence) =>
    `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-5"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-[10px] bg-white p-8 text-ink">
        {error && <p className="font-semibold text-red-600">{error}</p>}

        {!error && !order && <p>Checking your order...</p>}

        {order && order.status === "paid" && (
          <>
            <h2 className="mb-2 text-2xl font-extrabold text-lagoon">
              Payment successful
            </h2>
            <p className="mb-4 text-muted">Thank you! Your order is confirmed.</p>
          </>
        )}

        {order && order.status !== "paid" && !timedOut && (
          <>
            <h2 className="mb-2 text-2xl font-extrabold">Confirming your payment...</h2>
            <p className="mb-4 text-muted">This usually takes a few seconds.</p>
          </>
        )}

        {order && order.status !== "paid" && timedOut && (
          <>
            <h2 className="mb-2 text-2xl font-extrabold">Payment still pending</h2>
            <p className="mb-4 text-muted">
              We haven't received confirmation yet. Refresh in a moment, or contact
              us if the problem continues.
            </p>
          </>
        )}

        {order && (
          <div className="mb-4 rounded-lg bg-mist p-4 text-sm">
            <p className="mb-2 font-semibold">
              Order #{order.id} ·{" "}
              <span className={order.status === "paid" ? "text-lagoon" : "text-muted"}>
                {order.status}
              </span>
            </p>
            {order.items.map((item) => (
              <p key={item.title}>
                {item.title} × {item.quantity}
              </p>
            ))}
            <p className="mt-2 font-semibold">Total: {money(order.total_amount)}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-sun px-6 py-3 font-semibold text-deep hover:bg-[#ffc933]"
        >
          Back to the site
        </button>
      </div>
    </div>
  );
}

export default OrderStatus;
