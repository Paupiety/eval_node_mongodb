# Évaluation Node.js + MongoDB : TodoList API

## 🎯 Objectif

Tu dois implémenter une API REST de gestion de listes de tâches (todo lists) en te basant sur le fichier `openapi.yml` fourni.
Le fichier `openapi.yml` peut être visualisé avec Swagger Editor : [https://editor.swagger.io/](https://editor.swagger.io/)

Tu devras :

- Créer les **modèles Mongoose** correspondants (`TodoList` avec des **sous-documents** `Task`)
- Implémenter toutes les **routes définies** dans le fichier `openapi.yml`
- T’assurer que les routes fonctionnent comme décrit (codes HTTP, corps des requêtes/réponses, etc.)
- Utiliser le **fichier `seedTodo.js`** pour alimenter la base de données
- Tester l’ensemble à l’aide de Postman ou via une interface frontend si tu le souhaites

---

## 📦 Prérequis

- Node.js ≥ 18
- Docker et Docker Compose
- MongoDB (utilisé via docker-compose.yml fourni)

---

## 🧱 Modélisation

Tu devras créer un **modèle `TodoList`** avec le schéma suivant :

```js
{
    name: String,
    createdAt: Date,
    tasks: [
      {
        name: String,
         description: String,
         done: Boolean,
         dueDate: Date,
         createdAt: Date,
         priority: String (enum: low, medium, high)
      }
    ]
}
```

> Utilise des **sous-documents** pour le tableau `tasks`.

---

## 🛠️ À implémenter

À partir du fichier `openapi.yml`, implémente les routes suivantes :

### `/todolists` (collection)
- `GET`: liste toutes les todo lists
- `POST`: crée une nouvelle todo list avec éventuellement des tâches

### `/todolists/{id}` (document spécifique)
- `GET`: récupère une todo list par ID
- `PUT`: met à jour une todo list (nom et/ou tâches)
- `DELETE`: supprime une todo list

### `/todolists/{id}/tasks`
- `POST`: ajoute une tâche dans une todo list existante

### `/todolists/{id}/tasks/{taskId}`
- `PUT`: met à jour une tâche spécifique d’une todo list
- `DELETE`: supprime une tâche spécifique d’une todo list

---

## 🧪 Données de test

- Clone le repository.
- Installe les dépendances :
  ```bash
  npm install
  ```
- Lance la base avec :
   ```bash
   docker-compose up -d
   ```
- Utilise `seedTodo.js` pour initialiser des données dans la base. (Le script peut être lancé à plusieurs reprises pour réinitialiser les données)
    ```bash
    node seedTodo.js
    ```

---


## 🖥️ Front End (optionnel)

Un **front-end** est disponible à l’URL suivant :  
[https://github.com/Kaylleur/elegant-task-harbor](https://github.com/Kaylleur/elegant-task-harbor)

1. Clone ou télécharge le repository.
2. Installe les dépendances :
   ```bash
   npm install
   ```
3. Démarre le projet :
   ```bash
   npm run dev
   ```
4. Par défaut, l’application front-end va appeler l’API sur **`http://localhost:3000`**.  
   Assure-toi donc que ton serveur Node.js tourne sur ce **port 3000** et qu’il respecte les routes décrites dans `openapi.yml`.

---

## 📝 Conseils

- Utilise `mongoose` pour définir les modèles.
- Gère les cas d’erreurs (`404`, `400`, etc.).
- Utilise des middlewares (`express.json()`, logger si besoin).
- Structure ton code : `models/`, `routes/`, `controllers/` si tu veux.
- Teste avec Postman, Insomnia, ou un front perso.
- Lien Github et commit à envoyer avant 17h15

---

## 🧮 Barème

| Critère                                      | Points |
|----------------------------------------------|--------|
| Modèle `TodoList` avec sous-documents `Task` correctement défini | 4 pts  |
| Route `GET /todolists`                       | 1 pt   |
| Route `POST /todolists`                      | 2 pts  |
| Route `GET /todolists/{id}`                  | 1 pt   |
| Route `PUT /todolists/{id}`                  | 2 pts  |
| Route `DELETE /todolists/{id}`               | 1 pt   |
| Route `POST /todolists/{id}/tasks`           | 2 pts  |
| Route `PUT /todolists/{id}/tasks/{taskId}`   | 2 pts  |
| Route `DELETE /todolists/{id}/tasks/{taskId}`| 1 pts  |
| Respect de la structure du projet (clarté, séparation des fichiers) | 1 pts  |
| Respect de l’OpenAPI (corps/retours attendus) | 2 pts  |
| Utilisation fonctionnelle du front fourni    | 2 pts  |
| Qualité du code (lisibilité, nommage, propreté) | 1 pts  |

**Total : /20 points**

> Barème indicatif, ajustable en fonction de la progression, des efforts et de la rigueur globale.
---

Bonne chance 🚀
