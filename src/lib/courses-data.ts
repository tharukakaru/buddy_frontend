export type Course = {
  id: string;
  code: string;
  title: string;
  siTitle?: string;
  desc: string;
  category: string;
  hours: number;
  days: number;
  level: "Beginner" | "All Levels" | "Advanced";
  tag?: "Bestseller" | "Premium" | "New";
  image: string;
  longDesc: string;
  whatYouLearn: string[];
  includes: string[];
};

const cover = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=800&q=70`;

export const COURSES: Course[] = [
  {
    id: "msm-basic-calc",
    code: "BC",
    title: "Basic Calculations / Mathematics",
    siTitle: "මූලික ගණිතය",
    desc: "Foundation math for Multi Skill Maintenance Craftsman NVQ L3/L4.",
    category: "Foundation / Core Sciences",
    hours: 96,
    days: 12,
    level: "All Levels",
    tag: "Bestseller",
    image: cover("1635070041078-e363dbe005cb"),
    longDesc:
      "A 12-day intensive in core mathematics for engineering trades. The platform adapts to your level: Beginner, Intermediate, or Advanced — each daily quiz score recalibrates tomorrow's lesson plan, with Buddy AI standing by when you get stuck.",
    whatYouLearn: [
      "Apply algebra and geometry to workshop calculations",
      "Convert units and read engineering drawings with confidence",
      "Solve trade-relevant trigonometry and mensuration",
      "Pass NVQ L3/L4 numerical assessments",
    ],
    includes: ["8 hours/day for 12 days", "15 MCQ daily quiz", "Adaptive AI tutoring", "Certificate of completion"],
  },
  { id: "fm", code: "FM", title: "Foundation Mathematics", desc: "Algebra, geometry, applied math.", category: "Foundation / Core Sciences", hours: 96, days: 12, level: "Beginner", image: cover("1509228468518-180dd4864904"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "pb", code: "PB", title: "Physics Basics", desc: "Motion, energy, materials.", category: "Foundation / Core Sciences", hours: 96, days: 12, level: "Beginner", image: cover("1636466497217-26a8cbeaf0aa"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "cad", code: "CAD", title: "Computer-Aided Design", desc: "2D & 3D design fundamentals.", category: "Foundation / Core Sciences", hours: 96, days: 12, level: "All Levels", tag: "Premium", image: cover("1581091226825-a6a2a5aee158"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "en", code: "EN", title: "Technical English", desc: "Workshop & engineering English.", category: "Foundation / Core Sciences", hours: 96, days: 12, level: "All Levels", image: cover("1456513080510-7bf3a84b82f8"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "wt", code: "WT", title: "Workshop Technology", desc: "Workshop tools & practice.", category: "Mechanical Engineering & Manufacturing", hours: 96, days: 12, level: "All Levels", image: cover("1581092918056-0c4c3acd3789"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "ms", code: "MS", title: "Mechanical Systems", desc: "Machines, gears, bearings.", category: "Mechanical Engineering & Manufacturing", hours: 96, days: 12, level: "All Levels", image: cover("1565043666747-69f6646db940"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "hp", code: "HP", title: "Hydraulics & Pneumatics", desc: "Fluid power systems.", category: "Mechanical Engineering & Manufacturing", hours: 96, days: 12, level: "All Levels", tag: "New", image: cover("1581093588401-fbb62a02f120"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "cnc", code: "CNC", title: "CNC Machining", desc: "Computer numerical control.", category: "Mechanical Engineering & Manufacturing", hours: 96, days: 12, level: "Advanced", tag: "Premium", image: cover("1565793298595-6a879b1d9492"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "eb", code: "EB", title: "Electrical Basics", desc: "Circuits, safety, wiring.", category: "Electrical & Automation", hours: 96, days: 12, level: "Beginner", image: cover("1473341304170-971dccb5ac1e"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "plc", code: "PLC", title: "PLC & Automation", desc: "Industrial control systems.", category: "Electrical & Automation", hours: 96, days: 12, level: "Advanced", image: cover("1518770660439-4636190af475"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "rb", code: "RB", title: "Intro to Robotics", desc: "Sensors, motors, logic.", category: "Electrical & Automation", hours: 96, days: 12, level: "All Levels", tag: "New", image: cover("1535378620166-273708d44e4c"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "ag", code: "AG", title: "Agriculture Basic Syllabus", siTitle: "කෘෂිකර්ම මූලික පාඨමාලාව", desc: "Foundations of agriculture (Sinhala course).", category: "Agriculture & Sustainability", hours: 480, days: 60, level: "Beginner", image: cover("1500382017468-9049fed747ef"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "of", code: "OF", title: "Organic Farming", desc: "Soil, compost, integrated pest care.", category: "Agriculture & Sustainability", hours: 96, days: 12, level: "All Levels", image: cover("1530836369250-ef72a3f5cda8"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "si", code: "SI", title: "Smart Irrigation", desc: "Water-efficient growing.", category: "Agriculture & Sustainability", hours: 96, days: 12, level: "All Levels", image: cover("1416879595882-3373a0480b5b"), longDesc: "", whatYouLearn: [], includes: [] },
  { id: "ab", code: "AB", title: "Agri Business", desc: "Markets, finance, value chains.", category: "Agriculture & Sustainability", hours: 96, days: 12, level: "All Levels", image: cover("1542838132-92c53300491e"), longDesc: "", whatYouLearn: [], includes: [] },
];

export const SAMPLE_DAY = {
  day: 1,
  topic: "Introduction to Engineering Mathematics",
  intro:
    "Engineering mathematics is the language of every workshop and design. Today we set the foundation — numbers, units, and the way we'll think about problems for the next 12 days.",
  subTopics: [
    "What engineering mathematics is", "Number systems used on the shop floor", "SI units & conversions",
    "Significant figures & precision", "Order of operations", "Fractions in workshop measurement",
    "Decimals & rounding", "Ratios & proportions", "Percentages in costing",
    "Reading workshop tables", "Estimation techniques", "Common calculation pitfalls",
    "Tools: calculator, slide rule, app", "Notation & symbols", "Setting up your daily practice",
  ],
  summary:
    "You've met the foundations. Tomorrow we'll start applying these to algebra you'll use every day on the floor. Score 10+ on the quiz and you'll move to the intermediate track.",
};
