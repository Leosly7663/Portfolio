import React, { useState } from 'react';
import Select from 'react-select';
import WeatherDisplay from '../Assets/resumeProject.js'; // Assuming this file exists

function Example() {
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  function fetchData(city) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://flask-apiw-eather.vercel.app/api/${city}`);
    xhr.onload = function() {
      if (xhr.status === 200) {
        setData(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  }

  const cities = [
    'Alexandria', 'Algonquin Park (Brent)', 'Algonquin Park (Lake of Two Rivers)', 'Alliston', 'Apsley', 'Armstrong', 'Atikokan', 'Attawapiskat', 'Bancroft', 'Barrie', "Barry's Bay", 'Belleville', 'Big Trout Lake', 'Blind River', 'Bracebridge', 'Brampton', 'Brantford', 'Brockville', "Burk's Falls", 'Burlington', 'Caledon', 'Cambridge', 'Chapleau', 'Chatham-Kent', 'Cobourg', 'Cochrane', 'Collingwood', 'Cornwall', 'Deep River', 'Dorion', 'Dryden', 'Dunchurch', 'Dundalk', 'Ear Falls', 'Earlton', 'Elliot Lake', 'Fort Albany', 'Fort Erie', 'Fort Frances', 'Fort Severn', 'Gananoque', 'Goderich', 'Gogama', 'Gore Bay', 'Gravenhurst', 'Greater Napanee', 'Greater Sudbury', 'Greenstone (Beardmore)', 'Greenstone (Geraldton)', 'Greenstone (Nakina)', 'Guelph', 'Gull Bay', 'Haldimand County', 'Haliburton', 'Halton Hills', 'Hamilton', 'Hawkesbury', 'Hearst', 'Hornepayne', 'Huntsville', 'Ignace', 'Kakabeka Falls', 'Kaladar', 'Kapuskasing', 'Kawartha Lakes (Fenelon Falls)', 'Kawartha Lakes (Lindsay)', 'Kemptville', 'Kenora', 'Killarney', 'Kincardine', 'Kingston', 'Kirkland Lake', 'Kitchener-Waterloo', 'Lake Superior (Provincial Park)', 'Lambton Shores', 'Lansdowne House', 'Leamington', 'Lincoln', 'London', 'Marathon', 'Markham', 'Midland', 'Mine Centre', 'Mississauga', 'Montreal River Harbour', 'Moosonee', 'Morrisburg', 'Mount Forest', 'Muskoka', 'New Tecumseth', 'Newmarket', 'Niagara Falls', 'Nipigon', 'Norfolk', 'North Bay', 'North Perth', 'Oakville', 'Ogoki', 'Orangeville', 'Orillia', 'Oshawa', 'Ottawa (Kanata - Orléans)', 'Ottawa (Richmond - Metcalfe)', 'Owen Sound', 'Oxtongue Lake', 'Parry Sound', 'Peawanuck', 'Pembroke', 'Petawawa', 'Peterborough', 'Pickering', 'Pickle Lake', 'Pikangikum', 'Port Carling', 'Port Colborne', 'Port Elgin', 'Port Perry', 'Prince Edward (Picton)', 'Quinte West', 'Red Lake', 'Renfrew', 'Richmond Hill', 'Rodney', 'Rondeau (Provincial Park)', 'Sachigo Lake', 'Sandy Lake', 'Sarnia', 'Saugeen Shores', 'Sault Ste. Marie', 'Savant Lake', 'Sharbot Lake', 'Shelburne', 'Simcoe', 'Sioux Lookout', 'Sioux Narrows', 'Smiths Falls', 'South Bruce Peninsula', 'St. Catharines', 'St. Thomas', 'Stirling', 'Stratford', 'Strathroy', 'Sudbury (Greater)', 'Sydenham', 'Temiskaming Shores', 'Terrace Bay', 'Thunder Bay', 'Tillsonburg', 'Timmins', 'Tobermory', 'Toronto', 'Toronto Island', 'Trenton', 'Upsala', 'Vaughan', 'Vineland', 'Walkerton', 'Wawa', 'Webequie', 'Welland', 'West Nipissing', 'Westport', 'Whitby', 'White River', 'Wiarton', 'Winchester', 'Windsor', 'Wingham', 'Woodstock', 'Wunnummin Lake'
  ];

  const options = cities.map(city => ({ value: city, label: city })).sort((a, b) => a.label.localeCompare(b.label));

  const handleCityChange = selectedOption => {
    setSelectedCity(selectedOption.value);
    fetchData(selectedOption.value);
  };

  return (
    <div >
      {data ? 
        <div className='flex flex-col items-center'>
        <Select
          className='text-black w-96'
          options={options}
          value={{ value: selectedCity, label: selectedCity }}
          onChange={handleCityChange}
          placeholder="Select City"
          isSearchable
          />
        <WeatherDisplay weatherData={data} />
        </div> 
        :
        <div className='flex flex-col items-center'>
          <Select
          className='text-black w-96'
          options={options}
          value={{ value: selectedCity, label: selectedCity }}
          onChange={handleCityChange}
          placeholder="Select City"
          isSearchable
          />
          <div className='pt-5'>
          <p>
            Please Select A City From The List Above
          </p>
          </div>
        </div>
      }
    </div>
    
  );
}

export default Example;