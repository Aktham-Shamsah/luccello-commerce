"use client";

import { useState, type FormEvent } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok)
        throw new Error(
          response.status === 429 ? "محاولات كثيرة، حاولي لاحقاً" : "تعذر تسجيل الدخول",
        );
      window.location.assign("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر تسجيل الدخول");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "12vh auto",
        padding: 32,
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <h1>دخول إدارة LU&apos;CHÉLO</h1>
      <p>أدخلي كلمة مرور إدارة المتجر.</p>
      <form onSubmit={submit}>
        <input
          aria-label="كلمة المرور"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={16}
          style={{ width: "100%", padding: 14, marginBottom: 12 }}
        />
        {error ? <p role="alert">{error}</p> : null}
        <button className="admin-btn" disabled={busy} type="submit">
          {busy ? "جاري التحقق..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
