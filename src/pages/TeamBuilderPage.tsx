import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { PlusCircle, Trash2, Info, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  pokemonService,
  PokemonBasicInfo,
} from "../../services/pokemonService";
import { RootState } from "../../store";
import {
  addPokemonToTeam,
  removePokemonFromTeam,
  reorderTeam,
  createNewTeam,
} from "../../store/features/team/teamSlice";

const TeamBuilderPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId?: string }>();

  const teams = useSelector((state: RootState) => state.team.teams);

  // Use a ref to track if team initialization has been done
  const [isTeamInitialized, setIsTeamInitialized] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const currentTeam = selectedTeamId
    ? teams[selectedTeamId]?.pokemon || []
    : [];

  // Fetch Pokémon list
  const { data: pokemonList, isLoading } = useQuery<PokemonBasicInfo[]>({
    queryKey: ["pokemonList"],
    queryFn: () => pokemonService.fetchPokemonList(50),
  });

  useEffect(() => {
    // Ensure the team is properly initialized when component mounts
    const initializeCurrentTeam = () => {
      // If teamId is provided and exists in teams, use it
      if (teamId && teams[teamId]) {
        setSelectedTeamId(teamId);
        setIsTeamInitialized(true);
        return;
      }
  
      // If no specific teamId, but we have teams
      if (Object.keys(teams).length > 0) {
        // Use the last created team or the first team
        const latestTeamId = Object.keys(teams)[Object.keys(teams).length - 1];
        setSelectedTeamId(latestTeamId);
        setIsTeamInitialized(true);
        return;
      }
  
      // If no teams exist, create a new one
      const newTeamName = `Team ${Object.keys(teams).length + 1}`;
      dispatch(createNewTeam(newTeamName));
      setIsTeamInitialized(true);
    };
  
    initializeCurrentTeam();
  }, [teamId, teams, dispatch]);
  
  // Add a useEffect to update URL after team is created
  useEffect(() => {
    if (isTeamInitialized && selectedTeamId) {
      navigate(`/team-builder/${selectedTeamId}`, { replace: true });
    }
  }, [isTeamInitialized, selectedTeamId, navigate]);

  // Handle adding Pokémon to team
  const handleAddPokemon = async (basicPokemon: PokemonBasicInfo) => {
    if (!selectedTeamId) return;

    if (currentTeam.length < 6) {
      try {
        const pokemonDetails = await pokemonService.fetchPokemonDetails(
          basicPokemon.id
        );

        dispatch(
          addPokemonToTeam({
            teamId: selectedTeamId,
            pokemonDetails,
          })
        );
      } catch (error) {
        console.error("Failed to fetch Pokémon details", error);
      }
    }
  };

  // Handle removing Pokémon from team
  const handleRemovePokemon = (pokemonId: number) => {
    if (!selectedTeamId) return;

    dispatch(
      removePokemonFromTeam({
        teamId: selectedTeamId,
        pokemonId,
      })
    );
  };

  // Handle viewing Pokémon details
  const handleViewPokemonDetails = (pokemonId: number) => {
    navigate(`/pokemon/${pokemonId}`);
  };

  // Handle saving team
  const handleSaveTeam = () => {
    navigate("/dashboard");
  };

  // Handle drag and drop reordering
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !selectedTeamId) return;

    dispatch(
      reorderTeam({
        teamId: selectedTeamId,
        sourcePokemonId: currentTeam[result.source.index].id,
        destinationPokemonId: currentTeam[result.destination.index].id,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-pokemon-dark p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pokemon-primary">
            Team Builder
          </h1>
          <button
            onClick={handleSaveTeam}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <Save className="mr-2" /> Save Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Team Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {teams[selectedTeamId || ""]?.name || "Current Team"}
            </h2>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="team">
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {currentTeam.map((pokemon, index) => (
                      <Draggable
                        key={pokemon.id}
                        draggableId={pokemon.id.toString()}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                          >
                            <span className="capitalize">{pokemon.name}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleRemovePokemon(pokemon.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={20} />
                              </button>
                              <button
                                onClick={() =>
                                  handleViewPokemonDetails(pokemon.id)
                                }
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Info size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {currentTeam.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No Pokémon in your team yet
              </p>
            )}
          </div>

          {/* Pokémon Selection Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Available Pokémon</h2>

            {isLoading ? (
              <p>Loading Pokémon...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pokemonList?.map(pokemon => (
                  <div
                    key={pokemon.id}
                    className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
                  >
                    <img
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm capitalize">{pokemon.name}</p>
                    <button
                      onClick={() => handleAddPokemon(pokemon)}
                      disabled={currentTeam.length >= 6}
                      className={`absolute bottom-2 right-2 ${
                        currentTeam.length >= 6
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-pokemon-primary hover:text-red-600"
                      }`}
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilderPage;
