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
//
const cover = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=900&q=80`;

export const COURSES: Course[] = [
  {
    id: "pd",
    code: "PD",
    title: "PD Training / Special Program",
    desc: "Personal development & special foundation program.",
    category: "Foundation",
    hours: 96,
    days: 12,
    level: "All Levels",
    tag: "Bestseller",
    image: cover("1523240795612-9a054b0db644"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "en",
    code: "EN",
    title: "English",
    desc: "Technical & workshop English.",
    category: "Foundation",
    hours: 96,
    days: 12,
    level: "All Levels",
    image: cover("1457369804613-52c61a468e7d"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "bc",
    code: "BC",
    title: "Basic Calculations",
    siTitle: "මූලික ගණිතය",
    desc: "Foundation math for engineering trades.",
    category: "Foundation",
    hours: 96,
    days: 12,
    level: "All Levels",
    tag: "Bestseller",
    image: cover("1509228627152-72ae9ae6848d"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "ef",
    code: "EF",
    title: "Engineering Fundamentals",
    desc: "Core engineering principles.",
    category: "Engineering",
    hours: 96,
    days: 12,
    level: "Beginner",
    image: cover("1581092160562-40aa08e78837"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "ed",
    code: "ED",
    title: "Engineering Drawing",
    desc: "Technical drawing & blueprint reading.",
    category: "Engineering",
    hours: 96,
    days: 12,
    level: "All Levels",
    image: cover("1503387762-592deb58ef4e"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "ict",
    code: "ICT",
    title: "ICT",
    desc: "Information & communication technology.",
    category: "Technology",
    hours: 96,
    days: 12,
    level: "All Levels",
    image: cover("1518770660439-4636190af475"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "el",
    code: "EL",
    title: "Electrical",
    desc: "Circuits, safety, wiring fundamentals.",
    category: "Electrical",
    hours: 96,
    days: 12,
    level: "Beginner",
    image: cover("1565608087341-404b25492cee"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "elc",
    code: "ELC",
    title: "Electronics",
    desc: "Analog and digital electronics.",
    category: "Electrical",
    hours: 96,
    days: 12,
    level: "All Levels",
    image: cover("1518770660439-4636190af475"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "plc",
    code: "PLC",
    title: "PLC",
    desc: "Industrial PLC & automation.",
    category: "Automation",
    hours: 96,
    days: 12,
    level: "Advanced",
    tag: "Premium",
    image: cover("1581094794329-c8112a89af12"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "wt",
    code: "WT",
    title: "Workshop Technology",
    desc: "Workshop tools, practices and safety.",
    category: "Mechanical",
    hours: 96,
    days: 12,
    level: "All Levels",
    image: cover("1504917595217-d4dc5ebe6122"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "mc",
    code: "MC",
    title: "Machining",
    desc: "Turning, milling and CNC basics.",
    category: "Mechanical",
    hours: 96,
    days: 12,
    level: "All Levels",
    tag: "New",
    image: cover("1581093588401-fbb62a02f120"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
  {
    id: "hp",
    code: "HP",
    title: "Hydraulics and Pneumatics",
    desc: "Fluid power systems.",
    category: "Mechanical",
    hours: 96,
    days: 12,
    level: "All Levels",
    image: cover("1565939643937-8c4cd1faaaa8"),
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  },
];

export function getCourseByCodeOrId(value: string) {
  const normalized = value.toLowerCase();
  return COURSES.find(
    (course) => course.id.toLowerCase() === normalized || course.code.toLowerCase() === normalized,
  );
}

export function getCourseBySubject(value: string) {
  const normalized = value.toLowerCase();
  return (
    getCourseByCodeOrId(value) ??
    COURSES.find(
      (course) =>
        course.title.toLowerCase() === normalized || course.siTitle?.toLowerCase() === normalized,
    )
  );
}

export function courseFromSubject(subject: { subject_code: string; title: string }): Course {
  const fallback = getCourseBySubject(subject.subject_code) ?? getCourseBySubject(subject.title);

  return {
    id: subject.subject_code,
    code: subject.subject_code,
    title: subject.title || fallback?.title || subject.subject_code,
    siTitle: fallback?.siTitle,
    desc: fallback?.desc ?? "International-standard Buddy JIT course content.",
    category: fallback?.category ?? "Foundation",
    hours: fallback?.hours ?? 96,
    days: fallback?.days ?? 12,
    level: fallback?.level ?? "All Levels",
    tag: fallback?.tag,
    image: fallback?.image ?? cover("1523240795612-9a054b0db644"),
    longDesc: fallback?.longDesc ?? "",
    whatYouLearn: fallback?.whatYouLearn ?? [],
    includes: fallback?.includes ?? [],
  };
}

export const SAMPLE_DAY = {
  day: 1,
  topic: "Introduction",
  intro: "Today we set the foundation for the next 12 days.",
  subTopics: [
    "Overview",
    "Core concepts",
    "Tools & setup",
    "First exercises",
    "Common pitfalls",
    "Practice routine",
    "Daily quiz format",
    "Mentor support",
    "Resources",
    "Notation",
    "Reading materials",
    "Glossary",
    "Self-assessment",
    "Next-day preview",
    "Wrap-up",
  ],
  summary: "Score 10+ on the quiz to advance to the intermediate track.",
};
