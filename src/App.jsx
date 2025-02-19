import React, { useState, useEffect } from 'react';
import ScoreBest from './components/ScoreBest';

function App() {
  // State to hold our Pokémon data (each with a name and image URL)
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [clicked, setClicked] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  function addPoke(name){
    setClicked([...clicked, name])
    console.log(clicked)
  }

  useEffect(() => {
    // First, fetch a list of 10 Pokémon
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon list');
        }
        return response.json();
      })
      .then(data => {
        // data.results is an array of Pokémon objects with name and URL for details
        // Create an array of promises to fetch details for each Pokémon
        const pokemonDetailsPromises = data.results.map(pokemon =>
          fetch(pokemon.url).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch details for ${pokemon.name}`);
            }
            return response.json();
          })
        );
        // Wait for all the Pokémon details to be fetched
        return Promise.all(pokemonDetailsPromises);
      })
      .then(pokemonDetails => {
        // Map over the details to extract name and the front image URL
        const pokemonData = pokemonDetails.map(detail => ({
          name: detail.name,
          image: detail.sprites.front_default
        }));
        setPokemons(pokemonData);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }, []);


  const shuffleArray = () => {
    const newArray = [...pokemons];

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setPokemons(newArray)
  };

  function clickedOrNot(clicked, pokemon){
    if(clicked.includes(pokemon)){
        if(score > bestScore){
          setBestScore(score);
          setClicked([]);
        }
        setScore(0);
    }
    else{
        setScore(score+1)
        console.log(score)
    }
}

  return (
    <div>
      <h1>Pokémon Memory game</h1>
      <div id='score'>
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>
      <div >
        <ul className=' flex'>
          {pokemons.map(pokemon => (
            <div key={pokemon.name} className=' p-5' onClick={() => {
              shuffleArray();
              addPoke(pokemon.name);
              clickedOrNot(clicked, pokemon.name);
            }}
          >
              <img src={pokemon.image} alt={pokemon.name} />
              <p>{pokemon.name}</p>
            </div>
          ))}

        </ul>

      </div>

    </div>
  );
}

export default App;
