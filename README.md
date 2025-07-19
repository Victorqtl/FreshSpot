# FreshSpot

**D�couvrez les spots rafraîchissants de Paris !**

FreshSpot est une application web moderne qui vous aide � trouver les meilleurs endroits pour vous rafraîchir � Paris : espaces verts, activités rafraîchissantes, et fontaines à boire. Toutes les données proviennent des APIs ouvertes de la Ville de Paris.

## Fonctionnalités

### Filtrage et recherche intelligente

-   **Arrondissements** : Support 75001, "1er", "1ème"
-   **Catégories** : S�lection multiple (Activités, Espaces verts, Fontaines)
-   **Persistance URL** : Filtres et recherches sauvegardés dans l'URLt

### Performance

-   **Server Components** : Rendu côté serveur optimisé
-   **Streaming** : Chargement progressif avec Suspense
-   **Cache** : Réduction des appels API

### Exploration Interactive

-   **Cartes interactives** avec Leaflet pour chaque spot
-   **Pagination fluide** avec chargement optimisé
-   **Pages détaillées** pour chaque spot avec informations complètes
-   **Design responsive** pour mobile et desktop

### =Données en Temps Réel

-   **3 sources de données** : Activités, Espaces verts, Fontaines
-   **Cache intelligent** avec TTL de 2 heures
-   **Mise à jour automatique** depuis les APIs Paris Open Data

## Technologies

### Frontend

-   **Next.js 15** avec App Router
-   **React 19** avec Server Components
-   **TypeScript** pour la sécurité des types
-   **Tailwind CSS** pour le styling

### UI/UX

-   **shadcn/ui** - Composants UI modernes
-   **Lucide Icons** - Ic�nes coh�rentes
-   **Polices Nexa** - Design typographique

### Données APIs

### Sources de Données

1. **Activit�s & �quipements**

    - Dataset: `ilots-de-fraicheur-equipements-activites`
    - Source: opendata.paris.fr
    - Contenu: Piscines, lieux de culte, baignades, musées...

2. **Espaces Verts**

    - Dataset: `ilots-de-fraicheur-espaces-verts-frais`
    - Source: parisdata.opendatasoft.com
    - Contenu: Parcs, jardins, squares...

3. **Fontaines � Boire**
    - Dataset: `fontaines-a-boire`
    - Source: opendata.paris.fr
    - Contenu: Fontaines publiques, points d'eau

### Endpoints

```typescript
// Export JSON pour les listes
GET /api/explore/v2.1/catalog/datasets/{dataset}/exports/json

// Recherche pour spots individuels
GET /api/explore/v2.1/catalog/datasets/{dataset}/records?where=identifiant="{id}"
```

## Démarrage Rapide

### Prérequis

-   **Node.js 18+**
-   **pnpm** (recommandé) ou npm

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/freshspot.git
cd freshspot

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
# Développement avec Turbopack
pnpm dev

# Build production
pnpm build

# D�marrer en production
pnpm start

# Linting
pnpm lint
```

## Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code

-   **TypeScript** strict mode
-   **ESLint** + Prettier
-   **Commits conventionnels** : `feat:`, `fix:`, `docs:`
