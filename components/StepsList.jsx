"use client";

export default function StepsList({ steps, lang = "en" }) {
  if (!steps || steps.length === 0) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(steps.join("\n"));
      alert(lang === "ka" ? "ნაბიჯები დაკოპირდა" : "Steps copied to clipboard");
    } catch {}
  }

  return (
    <div className="rounded-xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">{lang === "ka" ? "ნაბიჯები" : "Steps"}</h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-md border text-sm bg-gray-50 hover:bg-gray-100"
        >
          {lang === "ka" ? "ნაბიჯების კოპირება" : "Copy Steps"}
        </button>
      </div>
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="text-gray-800">
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
