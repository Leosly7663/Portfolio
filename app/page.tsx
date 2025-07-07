"use client";
import NavBar from './Components/Menu';
import TitleCard from './Assets/Profile';
import About from "./Assets/about";
import GradientTransition from "./Assets/backParticleMist";
import ExperienceTimeline from "./Assets/experienceTimeline";
import Projects from "./Assets/projects";
import Footer from "./Assets/footer.js";

const App = () => {
  return (
    <div className="relative min-h-screen bg-slate-600 overflow-hidden">
      {/* Background particles (auto full-screen + z-index) */}
      <GradientTransition />

      {/* Foreground content */}
      <NavBar />
      <main className="pt-10 relative z-10">
        <TitleCard />
        <div id="about"><About /></div>
        <div id="highlights"><Projects /></div>
        <div id="timeline"><ExperienceTimeline /></div>
        <div id="contact"><Footer /></div>
      </main>
    </div>
  );
};

export default App;
