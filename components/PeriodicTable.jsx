"use client";
import { useEffect, useMemo, useState } from "react";

export default function PeriodicTable({ lang = "en" }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [classFilter, setClassFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [radioactiveFilter, setRadioactiveFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const local = await fetch("/periodic-table.json").then((r) => r.json());
        let elements = normalizeElements(local);
        if (!elements || elements.length < 100) {
          const remote = await fetch(
            "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"
          ).then((r) => r.json());
          elements = normalizeElements(remote);
        }
        setData(dedupeByNumber(elements));
      } catch {
        setData([]);
      }
    }
    load();
  }, []);

  function normalizeElements(input) {
    const arr = Array.isArray(input)
      ? input
      : Array.isArray(input?.elements)
      ? input.elements
      : [];
    return arr
      .map((e) => ({
        name: e.name,
        symbol: e.symbol,
        number: Number(e.number ?? e.atomic_number ?? e.Z),
        atomic_mass:
          typeof e.atomic_mass === "string"
            ? parseFloat(e.atomic_mass)
            : Number(e.atomic_mass),
        category: e.category,
        phase: e.phase,
        summary: e.summary,
        radioactive: inferRadioactive(e),
      }))
      .filter((e) => e.name && e.symbol && !Number.isNaN(e.number));
  }

  function dedupeByNumber(elements) {
    const seen = new Set();
    const out = [];
    for (const el of elements) {
      if (seen.has(el.number)) continue;
      seen.add(el.number);
      out.push(el);
    }
    return out.sort((a, b) => a.number - b.number);
  }

  function inferRadioactive(e) {
    if (typeof e.radioactive === "boolean") return e.radioactive;
    const s = `${e.summary ?? ""}`.toLowerCase();
    if (s.includes("radioactive")) return true;
    const z = Number(e.number ?? e.atomic_number ?? e.Z);
    if (!Number.isNaN(z) && z > 82) return true;
    return false;
  }

  function classifySimple(category) {
    const c = `${category ?? ""}`.toLowerCase();
    if (c.includes("metalloid")) return "metalloid";
    if (c.includes("nonmetal")) return "nonmetal";
    if (c.includes("metal")) return "metal";
    return "other";
  }

  const categories = useMemo(() => {
    const s = new Set(data.map((e) => e.category).filter(Boolean));
    return ["all", ...Array.from(s).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((e) => {
      if (
        q &&
        !(
          e.symbol.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          String(e.number).includes(q)
        )
      )
        return false;

      const cls = classifySimple(e.category);
      if (classFilter !== "all" && cls !== classFilter) return false;

      if (phaseFilter !== "all") {
        const ph = `${e.phase ?? ""}`.toLowerCase();
        if (phaseFilter.toLowerCase() !== ph) return false;
      }

      if (radioactiveFilter !== "all") {
        const isR = !!e.radioactive;
        if (radioactiveFilter === "radioactive" && !isR) return false;
        if (radioactiveFilter === "nonradioactive" && isR) return false;
      }

      if (categoryFilter !== "all" && e.category !== categoryFilter)
        return false;

      return true;
    });
  }, [
    data,
    query,
    classFilter,
    phaseFilter,
    radioactiveFilter,
    categoryFilter,
  ]);

  return (
    <div className="rounded-xl shadow-sm border p-4 h-full">
      <div className="mb-3 space-y-2">
        <div className="text-sm text-gray-500 mb-1">
          {lang === "ka" ? "პერიოდული ცხრილი" : "Periodic Table"}
        </div>
        <input
          className="w-full rounded-md border p-2 text-sm"
          placeholder={
            lang === "ka"
              ? "ძებნა ( напр. Na, Sodium, 11 )"
              : "Search element (e.g., Na, Sodium, 11)"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="text-sm underline text-blue-700"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          {filtersOpen
            ? lang === "ka"
              ? "ფილტრების დამალვა"
              : "Hide filters"
            : lang === "ka"
            ? "ფილტრების ჩვენება"
            : "Show filters"}
        </button>
        {filtersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              className="rounded-md border p-2 text-sm"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="all">
                {lang === "ka" ? "ყველა კლასი" : "All classes"}
              </option>
              <option value="metal">
                {lang === "ka" ? "ლითონები" : "Metals"}
              </option>
              <option value="nonmetal">
                {lang === "ka" ? "არალითონები" : "Nonmetals"}
              </option>
              <option value="metalloid">
                {lang === "ka" ? "მეტალოიდები" : "Metalloids"}
              </option>
            </select>
            <select
              className="rounded-md border p-2 text-sm"
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
            >
              <option value="all">
                {lang === "ka" ? "ყველა ფაზე" : "All phases"}
              </option>
              <option value="Solid">{lang === "ka" ? "მყარი" : "Solid"}</option>
              <option value="Liquid">
                {lang === "ka" ? "თხევადი" : "Liquid"}
              </option>
              <option value="Gas">{lang === "ka" ? "გაზი" : "Gas"}</option>
            </select>
            <select
              className="rounded-md border p-2 text-sm"
              value={radioactiveFilter}
              onChange={(e) => setRadioactiveFilter(e.target.value)}
            >
              <option value="all">
                {lang === "ka"
                  ? "ყველა (რადიოაქტივობა)"
                  : "All (radioactivity)"}
              </option>
              <option value="radioactive">
                {lang === "ka" ? "მხოლოდ რადიოაქტიური" : "Radioactive only"}
              </option>
              <option value="nonradioactive">
                {lang === "ka" ? "არარადიოაქტიური" : "Non-radioactive only"}
              </option>
            </select>
            <select
              className="rounded-md border p-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all"
                    ? lang === "ka"
                      ? "ყველა კატეგორია"
                      : "All categories"
                    : c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-80 overflow-auto">
        {filtered.map((el, i) => (
          <button
            key={`${el.number}-${el.symbol}-${i}`}
            className={`border rounded-md p-2 text-center hover:bg-gray-50 ${
              selected?.number === el.number ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelected(el)}
            title={el.name}
          >
            <div className="text-xs text-gray-500">{el.number}</div>
            <div className="font-semibold">{el.symbol}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-4 rounded-lg border p-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {selected.name} ({selected.symbol})
            </div>
            <div className="text-sm text-gray-500">Z = {selected.number}</div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">
                {lang === "ka" ? "ატომური მასა:" : "Atomic Mass:"}
              </span>{" "}
              {selected.atomic_mass}
            </div>
            <div>
              <span className="text-gray-500">
                {lang === "ka" ? "კატეგორია:" : "Category:"}
              </span>{" "}
              {selected.category}
            </div>
            <div>
              <span className="text-gray-500">
                {lang === "ka" ? "ფაზა:" : "Phase:"}
              </span>{" "}
              {selected.phase}
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">
                {lang === "ka" ? "შეჯამება:" : "Summary:"}
              </span>{" "}
              {(() => {
                const text = selected.summary || "";
                const short = text.slice(0, 180);
                const isLong = text.length > 180;
                return (
                  <>
                    {detailsExpanded || !isLong ? text : `${short}...`}{" "}
                    {isLong && (
                      <button
                        type="button"
                        className="text-blue-700 underline ml-1"
                        onClick={() => setDetailsExpanded((v) => !v)}
                      >
                        {detailsExpanded
                          ? lang === "ka"
                            ? "ნაკლების ნახვა"
                            : "Show less"
                          : lang === "ka"
                          ? "მეტის ნახვა"
                          : "Show more"}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
