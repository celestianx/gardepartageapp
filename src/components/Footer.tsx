export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
      <nav className="flex justify-center gap-6">
        <a href="/politique-de-confidentialite" className="hover:underline">
          Politique de confidentialité
        </a>
        <a href="/mentions-legales" className="hover:underline">
          Mentions légales
        </a>
      </nav>
      <p className="mt-4">
        Outil de calcul à titre indicatif — non affilié à Pajemploi ou à la CAF.
      </p>
    </footer>
  );
}
