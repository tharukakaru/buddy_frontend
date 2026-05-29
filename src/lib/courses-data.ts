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
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=900&q=80`;

// CHANGED: code values updated to match subject_code in Supabase that actually have days linked
export const COURSES: Course[] = [
  { id: "pd",  code: "PD",                         title: "PD Training / Special Program",  desc: "Personal development & special foundation program.", category: "Foundation", hours: 96, days: 12, level: "All Levels", tag: "Bestseller", image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "en",  code: "EN",                         title: "English",                         desc: "Technical & workshop English.",                        category: "Foundation", hours: 96, days: 12, level: "All Levels", image: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "bc",  code: "Basic Calculations",          title: "Basic Calculations",              siTitle: "මූලික ගණිතය", desc: "Foundation math for engineering trades.", category: "Foundation", hours: 96, days: 12, level: "All Levels", tag: "Bestseller", image: "https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "ef",  code: "Engineering Fundamentals",    title: "Engineering Fundamentals",        desc: "Core engineering principles.",                          category: "Engineering", hours: 96, days: 20, level: "Beginner", image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "ed",  code: "Engineering Drawing",         title: "Engineering Drawing",             desc: "Technical drawing & blueprint reading.",                category: "Engineering", hours: 96, days: 12, level: "All Levels", image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "ict", code: "ICT",                         title: "ICT",                             desc: "Information & communication technology.",               category: "Technology", hours: 96, days: 12, level: "All Levels", image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "el",  code: "Electrical",                  title: "Electrical",                      desc: "Circuits, safety, wiring fundamentals.",                category: "Electrical", hours: 96, days: 24, level: "Beginner", image: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "elc", code: "Electronics",                 title: "Electronics",                     desc: "Analog and digital electronics.",                       category: "Electrical", hours: 96, days: 32, level: "All Levels", image: "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "plc", code: "PLC",                         title: "PLC",                             desc: "Industrial PLC & automation.",                          category: "Automation", hours: 96, days: 12, level: "Advanced", tag: "Premium", image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "wt",  code: "WT",                          title: "Workshop Technology",             desc: "Workshop tools, practices and safety.",                 category: "Mechanical", hours: 96, days: 12, level: "All Levels", image: "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "mc",  code: "MC",                          title: "Machining",                       desc: "Turning, milling and CNC basics.",                      category: "Mechanical", hours: 96, days: 12, level: "All Levels", tag: "New", image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
  { id: "hp",  code: "Hydraulics and Pneumatics",   title: "Hydraulics and Pneumatics",       desc: "Fluid power systems.",                                  category: "Mechanical", hours: 96, days: 16, level: "All Levels", image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=900", longDesc: "", whatYouLearn: [], includes: [] },
];

export const SAMPLE_DAY = {
  day: 1,
  topic: "Introduction",
  intro: "Today we set the foundation for the next 12 days.",
  subTopics: [
    "Overview", "Core concepts", "Tools & setup", "First exercises",
    "Common pitfalls", "Practice routine", "Daily quiz format", "Mentor support",
    "Resources", "Notation", "Reading materials", "Glossary",
    "Self-assessment", "Next-day preview", "Wrap-up",
  ],
  summary: "Score 10+ on the quiz to advance to the intermediate track.",
};

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
    image: fallback?.image ?? "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900",
    longDesc: fallback?.longDesc ?? "",
    whatYouLearn: fallback?.whatYouLearn ?? [],
    includes: fallback?.includes ?? [],
  };
}
