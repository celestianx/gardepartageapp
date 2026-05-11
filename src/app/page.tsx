export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Garde partagée — calcul du reste à charge
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Configurez votre garde partagée et obtenez le coût mensuel de chaque famille.
      </p>
      <a
        href="/configurateur"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Démarrer la configuration
      </a>
    </main>
  );
}
