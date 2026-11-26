
export const studio = {
  name: "Nova Studio"
};

// Salon–ders eşleşmesi README'deki "Salonlar ve dersler" bölümünden alındı.
export const rooms = [
  {
    name: "Performans Salonu",
    lessons: ["Fitness", "Kişisel Antrenman"]
  },
  {
    name: "Reformer Salonu",
    lessons: ["Reformer", "Pilates"]
  },
  {
    name: "Denge Salonu",
    lessons: ["Yoga", "Meditasyon"]
  }
];

export const members = [
  "Ada", "Can", "Ela", "Mina",
  "Ali", "Ege", "Su", "Arda",
  "Nil", "Lara", "Mert", "Ekin",
  "Selin"
];

export const trainers = [
  "Ece", "Deniz", "Mert", "İpek"
];

export const sessions = [
  {
    id: 1,
    time: "17.00",
    lesson: "Reformer",
    room: "Reformer Salonu",
    trainer: "Ece"
  },
  {
    id: 2,
    time: "18.00",
    lesson: "Fitness",
    room: "Performans Salonu",
    trainer: "Deniz"
  },
  {
    id: 3,
    time: "19.00",
    lesson: "Yoga",
    room: "Denge Salonu",
    trainer: "Mert"
  }
];
