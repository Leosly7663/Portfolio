"use client";

import NavBar from "./Components/Menu";
import TitleCard from "./Assets/Profile";
import About from "./Assets/about";
import ExperienceTimeline from "./Assets/experienceTimeline";
import Projects from "./Assets/projects";
import Footer from "./Assets/footer.js";

const App = () => {
  return (
    <div className="min-h-screen text-slate-900">
      <NavBar />
      <main id="top" className="relative overflow-hidden pb-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.16),_transparent_28%)]" />
        <TitleCard />
        <div id="about">
          <About />
        </div>
        <div id="highlights">
          <Projects />
        </div>
        <div id="experience">
          <ExperienceTimeline />
        </div>
        <div id="contact">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;
