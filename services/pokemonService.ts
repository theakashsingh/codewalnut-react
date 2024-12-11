import axios from 'axios';

const POKEAPI_BASE_URL = import.meta.env.VITE_POKEMON_BASE_API;

export interface PokemonBasicInfo {
  id: number;
  name: string;
  types: string[];
  sprites: {
    front_default: string;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { 
    base_stat: number; 
    stat: { name: string } 
  }[];
  abilities: { 
    ability: { name: string } 
    is_hidden: boolean 
  }[];
  moves: { 
    move: { name: string } 
  }[];
  sprites: {
    front_default: string;
  };
}

export const pokemonService = {
  async fetchPokemonList(limit: number = 50, offset: number = 0) {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
      params: { limit, offset }
    });

    // Fetch details for each Pokémon
    const detailedPokemon = await Promise.all(
      response.data.results.map(async (pokemon: { url: string }) => {
        const detailResponse = await axios.get(pokemon.url);
        return detailResponse.data;
      })
    );

    return detailedPokemon.map((pokemon: PokemonDetails) => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map(type => type.type.name),
      sprites: pokemon.sprites,
    }));
  },

  async fetchPokemonDetails(id: number): Promise<PokemonDetails> {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
    return response.data;
  },
};