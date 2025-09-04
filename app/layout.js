export const metadata = {
  title: "Chemistry Solver",
  description:
    "Photomath for Chemistry — balance equations, stoichiometry, gas laws, and more",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="mt-10 border-t">
          <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Chemistry Solver</span>
            <span>By: Gio Adu</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
