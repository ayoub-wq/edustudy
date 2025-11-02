import React, { FC, useState } from 'react';
import type { StudyGroup } from '../types';
import UsersIcon from './icons/UsersIcon';
import XMarkIcon from './icons/XMarkIcon';
import { useToast } from '../hooks/useToast';
import SpinnerIcon from './icons/SpinnerIcon';
import useLocalStorageState from '../hooks/useLocalStorageState';
import ArrowPathIcon from './icons/ArrowPathIcon';

const mockGroups: StudyGroup[] = [
  { id: 'g1', name: 'CS101 Final Review', courseCode: 'CS101', members: 4, capacity: 5 },
  { id: 'g2', name: 'Algebra Problem Solvers', courseCode: 'MA203', members: 2, capacity: 4 },
  { id: 'g3', name: 'Quantum Minds', courseCode: 'PHY301', members: 5, capacity: 5 },
  { id: 'g4', name: 'Modernism Discussion', courseCode: 'LIT120', members: 3, capacity: 6 },
];

const StudyGroupCard: FC<{ group: StudyGroup; onJoin: (id: string) => void; joiningId: string | null }> = ({ group, onJoin, joiningId }) => {
  const isFull = group.members >= group.capacity;
  const isJoining = joiningId === group.id;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-blue-600">{group.courseCode}</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{group.name}</h3>
        </div>
        <div className="bg-red-500 p-3 rounded-full shadow-md">
          <UsersIcon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>Members</span>
          <span>{group.members} / {group.capacity}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(group.members / group.capacity) * 100}%` }}
          ></div>
        </div>
      </div>
      <button 
        onClick={() => onJoin(group.id)}
        disabled={isFull || !!joiningId}
        className="mt-6 w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px]"
      >
        {isJoining ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Joining...
          </>
        ) : isFull ? 'Group Full' : 'Join Group'}
      </button>
    </div>
  );
};

const StudyGroupSection: FC = () => {
  const [groups, setGroups] = useLocalStorageState<StudyGroup[]>('studyGroups', mockGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', courseCode: '', capacity: 4 });
  const [isCreating, setIsCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleJoinGroup = (groupId: string) => {
    setJoiningId(groupId);
    setTimeout(() => {
      let groupJoined = false;
      let isGroupFull = false;
      setGroups(prevGroups => prevGroups.map(group => {
        if (group.id === groupId) {
          if (group.members < group.capacity) {
            groupJoined = true;
            return { ...group, members: group.members + 1 };
          } else {
            isGroupFull = true;
          }
        }
        return group;
      }));

      if (groupJoined) {
        addToast('Successfully joined the group!', 'success');
      } else if (isGroupFull) {
        addToast('This group is now full.', 'info');
      }
      setJoiningId(null);
    }, 1000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
  }

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name.trim() || !newGroup.courseCode.trim()) {
      addToast('Please provide a group name and course code.', 'error');
      return;
    }
    setIsCreating(true);
    setTimeout(() => {
        const newGroupData: StudyGroup = {
          id: `g${Date.now()}`,
          members: 1,
          name: newGroup.name,
          courseCode: newGroup.courseCode,
          capacity: newGroup.capacity,
        };
        setGroups([newGroupData, ...groups]);
        setIsCreating(false);
        setIsModalOpen(false);
        setNewGroup({ name: '', courseCode: '', capacity: 4 });
        addToast('New study group created!', 'success');
    }, 1500);
  };

  const handleResetData = () => {
    setGroups(mockGroups);
    addToast('Study group data has been reset.', 'info');
  };


  return (
    <div className="space-y-8">
      <div className="md:flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Study Groups</h2>
          <p className="text-slate-500 mt-1">Collaborate with your peers. Find or create a study group.</p>
        </div>
        <button
          onClick={handleResetData}
          className="mt-4 md:mt-0 flex items-center text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Reset Data
        </button>
      </div>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full md:w-auto bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-600 transition-colors transform hover:scale-105"
      >
        + Create New Group
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <StudyGroupCard key={group.id} group={group} onJoin={handleJoinGroup} joiningId={joiningId}/>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
            <style>{`
              @keyframes fade-in-scale {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
            `}</style>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Create New Study Group</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full" disabled={isCreating}>
                <span className="sr-only">Close</span>
                <XMarkIcon className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Group Name</label>
                <input type="text" name="name" id="name" value={newGroup.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Final Exam Cram" required disabled={isCreating}/>
              </div>
              <div>
                <label htmlFor="courseCode" className="block text-sm font-medium text-slate-700">Course Code</label>
                <input type="text" name="courseCode" id="courseCode" value={newGroup.courseCode} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., CS101" required disabled={isCreating}/>
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-slate-700">Capacity</label>
                <input type="number" name="capacity" id="capacity" min="2" max="10" value={newGroup.capacity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" disabled={isCreating}/>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-200 transition-colors" disabled={isCreating}>Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px]" disabled={isCreating}>
                    {isCreating ? <SpinnerIcon className="animate-spin h-5 w-5 text-white" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupSection;
