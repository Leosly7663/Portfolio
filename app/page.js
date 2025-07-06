"use client";

import NavBar from './Components/Menu.tsx';
import TitleCard from './Assets/Profile.js';
import GradientTransition from "./Assets/backParticleMist.js";
import ExperienceTimeline from "./Assets/experienceTimeline.js";
import About from "./Assets/about.js";
import Footer from "./Assets/footer.js";
import Fetch from "./Components/Fetch.js";
import Highlight from "./Assets/highlights.js";
import Projects from "./Assets/projects.js"

const AppWithExperience = () => {

  return (
    <div className="bg-slate-600">
      <NavBar />

      <div className='Main pt-10 bg-slate-600'>
        <div className="absolute justify-center flex-col">
          <div className='bg-gradient-to-b from-gray-700 to-95% to-black absolute flex inset-0 -z-10'>
            <GradientTransition />
          </div>

          <TitleCard />

          <div id="about">
            <About />
          </div>

          <div id="experience">
            <ExperienceTimeline />
          </div>

          <div id="projects">
            <Projects />
          </div>

          <div id="highlights">
            <Highlight />
          </div>

          <div id="contact">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppWithExperience;
