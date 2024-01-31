"use client"
import NavBar from './Menu';
import TitleCard from './Profile';
import GradientTransition from "./back";
import About from "./about";

const App = () => {

  return (
    <div className="">
      <div className=" ">
        <NavBar/>
      </div>
      
      <div className='Main pt-10 bg-slate-600'>
        <div className="absolute justify-center flex-col w-full">
          <TitleCard/>
          <About/>
        </div>
        <div className=' w-full mt-4 bg-gradient-to-t from-black to-slate-600'>
          <GradientTransition/>
        </div>
      </div>
    </div>
  );
};

export default App;
