import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "Courses — Buddy JIT" },
      {
        name: "description",
        content:
          "15 international-standard courses across 4 categories. Unlock each one with the code your mentor gives you.",
      },
    ],
  }),
});

type Course = { code: string; title: string; desc: string; siTitle?: string };
type Category = { n: string; title: string; courses: Course[] };

const categories: Category[] = [
  {
    n: "Category 1",
    title: "Foundation / Core Sciences",
    courses: [
      { code: "FM", title: "Foundation Mathematics", desc: "Algebra, geometry, applied math" },
      { code: "PB", title: "Physics Basics", desc: "Motion, energy, materials" },
      { code: "CAD", title: "Computer-Aided Design", desc: "2D & 3D design fundamentals" },
      { code: "EN", title: "Technical English", desc: "Workshop & engineering English" },
    ],
  },
  {
    n: "Category 2",
    title: "Mechanical Engineering & Manufacturing",
    courses: [
      { code: "WT", title: "Workshop Technology", desc: "Workshop tools & practice" },
      { code: "MS", title: "Mechanical Systems", desc: "Machines, gears, bearings" },
      { code: "HP", title: "Hydraulics & Pneumatics", desc: "Fluid power systems" },
      { code: "CNC", title: "CNC Machining", desc: "Computer numerical control" },
    ],
  },
  {
    n: "Category 3",
    title: "Electrical & Automation",
    courses: [
      { code: "EB", title: "Electrical Basics", desc: "Circuits, safety, wiring" },
      { code: "PLC", title: "PLC & Automation", desc: "Industrial control systems" },
      { code: "RB", title: "Intro to Robotics", desc: "Sensors, motors, logic" },
    ],
  },
  {
    n: "Category 4",
    title: "Agriculture & Sustainability",
    courses: [
      {
        code: "AG",
        title: "Agriculture Basic Syllabus",
        siTitle: "කෘෂිකර්ම මූලික පාඨමාලාව",
        desc: "Foundations of agriculture (60-day Sinhala course)",
      },
      { code: "OF", title: "Organic Farming", desc: "Soil, compost, integrated pest care" },
      { code: "SI", title: "Smart Irrigation", desc: "Water-efficient growing systems" },
      { code: "AB", title: "Agri Business", desc: "Markets, finance, value chains" },
    ],
  },
];

function CourseCard({ course }: { course: Course }) {
  const [code, setCode] = useState("");
  return (
    <div className="border border-border p-6 flex flex-col bg-background">
      <div className="flex justify-between items-start mb-6">
        <div className="font-serif text-2xl text-accent tracking-wide">{course.code}</div>
        <div className="text-[10px] tracking-display uppercase text-muted-foreground">
          60-day
        </div>
      </div>
      <h3 className="font-serif text-xl mb-1">{course.title}</h3>
      {course.siTitle && (
        <p className="font-sinhala text-sm text-muted-foreground mb-1">
          {course.siTitle}
        </p>
      )}
      <p className="text-sm text-muted-foreground flex-1">{course.desc}</p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter unlock code"
          className="flex-1 bg-transparent border-b border-border text-xs py-1 focus:outline-none focus:border-accent placeholder:text-muted-foreground"
        />
        <button className="text-[11px] tracking-display uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
          Open →
        </button>
      </div>
    </div>
  );
}

function CoursesPage() {
  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">
            — Buddy JIT Course
          </div>
          <h1 className="font-serif text-6xl md:text-8xl mb-8">Courses</h1>
          <p className="text-muted-foreground max-w-xl">
            15 international-standard courses across 4 categories. Unlock each
            one with the code your mentor gives you.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 md:px-12 pb-32 space-y-20">
          {categories.map((cat) => (
            <div key={cat.n}>
              <div className="flex items-baseline gap-8 mb-8 border-b border-border pb-4">
                <div className="text-[11px] tracking-display uppercase text-muted-foreground">
                  {cat.n}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl">{cat.title}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cat.courses.map((c) => (
                  <CourseCard key={c.code} course={c} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
