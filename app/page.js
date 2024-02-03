"use client"
import NavBar from './Menu';
import TitleCard from './Profile';
import GradientTransition from "./back";
import About from "./about";
import Projects from "./projects";
import Footer from "./footer.js";

import NewPage from "./newpage.js"
import HomePage from "./homePage.js"
import Link from 'next/link'
 
import { useRouter } from 'next/navigation'
 
export default function App() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/python-HUD')}>
      Dashboard
    </button>
  );
};

