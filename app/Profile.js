import React from 'react';
import pfp from './PFP.jpg'; // with import


const TitleCard = (props) => {
  return (
    <div className="flex items-center p-4">
      <div className="rounded-full overflow-hidden mr-4">
        <img src={pfp} alt="User" className=" w-160 h-160 rounded-full" />
      </div>
      <div>
        <h2 className="text-xl font-bold">{props.title}</h2>
        <p className="text-gray-600">{props.subtitle}</p>
      </div>
    </div>
  );
};

export default TitleCard;
