"use client"
import NavBar from './Menu';
import TitleCard from './Profile';
import GradientTransition from "./backParticleMist";
import About from "./about";
import Projects from "./projects"
import Footer from "./footer.js"
import Highlight from "./highlight.js"

const App = () => {

  return (
    <div className="bg-slate-600">
      <div className=" ">
        <NavBar/>
      </div>
      
      <div className='Main pt-10  bg-slate-600 '>
        <div className="absolute justify-center flex-col w-full">
          <div className=' bg-gradient-to-b from-gray-700 to-95% to-black absolute flex inset-0 -z-10'>
            <GradientTransition/>
          </div>
          <TitleCard/>
          <div id="about">
            <About />
          </div>
          <div id="highlights">
            <Highlight/>
          </div>
          <div id="portfolio">
            {//<Projects/>
            }
          </div>
          <div id="contact">
            <Footer/>
          </div>
          
        </div>

        
        
        
       
      </div>
    </div>
  );
};

export default App;
