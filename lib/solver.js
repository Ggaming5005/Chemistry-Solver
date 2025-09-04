// Very simple placeholder chemistry solver covering basic balancing and stoichiometry

function detectType(query) {
  const q = query.toLowerCase();
  if (q.includes("->") || q.includes("→") || q.includes("=")) return "balance";
  if (q.includes("stoich") || q.includes("grams") || q.includes("moles"))
    return "stoichiometry";
  if (
    q.includes("pv=nrt") ||
    q.includes("ideal gas") ||
    q.includes("boyle") ||
    q.includes("charles")
  )
    return "gas";
  if (
    q.includes("molarity") ||
    q.includes("mol/l") ||
    q.includes("concentration")
  )
    return "molarity";
  if (q.includes("hcl") && q.includes("naoh")) return "neutralization";
  return "unknown";
}

function normalizeArrows(s) {
  return s.replace(/⇌|＝|=/g, "->").replace(/→/g, "->");
}

function normalizeChemText(s) {
  // Map Unicode subscripts/superscripts to ASCII equivalents for parsing
  const subDigits = {
    "₀": "0",
    "₁": "1",
    "₂": "2",
    "₃": "3",
    "₄": "4",
    "₅": "5",
    "₆": "6",
    "₇": "7",
    "₈": "8",
    "₉": "9",
  };
  const superMap = {
    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9",
    "⁺": "+",
    "⁻": "-",
  };
  return s
    .replace(/[₀-₉]/g, (ch) => subDigits[ch] || ch)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, (ch) => superMap[ch] || ch)
    .replace(/[−–—]/g, "-")
    .replace(/⟶|⟵|⟷/g, "->");
}

function predictSimpleReaction(input, lang = "en") {
  const txt = normalizeChemText(input).replace(/\s+/g, "");
  // Alkali metal + water → metal hydroxide + hydrogen
  const alkali = ["Li", "Na", "K", "Rb", "Cs", "Fr"];
  for (const m of alkali) {
    if (
      new RegExp(`^(${m})\+H2O$`, "i").test(txt) ||
      new RegExp(`H2O\+(${m})`, "i").test(txt)
    ) {
      const M = m;
      return {
        finalAnswer: `2${M} + 2H2O → 2${M}OH + H2`,
        steps: [
          lang === "ka"
            ? "წესი: ტუტე ლითონი წყალთან რეაგირებს და წარმოიქმნება მეტალის ჰიდროქსიდი და წყალბადი"
            : "Rule: Alkali metal reacts with water to form metal hydroxide and hydrogen",
          lang === "ka"
            ? `დაუბალანსებელი ნახაზი: ${M} + H2O → ${M}OH + H2`
            : `Unbalanced skeleton: ${M} + H2O → ${M}OH + H2`,
          lang === "ka"
            ? "დაბალანსება: ${M}-ისა და OH ჯგუფების წინ 2"
            : "Balance ${M} and OH groups: coefficient 2 for ${M} and H2O, 2 for ${M}OH",
          lang === "ka"
            ? `დაბალანსებული: 2${M} + 2H2O → 2${M}OH + H2`
            : `Balanced: 2${M} + 2H2O → 2${M}OH + H2`,
        ],
      };
    }
  }
  // Strong acid + strong base → salt + water (example: HCl + NaOH)
  if (/HCl\+NaOH/i.test(txt) || /NaOH\+HCl/i.test(txt)) {
    return {
      finalAnswer: `HCl + NaOH → NaCl + H2O`,
      steps: [
        lang === "ka"
          ? "ნეიტრალიზაცია: მჟავა + საფუძველი → მარილი + წყალი"
          : "Neutralization: acid + base → salt + water",
        lang === "ka"
          ? "სტოიქიომეტრია 1:1 HCl და NaOH შორის"
          : "1:1 stoichiometry for HCl and NaOH",
        lang === "ka"
          ? "დაბალანსებული: HCl + NaOH → NaCl + H2O"
          : "Balanced: HCl + NaOH → NaCl + H2O",
      ],
    };
  }
  // Sodium + chlorine → sodium chloride
  if (/Na\+Cl2/i.test(txt) || /Cl2\+Na/i.test(txt)) {
    return {
      finalAnswer: `2Na + Cl2 → 2NaCl`,
      steps: [
        lang === "ka"
          ? "შეერთების ტიპი: ლითონი + ჰალოგენი → მეტალის ჰალიდი"
          : "Combination reaction: metal + halogen → metal halide",
        lang === "ka"
          ? "Na დაბალანსება კოეფიციენტით 2"
          : "Balance Na with coefficient 2",
        lang === "ka"
          ? "დაბალანსებული: 2Na + Cl2 → 2NaCl"
          : "Balanced: 2Na + Cl2 → 2NaCl",
      ],
    };
  }
  return null;
}

function balanceEquation(input, lang = "en") {
  // Normalize arrows and whitespace
  const normalized = normalizeArrows(normalizeChemText(input)).replace(
    /\s+/g,
    ""
  );

  // Incomplete reaction detection (e.g., "Uue + Es =" or "A+B->")
  if (normalized.includes("->")) {
    const [lhs, rhs] = normalized.split("->");
    if (!lhs || lhs.trim() === "") {
      return {
        finalAnswer:
          lang === "ka"
            ? "ვერ გადავჭერი: რეაქტანტები არ არის"
            : "Cannot solve: Missing reactants",
        steps: [
          lang === "ka"
            ? "აღმოჩენილია ისარი, მაგრამ მარცხნივ რეაქტანტები არაა."
            : "We detected a reaction arrow but no reactants on the left.",
          lang === "ka"
            ? "მიუთითეთ რეაქტანტები ისრამდე, напр. H2 + O2 -> H2O."
            : "Please enter reactants before the arrow, e.g., H2 + O2 -> H2O.",
        ],
      };
    }
    if (!rhs || rhs.trim() === "") {
      // Try to predict simple products
      const predicted = predictSimpleReaction(lhs, lang);
      if (predicted) return predicted;
      return {
        finalAnswer:
          lang === "ka"
            ? "ვერ გადავჭერი: არასრულყოფილი რეაქცია (პროდუქტები აკლია)"
            : "Cannot solve: Incomplete reaction (missing products)",
        steps: [
          lang === "ka"
            ? "აღმოჩენილია ისარი, მაგრამ მარჯვნივ პროდუქტები არაა."
            : "We detected a reaction arrow but no products after it.",
          lang === "ka"
            ? "დაამატეთ პროდუქტები ისრის შემდეგ ან მიუთითეთ ამოცანა ('Balance: H2 + O2 -> H2O')."
            : "Add expected products after the arrow, or specify the task (e.g., 'Balance: H2 + O2 -> H2O').",
        ],
      };
    }
  }

  // General matrix balancer (atoms balance) using Gaussian elimination with integer normalization
  const [lhs, rhs] = normalized.split("->");
  function stripLeadingCoeff(s) {
    return s.replace(/^\s*\d+\s*(?=[A-Za-z(\[])/, "");
  }
  const left = lhs.split("+").map(stripLeadingCoeff);
  const right = rhs.split("+").map(stripLeadingCoeff);
  const species = [...left, ...right];

  function parse(formula) {
    const stack = [{}];
    let i = 0;
    while (i < formula.length) {
      if (formula[i] === "(" || formula[i] === "[" || formula[i] === "{") {
        stack.push({});
        i++;
        continue;
      }
      if (formula[i] === ")" || formula[i] === "]" || formula[i] === "}") {
        i++; // read multiplier
        let num = "";
        while (i < formula.length && /[0-9]/.test(formula[i])) {
          num += formula[i++];
        }
        const mult = num ? parseInt(num, 10) : 1;
        const group = stack.pop();
        const top = stack[stack.length - 1];
        for (const el in group) top[el] = (top[el] || 0) + group[el] * mult;
        continue;
      }
      // Element symbol
      if (/[A-Z]/.test(formula[i])) {
        let el = formula[i++];
        while (i < formula.length && /[a-z]/.test(formula[i]))
          el += formula[i++];
        let num = "";
        while (i < formula.length && /[0-9]/.test(formula[i]))
          num += formula[i++];
        const n = num ? parseInt(num, 10) : 1;
        const top = stack[stack.length - 1];
        top[el] = (top[el] || 0) + n;
        continue;
      }
      // Skip unexpected
      i++;
    }
    return stack[0];
  }

  // Build element list
  const elementSet = new Set();
  const parsed = species.map(parse);
  parsed.forEach((map) => Object.keys(map).forEach((e) => elementSet.add(e)));
  const elements = Array.from(elementSet);

  // Build matrix A * x = 0 with sign convention (left positive, right negative)
  const rows = elements.length;
  const cols = species.length;
  const A = Array.from({ length: rows }, () => Array(cols).fill(0));
  elements.forEach((el, r) => {
    left.forEach((sp, c) => {
      A[r][c] = parsed[c][el] || 0;
    });
    right.forEach((sp, k) => {
      const c = left.length + k;
      A[r][c] = -(parsed[c][el] || 0);
    });
  });

  // Solve nullspace vector using rational Gauss-Jordan
  function gcd(a, b) {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  }
  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  // Convert to row-reduced echelon form
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    // find pivot
    let piv = r;
    for (let i = r; i < rows; i++)
      if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i;
    if (A[piv][c] === 0) continue;
    [A[r], A[piv]] = [A[piv], A[r]];
    // normalize row r to integer pivot 1 by dividing GCD
    let g = 0;
    for (let j = c; j < cols; j++) g = gcd(g, Math.trunc(A[r][j]));
    if (g !== 0)
      for (let j = c; j < cols; j++) A[r][j] = Math.trunc(A[r][j] / g);
    // eliminate
    for (let i = 0; i < rows; i++)
      if (i !== r && A[i][c] !== 0) {
        const factor = A[i][c];
        for (let j = c; j < cols; j++)
          A[i][j] = A[i][j] * A[r][c] - factor * A[r][j];
      }
    r++;
  }

  // Back-substitute by setting last variable to LCM and solving upwards
  const x = Array(cols).fill(0);
  x[cols - 1] = 1;
  for (let i = rows - 1; i >= 0; i--) {
    // find first nonzero column
    let lead = -1;
    for (let j = 0; j < cols; j++)
      if (A[i][j] !== 0) {
        lead = j;
        break;
      }
    if (lead === -1) continue;
    let sum = 0;
    for (let j = lead + 1; j < cols; j++) sum += A[i][j] * x[j];
    // A[i][lead]*x[lead] + sum = 0 => x[lead] = -sum/A[i][lead]
    const denom = A[i][lead];
    x[lead] = denom === 0 ? 0 : -sum / denom;
  }
  // Clear denominators
  let denomLCM = 1;
  x.forEach((v) => {
    const frac = rational(v);
    denomLCM = lcm(denomLCM, frac.d);
  });
  const ints = x.map((v) => {
    const frac = rational(v);
    return Math.round(frac.n * (denomLCM / frac.d));
  });
  // Normalize to smallest positive integers
  let gAll = 0;
  ints.forEach((v) => (gAll = gcd(gAll, Math.abs(v))));
  if (gAll) for (let i = 0; i < ints.length; i++) ints[i] = ints[i] / gAll;
  // Ensure all positive, drop stray minus signs
  const sign = ints.find((v) => v !== 0 && v < 0) ? -1 : 1;
  for (let i = 0; i < ints.length; i++) {
    ints[i] = Math.abs(ints[i] * sign);
  }

  function rational(v) {
    // convert float to fraction
    if (!isFinite(v)) return { n: 0, d: 1 };
    const s = v.toString();
    if (!s.includes(".")) return { n: v, d: 1 };
    const d = 10 ** s.split(".")[1].length;
    return { n: Math.round(v * d), d };
  }

  const leftCoeffs = ints.slice(0, left.length);
  const rightCoeffs = ints.slice(left.length);
  const pretty = (coeff, f) => (coeff === 1 ? "" : coeff) + f;
  const answer = `${leftCoeffs
    .map((c, i) => pretty(c, left[i]))
    .join(" + ")} → ${rightCoeffs
    .map((c, i) => pretty(c, right[i]))
    .join(" + ")}`;

  const steps = [
    lang === "ka"
      ? "ფორმულების დამუშავება ელემენტების რაოდენობებად"
      : "Parsed formulas into element counts",
    lang === "ka"
      ? `გამოყენებული ელემენტები: ${elements.join(", ")}`
      : `Elements considered: ${elements.join(", ")}`,
    lang === "ka"
      ? "ბალანსის მატრიცის აგება და ამოხსნა"
      : "Built and solved balance matrix",
    lang === "ka"
      ? "კოეფიციენტების ნორმალიზაცია უმცირეს მთლიან რიცხვებად"
      : "Normalized coefficients to smallest integers",
    lang === "ka"
      ? `დაბალანსებული განტოლება: ${answer}`
      : `Balanced equation: ${answer}`,
  ];

  try {
    return { finalAnswer: answer, steps };
  } catch (e) {
    return {
      finalAnswer: lang === "ka" ? "შეცდომა ბალანსირებისას" : "Balancing error",
      steps: [
        lang === "ka"
          ? "გთხოვთ გადაამოწმოთ ფორმულა"
          : "Please check the formula",
      ],
    };
  }
}

function solveStoichiometry(input) {
  // Very basic example: if query mentions NaOH and HCl -> NaCl + H2O, compute moles from given grams of NaOH
  const gramsMatch = normalizeChemText(input).match(
    /(\d+(?:\.\d+)?)\s*g(?:ram)?s?\s*NaOH/i
  );
  if (gramsMatch) {
    const grams = parseFloat(gramsMatch[1]);
    const molarMassNaOH = 40.0; // g/mol
    const molesNaOH = grams / molarMassNaOH;
    const gramsNaCl = molesNaOH * 58.44; // 1:1 stoichiometry
    return {
      finalAnswer: `${gramsNaCl.toFixed(2)} g NaCl (assuming excess HCl)`,
      steps: [
        "Balanced: NaOH + HCl → NaCl + H2O",
        `M(NaOH) = 40.00 g/mol; n(NaOH) = ${grams} / 40.00 = ${molesNaOH.toFixed(
          3
        )} mol`,
        "Mole ratio NaOH:NaCl = 1:1",
        `m(NaCl) = n(NaCl) × M(NaCl) = ${molesNaOH.toFixed(
          3
        )} × 58.44 = ${gramsNaCl.toFixed(2)} g`,
      ],
    };
  }
  return {
    finalAnswer: "Feature coming soon",
    steps: ["We will support more stoichiometry patterns soon."],
  };
}

export function solve(query, lang = "en") {
  const input = normalizeChemText(String(query ?? "").trim());
  if (!input) {
    return {
      finalAnswer:
        lang === "ka" ? "შეტანა არაა მითითებული" : "No input provided",
      steps: [
        lang === "ka"
          ? "ჩაწერეთ ქიმიური ამოცანა ან განტოლება ( напр. 'H2 + O2 -> H2O' )."
          : "Type a chemistry problem or equation (e.g., 'H2 + O2 -> H2O').",
        lang === "ka"
          ? "ასევე შეგიძლიათ სტოიქიომეტრია, напр. '10 g NaOH + HCl → ? g NaCl'."
          : "You can also ask stoichiometry like '10 g NaOH + HCl → ? g NaCl'.",
        lang === "ka"
          ? "თუ ვერ გადავჭრით, გეტყვით მიზეზს და მხარდაჭერილ თემებს."
          : "If we can't solve it yet, we'll tell you why and what is supported.",
      ],
    };
  }

  // Detect and solve multiple intents in one input
  const lower = input.toLowerCase();
  const wantsBalance =
    /balance\b/i.test(input) ||
    lower.includes("->") ||
    lower.includes("→") ||
    lower.includes("=");
  const wantsStoich =
    /(\d+(?:\.\d+)?)\s*g(?:ram)?s?\s*naoh/i.test(input) ||
    /stoich/i.test(input);

  // If looks like reactants only (contains + but no arrow) → try prediction
  if (!wantsBalance && /\+/.test(input) && !/->|→|=/.test(input)) {
    const predicted = predictSimpleReaction(input);
    if (predicted) return predicted;
    return {
      finalAnswer:
        lang === "ka"
          ? "ვერ ვიქმნი პროდუქტებს ამ რეაქტანტებისთვის"
          : "Cannot infer products for these reactants",
      steps: [
        lang === "ka"
          ? "დაამატეთ ისარი და პროდუქტები, напр. 'A + B -> C'"
          : "Add an arrow and products, e.g., 'A + B -> C'",
        lang === "ka"
          ? "ან გამოიყენეთ მხარდაჭერილი ნიმუშები: Li + H2O; HCl + NaOH"
          : "Or use supported patterns: Li + H2O; HCl + NaOH",
      ],
    };
  }

  const results = [];
  if (wantsBalance) results.push(balanceEquation(input, lang));
  if (wantsStoich) results.push(solveStoichiometry(input));

  if (results.length === 1) return results[0];
  if (results.length > 1) {
    return {
      finalAnswer: results
        .map((r, i) => `(${i + 1}) ${r.finalAnswer}`)
        .join(" | "),
      steps: results.flatMap((r, i) => [`Task ${i + 1}:`, ...r.steps]),
    };
  }

  const type = detectType(input);
  return {
    finalAnswer:
      lang === "ka" ? "ფუნქცია მალე დაემატება" : "Feature coming soon",
    steps: [
      `Detected type: ${type}`,
      lang === "ka"
        ? "ამჟამად ხელმისაწვდომია: H2 + O2 -> H2O ბალანსი და მარტივი NaOH გრამები → NaCl გრამები"
        : "Supported now: balancing H2 + O2 -> H2O, simple NaOH grams → NaCl grams",
    ],
  };
}
