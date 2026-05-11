export default function PolitiqueDeConfidentialite() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

      <section className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800">Responsable du traitement</h2>
          <p className="text-gray-600 mt-2">
            L'éditeur de ce site est responsable du traitement des données personnelles collectées
            via cette application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Données collectées</h2>
          <p className="text-gray-600 mt-2">
            L'application ne collecte aucune donnée personnelle lors de la simple navigation.
            Lorsque vous utilisez la fonction de partage, les données de configuration que vous
            saisissez (composition des familles, prénoms des enfants, plannings, frais annexes,
            salaire de la nounou) sont stockées sur nos serveurs afin de générer un lien court
            partageable.
          </p>
          <p className="text-gray-600 mt-2">
            Ces données sont stockées dans Vercel KV (Redis) et associées à un identifiant
            aléatoire. Aucun compte utilisateur n'est requis pour utiliser l'application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Durée de conservation</h2>
          <p className="text-gray-600 mt-2">
            Les configurations partagées sont conservées sans durée limite définie dans le cadre
            de ce service. Une politique de suppression automatique après 24 mois d'inactivité est
            envisagée dans une version future.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Vos droits</h2>
          <p className="text-gray-600 mt-2">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer
            ces droits ou pour toute question relative à vos données personnelles, vous pouvez
            nous contacter par email.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Publicités Google AdSense</h2>
          <p className="text-gray-600 mt-2">
            Ce site utilise Google AdSense pour afficher des publicités. Google AdSense utilise
            des cookies afin de diffuser des annonces pertinentes. Ces cookies permettent à Google
            et à ses partenaires de servir des annonces basées sur vos visites sur ce site et
            d'autres sites.
          </p>
          <p className="text-gray-600 mt-2">
            Vous pouvez consulter la{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              politique de confidentialité de Google
            </a>{' '}
            pour en savoir plus sur la façon dont Google utilise les données.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Hébergement</h2>
          <p className="text-gray-600 mt-2">
            Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 603, San Francisco,
            CA 94104, USA.
          </p>
        </section>
      </section>
    </main>
  );
}
