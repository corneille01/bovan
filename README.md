# OCD Live Lomé, réservation de lives

Application de réservation en 7 étapes : mode, pack, date, créneau, activité, paiement, confirmation. Le compte client est créé à la première réservation et la connexion se fait avec un code reçu par e-mail, SMS ou WhatsApp.

## Démarrage

    npm install --legacy-peer-deps
    cp .env.example .env
    npm run dev

Sans fournisseur d'envoi configuré, le code de connexion s'affiche à l'écran, uniquement hors production.

## Commandes

- `npm run dev` lance le site et l'API
- `npm run lint` vérifie les types
- `npm run build` produit le site
- `npm test` lance les tests de l'API

## Déploiement sur Netlify

Le fichier `netlify.toml` envoie `/api/*` vers la fonction `netlify/functions/api.ts`, qui exécute la même API que le serveur local. Ajoutez les variables de `.env.example` dans les réglages du site Netlify.

## Mise en production

1. Renseignez `SESSION_SECRET`, `APP_URL`, `DATABASE_URL`, un fournisseur d'e-mail et Twilio dans `.env.example`.
2. Le premier compte studio s'inscrit avec une adresse listée dans `ADMIN_EMAILS`.
3. Pour WhatsApp, Twilio exige un modèle de message approuvé : renseignez `TWILIO_WHATSAPP_OTP_CONTENT_SID`.
4. Complétez les mentions légales et les CGV marquées « À compléter ».
