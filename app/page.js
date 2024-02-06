"use client"

import Navbar from "./components/navbar";
import Faucet from "./components/faucet";
import Footer from "./components/footer";


const Home = () => {    
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <Faucet />
      </div>
      <Footer />
    </>
  );
}

export default Home;