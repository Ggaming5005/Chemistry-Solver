"use client";
import { useState, useEffect, useId } from "react";
import OCRCapture from "./OCRCapture";

const mainButtons = [
  { label: "H₂O", insert: "H₂O" },
  { label: "→", insert: " → " },
  { label: "⇌", insert: " ⇌ " },
  { label: "+", insert: " + " },
  { label: "=", insert: " = " },
  { label: "Na⁺", insert: "Na⁺" },
  { label: "Cl⁻", insert: "Cl⁻" },
];

const subscriptDigits = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
const superscripts = [
  "⁰",
  "¹",
  "²",
  "³",
  "⁴",
  "⁵",
  "⁶",
  "⁷",
  "⁸",
  "⁹",
  "⁺",
  "⁻",
];
const extraSymbols = ["↓", "↑", "Δ", "°", "·", "⋅", "×", "⟶"]; // common chemistry symbols

export default function Calculator({ onSolve, loading, lang = "en" }) {
  const [input, setInput] = useState("");
  const [showMoreSymbols, setShowMoreSymbols] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  function handleInsert(text) {
    setInput((prev) => prev + text);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    onSolve(input.trim());
  }

  return (
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          className="w-full h-28 resize-y rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={
            lang === "ka"
              ? "ჩაწერეთ ამოცანა ან რეაქცია, напр. H2 + O2 -> H2O"
              : "Type a chemistry problem or equation, e.g. H2 + O2 -> H2O"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {mainButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              className="px-3 py-1.5 rounded-md border bg-gray-50 hover:bg-gray-100 text-sm"
              onClick={() => handleInsert(btn.insert)}
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border bg-gray-50 hover:bg-gray-100 text-sm"
            onClick={() => setShowMoreSymbols((v) => !v)}
          >
            {showMoreSymbols
              ? lang === "ka"
                ? "ნაკლები"
                : "Less"
              : lang === "ka"
              ? "მეტი"
              : "More"}
          </button>
        </div>
        {showMoreSymbols && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">
                {lang === "ka" ? "ქვედასაწერი" : "Subscripts"}
              </span>
              {subscriptDigits.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="px-2 py-1 rounded-md border bg-gray-50 hover:bg-gray-100 text-sm"
                  onClick={() => handleInsert(ch)}
                >
                  {ch}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">
                {lang === "ka" ? "ზედასაწერი" : "Superscripts"}
              </span>
              {superscripts.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="px-2 py-1 rounded-md border bg-gray-50 hover:bg-gray-100 text-sm"
                  onClick={() => handleInsert(ch)}
                >
                  {ch}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">
                {lang === "ka" ? "სიმბოლოები" : "Symbols"}
              </span>
              {extraSymbols.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="px-2 py-1 rounded-md border bg-gray-50 hover:bg-gray-100 text-sm"
                  onClick={() => handleInsert(ch)}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? lang === "ka"
                ? "ითვლება..."
                : "Solving..."
              : lang === "ka"
              ? "გადაწყვეტა"
              : "Solve"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md border"
            onClick={() => setInput("")}
          >
            {lang === "ka" ? "გასუფთავება" : "Clear"}
          </button>
        </div>
      </form>
      <div className="mt-2">
        <button
          type="button"
          className="px-3 py-1.5 rounded-md border bg-gray-50 hover:bg-gray-100 text-sm"
          onClick={() => setShowTemplates((v) => !v)}
        >
          {showTemplates
            ? lang === "ka"
              ? "ნიმუშების დამალვა"
              : "Hide templates"
            : lang === "ka"
            ? "ნიმუშები"
            : "Templates"}
        </button>
        {showTemplates && (
          <div className="mt-2 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
            <TemplateMetalWater
              onInsert={(m) => setInput(`2${m} + 2H2O -> 2${m}OH + H2`)}
            />
            <TemplateAcidBase
              onInsert={(a, b, salt) =>
                setInput(`${a} + ${b} -> ${salt} + H2O`)
              }
            />
            <TemplateMetalHalogen
              onInsert={(m, x) =>
                setInput(`2${m} + ${x} -> 2${m}${x.replace("2", "")}`)
              }
            />
          </div>
        )}
      </div>
      <OCRCapture
        lang={lang}
        onText={(text) => {
          // Append recognized text into the textarea with a space
          if (text) setInput((prev) => (prev ? prev + "\n" + text : text));
        }}
      />
      <p className="text-sm text-gray-500">
        {lang === "ka"
          ? "მაგალითები: 'Balance: H2 + O2 -> H2O', '10g NaOH + HCl → ? g NaCl'"
          : "Examples: 'Balance: H2 + O2 -> H2O', '10g NaOH + HCl → ? g NaCl'"}
      </p>
    </div>
  );
}

function TemplateCard({ title, hint, onPick, options }) {
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="font-medium text-sm mb-1">{title}</div>
      {options ? (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 text-sm"
              onClick={() => onPick(o)}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 text-sm"
          onClick={onPick}
        >
          Insert
        </button>
      )}
      <div className="text-xs text-gray-500 mt-2">{hint}</div>
    </div>
  );
}

function TemplateMetalWater({ onInsert }) {
  const metals = ["Li", "Na", "K", "Rb", "Cs", "Fr"];
  const [m, setM] = useState("Na");
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="font-medium text-sm mb-1">Metal + Water</div>
      <div className="flex gap-2 items-center mb-2">
        <SearchSelect
          label="Metal"
          options={metals}
          value={m}
          onChange={setM}
        />
        <button
          type="button"
          className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 text-sm"
          onClick={() => onInsert(m)}
        >
          Insert
        </button>
      </div>
      <div className="text-xs text-gray-500">2M + 2H2O → 2MOH + H2</div>
    </div>
  );
}

function TemplateMetalHalogen({ onInsert }) {
  const [metals, setMetals] = useState([
    "Li",
    "Na",
    "K",
    "Rb",
    "Cs",
    "Mg",
    "Al",
    "Fe",
    "Cu",
    "Zn",
  ]);
  const halogens = ["F2", "Cl2", "Br2", "I2"];
  const [m, setM] = useState("Na");
  const [x, setX] = useState("Cl2");
  useEffect(() => {
    fetch("/periodic-table.json")
      .then((r) => r.json())
      .then((arr) => {
        const elements = Array.isArray(arr) ? arr : arr?.elements || [];
        const list = elements
          .filter(
            (e) =>
              String(e.category || "")
                .toLowerCase()
                .includes("metal") &&
              !String(e.category || "")
                .toLowerCase()
                .includes("metalloid")
          )
          .map((e) => e.symbol)
          .filter(Boolean);
        if (list.length) setMetals(Array.from(new Set(list)).sort());
      })
      .catch(() => {});
  }, []);
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="font-medium text-sm mb-1">Metal + Halogen</div>
      <div className="flex gap-2 items-center mb-2">
        <SearchSelect
          label="Metal"
          options={metals}
          value={m}
          onChange={setM}
        />
        <SearchSelect
          label="Halogen"
          options={halogens}
          value={x}
          onChange={setX}
        />
        <button
          type="button"
          className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 text-sm"
          onClick={() => onInsert(m, x)}
        >
          Insert
        </button>
      </div>
      <div className="text-xs text-gray-500">2M + X2 → 2MX</div>
    </div>
  );
}

function TemplateAcidBase({ onInsert }) {
  const acids = ["HCl", "HNO3"];
  const bases = ["NaOH", "KOH"];
  const saltMap = {
    "HCl+NaOH": "NaCl",
    "HCl+KOH": "KCl",
    "HNO3+NaOH": "NaNO3",
    "HNO3+KOH": "KNO3",
  };
  const [a, setA] = useState(acids[0]);
  const [b, setB] = useState(bases[0]);
  const salt = saltMap[`${a}+${b}`] || "Salt";
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="font-medium text-sm mb-1">Acid + Base</div>
      <div className="flex gap-2 items-center mb-2">
        <SearchSelect label="Acid" options={acids} value={a} onChange={setA} />
        <SearchSelect label="Base" options={bases} value={b} onChange={setB} />
        <button
          type="button"
          className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 text-sm"
          onClick={() => onInsert(a, b, salt)}
        >
          Insert
        </button>
      </div>
      <div className="text-xs text-gray-500">
        Monoprotic acid + strong base → salt + H2O
      </div>
    </div>
  );
}

function SearchSelect({ label, options, value, onChange }) {
  const [query, setQuery] = useState("");
  const id = useId();
  const listId = `${id}-list`;
  const filtered = (options || []).filter((o) =>
    String(o).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="flex items-center gap-1">
      <input
        list={listId}
        className="border rounded-md p-1 text-sm w-28"
        placeholder={label}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v);
          setQuery(v);
        }}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <datalist id={listId}>
        {filtered.slice(0, 300).map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </div>
  );
}
