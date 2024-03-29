import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Select Country");
  const [selectedState, setSelectedState] = useState("Select State");
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [error, setError] = useState(null);

  const fetch = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return "Error fetching data";
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesData = await fetch(
        "https://crio-location-selector.onrender.com/countries"
      );
      if (countriesData === "Error fetching data") {
        setError("Error fetching countries. Please try again later.");
        return;
      }
      setCountries(countriesData);
    };

    fetchCountries();
  }, []);

  const handleCountryChange = async (selectedCountry) => {
    setSelectedCountry(selectedCountry);
    setSelectedState("Select State");
    setSelectedCity("Select City");
    setError(null); // Add this line

    if (selectedCountry === "Select Country") {
      setStates([]);
      setCities([]);
      return;
    }

    const statesData = await fetch(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
    );
    if (statesData === "Error fetching data") {
      setError(
        `Error fetching states for ${selectedCountry}. Please try again later.`
      );
      return;
    }
    setStates(statesData);
    setCities([]);
  };

  const handleStateChange = async (selectedState) => {
    setSelectedState(selectedState);
    setSelectedCity("Select City");
    setError(null); // Add this line

    if (selectedState === "Select State") {
      setCities([]);
      return;
    }

    const citiesData = await fetch(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
    );
    if (citiesData === "Error fetching data") {
      setError(
        `Error fetching cities for ${selectedState}, ${selectedCountry}. Please try again later.`
      );
      return;
    }
    setCities(citiesData);
  };

  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity);
  };

  return (
    <div>
      <div className="heading">
        <h1>Select Location</h1>
      </div>
      <div className="container">
        <select
          className="country"
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          <option value="Select Country">Choose a Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          className="state"
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          disabled={selectedCountry === "Select Country"}
        >
          <option value="Select State">Choose a State</option>
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          className="city"
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={selectedState === "Select State"}
        >
          <option value="Select City">Choose a City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {selectedCity !== "Select City" && (
        <div className="selected-location">
          <p>
            You Selected {selectedCity}, {selectedState}, {selectedCountry}
          </p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
