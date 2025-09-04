import { solve } from "../../../lib/solver";

export async function POST(request) {
  try {
    const body = await request.json();
    const query = String(body?.query ?? "");
    const lang = String(body?.lang ?? "en");
    const result = solve(query, lang);
    return Response.json(result, { status: 200 });
  } catch (e) {
    return Response.json(
      { finalAnswer: "Error", steps: ["Invalid request"] },
      { status: 400 }
    );
  }
}
