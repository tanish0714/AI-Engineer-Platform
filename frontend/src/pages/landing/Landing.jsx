import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";

const Landing = () => {
  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />
      <Hero />
    </main>
  );
};

export default Landing;