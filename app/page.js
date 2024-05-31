"use client";

import Faucet from "./components/faucet";
import Footer from "./components/footer";

const Home = () => {
  return (
    <>
      <div className="flex justify-center">
        <Faucet />
      </div>
      <Footer />
    </>
  );
};

export default Home;
