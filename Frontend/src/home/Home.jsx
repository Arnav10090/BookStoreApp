import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import FeaturedBook from "../components/FeaturedBook";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <FeaturedBook />
      <Footer />
    </>
  );
}

export default Home;
