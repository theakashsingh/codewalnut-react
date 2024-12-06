import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '../../services/pokemonService';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ['pokemonDetails', id],
    queryFn: () => pokemonService.fetchPokemonDetails(Number(id)),
    enabled: !!id
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>Pokémon not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-pokemon-dark p-6">
      <div className="container mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-pokemon-primary mb-6 hover:text-red-600"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center">
            {/* Pokémon Image */}
            <div className="w-64 h-64 flex items-center justify-center">
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="ml-0 md:ml-8 w-full">
              {/* Basic Info */}
              <h1 className="text-3xl font-bold capitalize text-pokemon-primary mb-4">
                {pokemon.name}
              </h1>

              {/* Types */}
              <div className="flex space-x-2 mb-4">
                {pokemon.types.map((type) => (
                  <span 
                    key={type.type.name}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm capitalize"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Base Stats</h2>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center">
                      <div className="w-32 capitalize">{stat.stat.name}</div>
                      <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-pokemon-primary h-2.5 rounded-full" 
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        ></div>
                      </div>
                      <div>{stat.base_stat}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Abilities</h2>
                <div className="flex space-x-2">
                  {pokemon.abilities.map((ability) => (
                    <span 
                      key={ability.ability.name}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm capitalize"
                    >
                      {ability.ability.name}
                      {ability.is_hidden && ' (Hidden)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Moves */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Moves</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {pokemon.moves.slice(0, 6).map((move) => (
                    <span 
                      key={move.move.name}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm capitalize"
                    >
                      {move.move.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;