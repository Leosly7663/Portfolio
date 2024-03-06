import React, { useState } from 'react';

function Example() {
  const [data, setData] = useState(null);

  function handleClick() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://flask-apiw-eather.vercel.app/api/Guelph');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        setData(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  }

  return (
    <div>
      <button onClick={handleClick}>Get Data</button>
      {data ? <div>{JSON.stringify(data)}</div> : <div>Loading...</div>}
      <div>{JSON.stringify(data)}</div>
    </div>
    
  );
}

export default Example;