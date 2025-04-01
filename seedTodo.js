
const mongoose = require("mongoose");

const priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
}

// 1. Définition du schéma
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  done: { type: Boolean, default: false },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  priority: { type: String, enum: Object.values(priority), default: priority.MEDIUM },
});

const todoListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tasks: [taskSchema],
});

// 2. Modèle Mongoose
const TodoList = mongoose.model("TodoList", todoListSchema);

// 3. Script de seed
async function seedDatabase() {
  try {
    // Connexion à la base "todolistdb" (à adapter si besoin)
    await mongoose.connect("mongodb://localhost:27017/todolist");
    console.log("Connecté à MongoDB");

    // Vider la (les) collection(s) concernée(s)
    // Ici on supprime toutes les données de la collection "todolists"
    await TodoList.deleteMany({});
    console.log("Collection TodoList vidée !");

    // Données de seed
    const data = [
      {
        name: "Courses",
        tasks: [
          {
            title: "Acheter du lait",
            description: "2 litres de lait",
            priority: priority.HIGH,
          },
          {
            title: "Acheter des œufs",
            description: "6 œufs",
            priority: priority.MEDIUM,
          },
          {
            title: "Acheter du pain",
            description: "1 baguette",
            priority: priority.LOW,
          },
        ],
      },
      {
        name: "Travail",
        tasks: [
          {
            title: "Terminer le rapport",
            description: "Pour la réunion de lundi",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            priority: priority.HIGH,
          },
          {
            title: "Répondre aux emails",
            priority: priority.MEDIUM,
          },
        ],
      },
      {
        name: "Vacances",
        tasks: [
          {
            title: "Réserver hôtel",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            priority: priority.LOW,
          },
          {
            title: "Préparer la valise",
            description: "Vêtements, crème solaire, etc.",
            priority: priority.LOW,
          },
        ],
      },
    ];

    // Insertion en base
    const insertedLists = await TodoList.insertMany(data);
    console.log(`${insertedLists.length} listes insérées dans la base.`);

    // Fin du script, on ferme la connexion
    await mongoose.disconnect();
    console.log("Déconnexion réussie.");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base :", error);
    // En cas d'erreur, on s'assure de fermer la connexion
    await mongoose.disconnect();
  }
}

// Lancement du script
seedDatabase();
