"use client"

import React, { useState, useEffect } from 'react';
import NavBar from './Menu';
import TitleCard from './Profile';
import logo from './PFP.jpg'


const App = () => {

  return (
    <div className="">
          <NavBar/>
        
        <div className='Main pt-10 bg-slate-600'>
          <TitleCard 
          />
          <div>
            
          </div>
          <div>
            
          </div>
          <div>
            
          </div>
        </div>

    </div>
  );
};

export default App;
