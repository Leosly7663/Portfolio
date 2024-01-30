import React from 'react';
import OpacityToggle from './Opacity.js'
import pfp from './PFP.jpg'; // with import


const TitleCard = () => {
  return (
    <div className="flex  justify-center mt-5 pt-5">
      <div className="rounded-full overflow-hidden bg-emerald-600">
        <img src={pfp} alt="User" className="w-160 h-160 rounded-full bg-emerald-200" />
      </div>
      <div className="font-sans bg-slate-600">
        <div className="font-semibold text-4xl text-center ">
          <div className="text text-[#2bff00]">
              root@Leo: 
              <div className="text text-[#00a2ff]">
                  ~ 
              </div>
              <div className="text text-[#e6e6e6]">
                $ Hello World!
                <OpacityToggle text="_"/>   
              </div>
            </div>
            </div>
        <h3 className="text-gray-600 font-serif text-center">It seems you've found my website!</h3>
        <p className="text-gray-600">You're here because something about me caught your eye. I have so much more to tell you about myself so please feel free to explore this site all about</p>
        <p className="text-gray-600">Leo</p>
      </div>
    </div>
  );
};

export default TitleCard;
