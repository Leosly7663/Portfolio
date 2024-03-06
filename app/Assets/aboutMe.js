import React from 'react';
import Image from 'next/image'

const IconImage = (props) => {
    return (
        <Image
            src={props.src}
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
            alt={props.alt}
            className='rounded-full object-cover'
        />
    )
}


const About = () => {

    return (

        <div class="bg-black bg-opacity-20 rounded-3xl p-2 flexitems-center mx-40 mt-96">
            <div className='flex items-center space-x-10 p-4 justify-center'>
                <div class="flex-3 flex justify-center">
                    <Image
                        src="/pfp3.jpg"
                        width={200}
                        height={400}
                        alt="Picture of the author"
                        className='rounded-full object-cover'
                    />
                </div>
                <div class="flex h-full ">
                    <p class="text-white text-8xl">Hi I'm Leo 👋</p>
                </div>
            </div>


            <div class="flex-1 p-10 text-2xl text-gray-300">
                <p class="text-center">
                    With a solid foundation spanning five years in coding and project development, I've recently transitioned into the professional realm, dedicating the last two years to crafting enterprise-grade applications. Powering this portfolio is a dynamic blend of React, Node.js, Next.js, with Vercel serving as the hosting platform.
                    <br></br>
                    My expertise lies in delivering robust software engineering solutions, with a keen focus on microservice development and functional software services. Challenges invigorate me, as they offer opportunities to push boundaries and enhance my skill set continually. I invite you to explore my highlights section, where you'll find a showcase of my object-oriented programming prowess, notably in Python and C.
                </p>
                <div className='flex justify-center space-x-5'>

                    <IconImage src={"/react-2.svg"} alt={"React Icon"} />
                    <IconImage src={"/tailwind-css-2.svg"} alt={"tailwind Icon"} />
                    <IconImage src={"/nodejs-icon.svg"} alt={"nodejs Icon"} />
                    <IconImage src={"/next-js.svg"} alt={"nextjs Icon"} />
                    <IconImage src={"/Vercel_favicon.svg"} alt={"Vercel Icon"} />

                </div>

            </div>
        </div>
    )
}
export default About;