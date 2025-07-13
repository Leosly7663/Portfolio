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
            numStars={150}
            sizeRange={[1, 3.5]}
            parallaxFactor={4.2}
            colorPalette={["#ffffff", "#ffeaa7", "#81ecec"]}
            colorWeights={[0.6, 0.2, 0.2]}
            animationConfig={{
              fadeInSpeed: 0.008,
              fadeOutSpeed: 0.01,
              movementSpeed: 0.2,
              maxLifeRange: [400, 800],
            }}
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
