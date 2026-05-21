import  { useEffect, useState } from 'react';
import axios from 'axios';
import "../../components/Heroes/Heroes.css"
import calculateHeroStrengthPower from "../../utils/heroStrength"

export default function HeroesFromAPI(){

     const [heroes, setHeroes] = useState([]);
  const [ error, setError] = useState('');

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/heroes');
        setHeroes(response.data);
      } catch {
        setError('Failed to fetch heroes');
      }
    };
    fetchHeroes();
  }, []);

    if (error) return <h1>{error}</h1>;
    if (!heroes || heroes.length==0) return <p>No heroes available</p>

    return(
        <ul className='hero-list' >
            {heroes.map(hero=>(
              <li key={hero.id}> {hero.name}: power={calculateHeroStrengthPower(hero.strength)} </li>
            ))}
        </ul>
    )
}