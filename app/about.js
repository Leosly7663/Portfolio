import React from 'react';
import Image from 'next/image'

const About = () => {

    return(
    <div class="bg-black bg-opacity-20 rounded-lg p-2 flex items-center mx-10 mt-80">

        <div class="flex-1 flex justify-center bg-green-300">
        <Image
          src="/PFP.jpg"
          width={500}
          height={500}
          alt="Picture of the author"
          className='rounded-full h-24 w-24 object-cover'
        />
        </div>


        <div class="flex-1 ml-4">
            <div class="flex flex-col h-full bg-blue-200">

                <div class="h-3/10 bg-red-200">

                    <p class="text-white text-lg">Your photo description goes here.</p>
                </div>
                <div class="h-7/10">

                    <p class="text-white">Your text description goes here.</p>
                </div>
            </div>
        </div>
    </div>
    )
}
export default About;