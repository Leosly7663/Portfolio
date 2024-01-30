"use client"

import React, { useState, useEffect } from 'react';
import NavBar from './Menu';
import TitleCard from './Profile';
import logo from './PFP.jpg'


const App = () => {

  return (
    <div className="body">
          <NavBar/>
        
        <div className='Main pt-10'>
          <div className='align-self-center'>
            <TitleCard 
            title="Hello World!" 
            subtitle="My name is Leonardo Pietro Nigro and this is my profile"
            />
          </div>
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
