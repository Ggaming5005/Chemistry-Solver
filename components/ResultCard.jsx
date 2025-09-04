export default function ResultCard({ finalAnswer, lang = "en" }) {
  if (!finalAnswer) return null;
  return (
    <div className="rounded-xl shadow-sm border p-5 bg-gray-50">
      <div className="text-sm text-gray-500 mb-1">
        {lang === "ka" ? "საბოლოო პასუხი" : "Final Answer"}
      </div>
      <div className="text-2xl font-semibold tracking-wide">{finalAnswer}</div>
    </div>
  );
}
