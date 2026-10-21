import { useState } from "react";
import { api } from "../api";

function AuthForm({ onSuccess, onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await api(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border-[1.5px] border-[#b7cbd0] bg-white px-3 py-2.5 text-ink focus:border-lagoon focus:outline-3 focus:outline-lagoon/25";

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-5"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[10px] bg-white p-8 text-ink"
      >
        <h2 className="mb-4 text-xl font-semibold">
          {mode === "login" ? "Sign in" : "Create account"}
        </h2>

        <label htmlFor="auth-email" className="mb-1 block font-semibold">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />

        <label htmlFor="auth-password" className="mb-1 mt-4 block font-semibold">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />

        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-sun px-6 py-3 font-semibold text-deep hover:bg-[#ffc933] disabled:opacity-60"
        >
          {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-4 text-sm text-lagoon underline"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 block text-sm text-muted underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AuthForm;