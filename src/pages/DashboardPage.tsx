import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { logout } from "../../store/features/auth/authSlice";
import {
  createNewTeam,
  editTeamName,
} from "../../store/features/team/teamSlice";
import { LogOut, Plus, Edit } from "lucide-react";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { teams } = useSelector((state: RootState) => state.team);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleCreateTeam = () => {
    const teamName = `Team ${Object.keys(teams).length + 1}`;
    dispatch(createNewTeam(teamName));
    navigate(`/team-builder`);
  };

  const handleEditTeam = (teamId: string) => {
    navigate(`/team-builder/${teamId}`);
  };

  const handleStartEditTeamName = (teamId: string, currentName: string) => {
    setEditingTeamId(teamId);
    setNewTeamName(currentName);
  };

  const handleSaveTeamName = (teamId: string) => {
    dispatch(editTeamName({ teamId, newName: newTeamName }));
    setEditingTeamId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-pokemon-dark p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pokemon-primary">
            Welcome, {user?.username}!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Pokémon Teams</h2>
            <button
              onClick={handleCreateTeam}
              className="flex items-center bg-pokemon-primary text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              <Plus className="mr-2" /> Create Team
            </button>
          </div>

          {Object.keys(teams).length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>You haven't created any teams yet.</p>
              <p>Click "Create Team" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(teams).map(([teamId, team]) => (
                <div
                  key={teamId}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    {editingTeamId === teamId ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newTeamName}
                          onChange={e => setNewTeamName(e.target.value)}
                          className="px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => handleSaveTeamName(teamId)}
                          className="text-green-500 hover:text-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">{team.name}</h3>
                        <button
                          onClick={() =>
                            handleStartEditTeamName(teamId, team.name)
                          }
                          className="text-gray-500 hover:text-gray-600"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handleEditTeam(teamId)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit Team
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {team.pokemon.map(pokemon => (
                      <div
                        key={pokemon.id}
                        className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
                      >
                        {pokemon.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
