export const messages = {
  en: {
    appTitle: "Chemistry Solver",
    solve: "Solve",
    clear: "Clear",
    examples: "Examples:",
    inputPlaceholder:
      "Type a chemistry problem or equation, e.g. H2 + O2 -> H2O",
    finalAnswer: "Final Answer",
    steps: "Steps",
    copySteps: "Copy Steps",
    copied: "Steps copied to clipboard",
    periodicTable: "Periodic Table",
    searchPlaceholder: "Search element (e.g., Na, Sodium, 11)",
    showFilters: "Show filters",
    hideFilters: "Hide filters",
    allClasses: "All classes",
    metals: "Metals",
    nonmetals: "Nonmetals",
    metalloids: "Metalloids",
    allPhases: "All phases",
    solid: "Solid",
    liquid: "Liquid",
    gas: "Gas",
    allRadioactivity: "All (radioactivity)",
    radioactiveOnly: "Radioactive only",
    nonradioactiveOnly: "Non-radioactive only",
    allCategories: "All categories",
    summary: "Summary:",
    showMore: "Show more",
    showLess: "Show less",
    noInput: "No input provided",
    noInputStep1:
      "Type a chemistry problem or equation (e.g., 'H2 + O2 -> H2O').",
    noInputStep2:
      "You can also ask stoichiometry like '10 g NaOH + HCl → ? g NaCl'.",
    noInputStep3:
      "If we can't solve it yet, we'll tell you why and what is supported.",
    missingReactants: "Cannot solve: Missing reactants",
    missingProducts: "Cannot solve: Incomplete reaction (missing products)",
    missingReactantsStep1:
      "We detected a reaction arrow but no reactants on the left.",
    missingReactantsStep2:
      "Please enter reactants before the arrow, e.g., H2 + O2 -> H2O.",
    missingProductsStep1:
      "We detected a reaction arrow but no products after it.",
    missingProductsStep2:
      "Add expected products after the arrow, or specify the task (e.g., 'Balance: H2 + O2 -> H2O').",
    comingSoon: "Feature coming soon",
  },
  ka: {
    appTitle: "ქიმიის ამომხსნელი",
    solve: "გადაწყვეტა",
    clear: "გასუფთავება",
    examples: "მაგალითები:",
    inputPlaceholder: "ჩაწერეთ ამოცანა ან რეაქცია, напр. H2 + O2 -> H2O",
    finalAnswer: "საბოლოო პასუხი",
    steps: "ნაბიჯები",
    copySteps: "ნაბიჯების კოპირება",
    copied: "ნაბიჯები დაკოპირდა",
    periodicTable: "პერიოდული ცხრილი",
    searchPlaceholder: "ძებნა ( напр. Na, Sodium, 11 )",
    showFilters: "ფილტრების ჩვენება",
    hideFilters: "ფილტრების დამალვა",
    allClasses: "ყველა კლასი",
    metals: "ლითონები",
    nonmetals: "არალითონები",
    metalloids: "მეტალოიდები",
    allPhases: "ყველა ფაზე",
    solid: "მყარი",
    liquid: "თხევადი",
    gas: "გაზი",
    allRadioactivity: "ყველა (რადიოაქტივობა)",
    radioactiveOnly: "მხოლოდ რადიოაქტიური",
    nonradioactiveOnly: "არარადიოაქტიური",
    allCategories: "ყველა კატეგორია",
    summary: "შეჯამება:",
    showMore: "მეტის ნახვა",
    showLess: "ნაკლების ნახვა",
    noInput: "შეტანა არაა მითითებული",
    noInputStep1:
      "ჩაწერეთ ქიმიური ამოცანა ან განტოლება ( напр. 'H2 + O2 -> H2O' ).",
    noInputStep2:
      "ასევე შეგიძლიათ სტოიქიომეტრია, напр. '10 g NaOH + HCl → ? g NaCl'.",
    noInputStep3: "თუ ვერ გადავჭრით, გეტყვით მიზეზს და მხარდაჭერილ თემებს.",
    missingReactants: "ვერ გადავჭერით: რეაქტანტები აკლია",
    missingProducts: "ვერ გადავჭერით: არასრულყოფილი რეაქცია (პროდუქტები აკლია)",
    missingReactantsStep1:
      "აღმოჩენილია ისარი, მაგრამ მარცხნივ რეაქტანტები არაა.",
    missingReactantsStep2:
      "გთხოვთ მიუთითოთ რეაქტანტები ისრამდე, напр. H2 + O2 -> H2O.",
    missingProductsStep1: "აღმოჩენილია ისარი, მაგრამ მარჯვნივ პროდუქტები არაა.",
    missingProductsStep2:
      "დაამატეთ პროდუქტები ისრის შემდეგ ან მიუთითეთ ამოცანა ( напр. 'Balance: H2 + O2 -> H2O' ).",
    comingSoon: "ფუნქცია მალე დაემატება",
  },
};

export function t(lang, key) {
  const l = messages[lang] ? lang : "en";
  return messages[l][key] ?? messages.en[key] ?? key;
}

