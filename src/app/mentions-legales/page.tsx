export default function MentionsLegales() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>

      <section className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800">Éditeur du site</h2>
          <p className="text-gray-600 mt-2">
            Ce site est édité à titre personnel. Pour toute question, vous pouvez nous
            contacter par email.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Hébergeur</h2>
          <p className="text-gray-600 mt-2">
            Vercel Inc.<br />
            340 Pine Street, Suite 603<br />
            San Francisco, CA 94104, USA<br />
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              vercel.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Nature du service</h2>
          <p className="text-gray-600 mt-2">
            Cet outil est fourni à titre informatif uniquement. Les calculs produits (salaire brut,
            charges URSSAF, CMG Pajemploi, répartition des frais) sont des estimations et ne
            constituent pas un conseil juridique, fiscal ou social. Les résultats peuvent différer
            des calculs officiels effectués par Pajemploi, l'URSSAF ou la CAF.
          </p>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-900">Cadre légal de la garde partagée</h2>
          <p className="text-amber-800 mt-2">
            En France, la garde partagée légale d'enfant à domicile est limitée à 2 familles
            employant conjointement une même assistante maternelle ou garde d'enfants (article
            L7221-1 et suivants du Code du travail). Le support de 3 familles ou plus par cet
            outil correspond à un arrangement informel non encadré par la législation en vigueur.
            L'utilisateur est seul responsable de la conformité de ses arrangements de garde avec
            la réglementation applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Propriété intellectuelle</h2>
          <p className="text-gray-600 mt-2">
            L'ensemble du contenu de ce site est protégé par le droit d'auteur. Toute reproduction
            ou utilisation sans autorisation préalable est interdite.
          </p>
        </section>
      </section>
    </main>
  );
}
