"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="landing-page">
      <h1>Something went wrong.</h1>
      <button className="button" onClick={reset}>Try again</button>
    </main>
  );
}
