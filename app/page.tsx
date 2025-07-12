"use client"
import NavBar from './Components/Menu';
import TitleCard from './Assets/Profile';
import About from "./Assets/about"
import StarFieldBackground from "./Assets/backParticleMist";
import ExperienceTimeline from "./Assets/experienceTimeline";
import Projects from "./Assets/projects"
import Footer from "./Assets/footer.js"
import Fetch from "./Components/Fetch.js"
import Highlight from "./Assets/highlights.js"

const App = () => {


  return (
    <div className="bg-slate-600">
      <div className=" ">
        <NavBar />
      </div>

      <div className='Main pt-10  bg-slate-600 '>
        <div className="absolute justify-center flex-col w-full">
          <div className=' bg-gradient-to-b from-gray-700 to-95% to-black absolute flex h-full inset-0 -z-10'>
            <StarFieldBackground
            numStars={200}
            sizeRange={[.2, 3.5]}
            parallaxFactor={2}
            colorPalette={["#ffdd99", "#ffa4a3", "#ffdfaa"]} // orange, red, yellow
            colorWeights={[0.2, 0.5, 0.3]} // 20% orange, 50% red, 30% yellow
          />
          </div>
          <TitleCard />
          <div id="about">
            <About />
          </div>
          <div id="highlights">
            <Projects />
          </div>
           <div id="highlights">
            <ExperienceTimeline />
          </div>
           
          <div id="contact">
            <Footer />
          </div>

        </div>





      </div>
    </div>
  );
};

export default App;
