// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { PokemonDetails } from '../../../services/pokemonService';

// interface Pokemon {
//   id: number;
//   name: string;
//   type: string[];
//   stats: {
//     hp: number;
//     attack: number;
//     defense: number;
//     specialAttack: number;
//     specialDefense: number;
//     speed: number;
//   };
//   abilities: string[];
//   moves: string[];
// }

// interface TeamState {
//   teams: {
//     [teamId: string]: Pokemon[];
//   };
//   currentTeamId: string | null;
// }

// const initialState: TeamState = {
//   teams: {},
//   currentTeamId: null,
// };

// // Helper function to transform PokeAPI stats
// const transformPokemonStats = (pokemonDetails: PokemonDetails) => {
//   const statMap = pokemonDetails.stats.reduce((acc, stat) => {
//     switch(stat.stat.name) {
//       case 'hp':
//         acc.hp = stat.base_stat;
//         break;
//       case 'attack':
//         acc.attack = stat.base_stat;
//         break;
//       case 'defense':
//         acc.defense = stat.base_stat;
//         break;
//       case 'special-attack':
//         acc.specialAttack = stat.base_stat;
//         break;
//       case 'special-defense':
//         acc.specialDefense = stat.base_stat;
//         break;
//       case 'speed':
//         acc.speed = stat.base_stat;
//         break;
//     }
//     return acc;
//   }, {
//     hp: 0,
//     attack: 0,
//     defense: 0,
//     specialAttack: 0,
//     specialDefense: 0,
//     speed: 0
//   });

//   return statMap;
// };

// const teamSlice = createSlice({
//   name: 'team',
//   initialState,
//   reducers: {
//     addPokemonToTeam: (state, action: PayloadAction<{
//       teamId: string,
//       pokemonDetails: PokemonDetails
//     }>) => {
//       const { teamId, pokemonDetails } = action.payload;

//       if (!state.teams[teamId]) {
//         state.teams[teamId] = [];
//       }

//       if (state.teams[teamId].length < 6) {
//         state.teams[teamId].push({
//           id: pokemonDetails.id,
//           name: pokemonDetails.name,
//           type: pokemonDetails.types.map(t => t.type.name),
//           stats: transformPokemonStats(pokemonDetails),
//           abilities: pokemonDetails.abilities.map(a => a.ability.name),
//           moves: pokemonDetails.moves.slice(0, 4).map(m => m.move.name)
//         });
//       }
//     },
//     removePokemonFromTeam: (state, action: PayloadAction<{teamId: string, pokemonId: number}>) => {
//       const { teamId, pokemonId } = action.payload;
//       state.teams[teamId] = state.teams[teamId].filter(p => p.id !== pokemonId);
//     },
//     reorderTeam: (state, action: PayloadAction<{teamId: string, sourcePokemonId: number, destinationPokemonId: number}>) => {
//       const { teamId, sourcePokemonId, destinationPokemonId } = action.payload;
//       const team = state.teams[teamId];

//       const sourceIndex = team.findIndex(p => p.id === sourcePokemonId);
//       const destIndex = team.findIndex(p => p.id === destinationPokemonId);

//       const [reorderedPokemon] = team.splice(sourceIndex, 1);
//       team.splice(destIndex, 0, reorderedPokemon);
//     }
//   },

// });

// export const {
//   addPokemonToTeam,
//   removePokemonFromTeam,
//   reorderTeam
// } = teamSlice.actions;
// export default teamSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PokemonDetails } from "../../../services/pokemonService";
import { v4 as uuidv4 } from "uuid";

interface Pokemon {
  id: number;
  name: string;
  type: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: string[];
  moves: string[];
}

interface TeamState {
    teams: {
      [teamId: string]: {
        id: string;
        name: string;
        pokemon: Pokemon[];
      };
    };
    currentTeamId: string | null;
  }

const initialState: TeamState = {
  teams: {},
  currentTeamId: null,
};

// Helper function to transform PokeAPI stats
const transformPokemonStats = (pokemonDetails: PokemonDetails) => {
  const statMap = pokemonDetails.stats.reduce(
    (acc, stat) => {
      switch (stat.stat.name) {
        case "hp":
          acc.hp = stat.base_stat;
          break;
        case "attack":
          acc.attack = stat.base_stat;
          break;
        case "defense":
          acc.defense = stat.base_stat;
          break;
        case "special-attack":
          acc.specialAttack = stat.base_stat;
          break;
        case "special-defense":
          acc.specialDefense = stat.base_stat;
          break;
        case "speed":
          acc.speed = stat.base_stat;
          break;
      }
      return acc;
    },
    {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    }
  );

  return statMap;
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    createNewTeam: {
        reducer: (state, action: PayloadAction<{teamId: string, teamName: string}>) => {
          const { teamId, teamName } = action.payload;
          state.teams[teamId] = {
            id: teamId,
            name: teamName,
            pokemon: [] // Ensure pokemon array is initialized
          };
          state.currentTeamId = teamId;
        },
        prepare: (teamName: string) => {
          const teamId = uuidv4();
          return { 
            payload: { 
              teamId, 
              teamName: teamName || `Team ${Object.keys(initialState.teams).length + 1}` 
            } 
          };
        }
      },
    addPokemonToTeam: (
      state,
      action: PayloadAction<{
        teamId: string;
        pokemonDetails: PokemonDetails;
      }>
    ) => {
      const { teamId, pokemonDetails } = action.payload;

      if (!state.teams[teamId]) {
        throw new Error("Team not found");
      }

      if (state.teams[teamId].pokemon.length < 6) {
        state.teams[teamId].pokemon.push({
          id: pokemonDetails.id,
          name: pokemonDetails.name,
          type: pokemonDetails.types.map(t => t.type.name),
          stats: transformPokemonStats(pokemonDetails),
          abilities: pokemonDetails.abilities.map(a => a.ability.name),
          moves: pokemonDetails.moves.slice(0, 4).map(m => m.move.name),
        });
      }
    },
    removePokemonFromTeam: (
      state,
      action: PayloadAction<{ teamId: string; pokemonId: number }>
    ) => {
      const { teamId, pokemonId } = action.payload;
      state.teams[teamId].pokemon = state.teams[teamId].pokemon.filter(
        p => p.id !== pokemonId
      );
    },
    reorderTeam: (
      state,
      action: PayloadAction<{
        teamId: string;
        sourcePokemonId: number;
        destinationPokemonId: number;
      }>
    ) => {
      const { teamId, sourcePokemonId, destinationPokemonId } = action.payload;
      const team = state.teams[teamId].pokemon;

      const sourceIndex = team.findIndex(p => p.id === sourcePokemonId);
      const destIndex = team.findIndex(p => p.id === destinationPokemonId);

      const [reorderedPokemon] = team.splice(sourceIndex, 1);
      team.splice(destIndex, 0, reorderedPokemon);
    },
    editTeamName: (
      state,
      action: PayloadAction<{ teamId: string; newName: string }>
    ) => {
      const { teamId, newName } = action.payload;
      if (state.teams[teamId]) {
        state.teams[teamId].name = newName;
      }
    },
  },
});

export const {
  createNewTeam,
  addPokemonToTeam,
  removePokemonFromTeam,
  reorderTeam,
  editTeamName,
} = teamSlice.actions;
export default teamSlice.reducer;
