import { load, ConfigNotFoundError } from '@/modules/ConfigurationStore';
import { aggregate } from '@/modules/CostAggregator';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { headers } from 'next/headers';

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let config;
  try {
    config = await load(id);
  } catch (e) {
    if (e instanceof ConfigNotFoundError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Configuration introuvable
            </h1>
            <p className="text-gray-600 mb-6">
              L&apos;identifiant de configuration <code className="bg-gray-100 px-1 rounded">{id}</code> n&apos;existe pas ou a expiré.
            </p>
            <Link
              href="/configurateur"
              className="inline-block px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Créer une nouvelle configuration
            </Link>
          </div>
        </main>
      );
    }
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur serveur</h1>
          <p className="text-gray-600 mb-6">
            Une erreur inattendue s&apos;est produite. Veuillez réessayer plus tard.
          </p>
          <Link
            href="/configurateur"
            className="inline-block px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Retour au configurateur
          </Link>
        </div>
      </main>
    );
  }

  const result = aggregate(config);

  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const shareUrl = `${proto}://${host}/r/${id}`;

  const totalCMG = result.families.reduce((sum, f) => sum + f.cmgDeduction, 0);
  const totalExpenses = result.families.reduce((sum, f) => sum + f.expensesShare, 0);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Résultats de votre garde partagée
          </h1>
          <Link
            href={`/configurateur?id=${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Modifier la configuration
          </Link>
        </div>

        {/* Cartes familles */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {result.families.map((family) => (
            <div
              key={family.familyId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {family.familyName}
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Part brute du coût employeur</span>
                  <span className="font-medium text-gray-900">{formatEur(family.grossShare)}</span>
                </li>
                <li className="flex justify-between">
                  <span>CMG déduit</span>
                  <span className={`font-medium ${family.cmgDeduction > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {family.cmgDeduction > 0 ? `− ${formatEur(family.cmgDeduction)}` : formatEur(0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Frais annexes</span>
                  <span className="font-medium text-gray-900">{formatEur(family.expensesShare)}</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Reste à charge net</span>
                <span className="text-xl font-bold text-gray-900">{formatEur(family.netCharge)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif total */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Récapitulatif global</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Coût total employeur</span>
              <span className="font-medium text-gray-900">{formatEur(result.totalEmployerCost)}</span>
            </li>
            <li className="flex justify-between">
              <span>Total CMG toutes familles</span>
              <span className={`font-medium ${totalCMG > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {totalCMG > 0 ? `− ${formatEur(totalCMG)}` : formatEur(0)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Total frais annexes</span>
              <span className="font-medium text-gray-900">{formatEur(totalExpenses)}</span>
            </li>
          </ul>
        </div>

        {/* Partage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Partager ces résultats</h2>
          <p className="text-sm text-gray-500 mb-3 break-all">{shareUrl}</p>
          <CopyButton text={shareUrl} />
        </div>

        {/* Mention légale */}
        <p className="text-xs text-gray-400 text-center">
          Ces calculs sont fournis à titre indicatif.
        </p>
      </div>
    </main>
  );
}
