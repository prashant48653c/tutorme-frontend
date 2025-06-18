import Hero from "@/component/landing/Hero";
import Instruction from "@/component/landing/Instruction";
import Offer from "@/component/landing/Offer";
import Tutor from "@/component/landing/Tutor";
import Navbar from "@/component/reusable/Navbar";
import { Onest } from "next/font/google";
 

const OnestFont=Onest({
    subsets:["latin"],
    weight:'400'
})

export default function Home() {
  return (
    <div className={` ${OnestFont.className} w-full h-full `}>
      <Navbar/>
      <Hero/>
      <Tutor/>
      <Offer/>
      <Instruction/>

    </div>
  );
} 
