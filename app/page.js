"use client";
import Calculator from "../components/Calculator";
import ResultCard from "../components/ResultCard";
import StepsList from "../components/StepsList";
import PeriodicTable from "../components/PeriodicTable";
import { useEffect, useState } from "react";
import { t } from "../lib/i18n";

export default function HomePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [lastQuery, setLastQuery] = useState("");

  async function handleSolve(inputText) {
    try {
      setLoading(true);
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputText, lang }),
      });
      const data = await res.json();
      setResult(data);
      setLastQuery(inputText);
    } catch (e) {
      setResult({ finalAnswer: "Error", steps: ["Something went wrong"] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lastQuery) {
      // Recompute result in the newly selected language
      handleSolve(lastQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <main className="min-h-screen">
      <header className="w-full border-b sticky top-0 bg-white/80 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{t(lang, "appTitle")}</h1>
            <select
              className="border rounded-md p-1 text-sm"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ka">ქართული</option>
            </select>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 space-y-6">
          <div className="rounded-xl shadow-sm border p-4">
            <Calculator onSolve={handleSolve} loading={loading} lang={lang} />
          </div>

          {result && (
            <div className="space-y-4">
              <ResultCard finalAnswer={result.finalAnswer} lang={lang} />
              <StepsList steps={result.steps || []} lang={lang} />
            </div>
          )}
        </section>

        <aside className="lg:col-span-1">
          <PeriodicTable lang={lang} />
        </aside>
      </div>
    </main>
  );
}
