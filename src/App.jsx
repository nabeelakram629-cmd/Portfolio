import { useLayoutEffect } from "react";
import { About } from "./components/About.jsx";
import { Contact } from "./components/Contact.jsx";
import { Experience } from "./components/Experience.jsx";
import { Faq } from "./components/Faq.jsx";
import { FloatBar } from "./components/FloatBar.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { Nav } from "./components/Nav.jsx";
import { Peek } from "./components/Peek.jsx";
import { Process } from "./components/Process.jsx";
import { Services } from "./components/Services.jsx";
import { Skills } from "./components/Skills.jsx";
import { Sprite } from "./components/Sprite.jsx";
import { Tagline } from "./components/Tagline.jsx";
import { Trusted } from "./components/Trusted.jsx";
import { Work } from "./components/Work.jsx";
import { start3d } from "./animations3d.js";
import { startPageAnimations } from "./pageAnimations.js";
import { runEngine } from "./engine/runEngine.js";
import { watchFeatured } from "./screenshots.js";

export default function App() {
  useLayoutEffect(() => {
    let stopEngine = () => {};
    let stop3d = () => {};
    const stopShots = watchFeatured();
    const stopPage = startPageAnimations(() => {
      stopEngine = runEngine();
      stop3d = start3d();
    });
    return () => {
      stopShots();
      stopPage();
      stop3d();
      stopEngine();
    };
  }, []);

  return (
    <>
      <Sprite />
      <Nav />
      <main id="main">
        <Hero />
        <Trusted />
        <About />
        <Services />
        <Work />
        <Tagline />
        <Process />
        <Experience />
        <Skills />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatBar />
      <Peek />
    </>
  );
}
