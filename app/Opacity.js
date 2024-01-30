import React, { useState, useEffect } from 'react';

function OpacityToggle(props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prevVisible) => !prevVisible);
    }, 500);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures that effect runs only once

  return (
    <span style={{display: 'inline', opacity: visible ? 1 : 0}}>
      <p className='text'>{props.text}</p>
    </span>
  );
}

export default OpacityToggle;