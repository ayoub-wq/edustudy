import React, { FC, useState } from 'react';
import type { Student } from '../types';
import { useToast } from '../hooks/useToast';
import SpinnerIcon from './icons/SpinnerIcon';
import useLocalStorageState from '../hooks/useLocalStorageState';
import ArrowPathIcon from './icons/ArrowPathIcon';

const mockStudents: Student[] = [
  { id: 's1', name: 'Alice Johnson', major: 'Computer Science', courses: ['CS101', 'MA203'], avatarUrl: 'https://picsum.photos/seed/alice/100/100' },
  { id: 's2', name: 'Bob Williams', major: 'Physics', courses: ['PHY301', 'MA203'], avatarUrl: 'https://picsum.photos/seed/bob/100/100' },
  { id: 's3', name: 'Charlie Brown', major: 'English Literature', courses: ['LIT120'], avatarUrl: 'https://picsum.photos/seed/charlie/100/100' },
  { id: 's4', name: 'Diana Prince', major: 'Quantum Engineering', courses: ['PHY301', 'CS101'], avatarUrl: 'https://picsum.photos/seed/diana/100/100' },
  { id: 's5', name: 'Ethan Hunt', major: 'Computer Science', courses: ['CS101'], avatarUrl: 'https://picsum.photos/seed/ethan/100/100' },
  { id: 's6', name: 'Fiona Glenanne', major: 'Chemistry', courses: ['CHEM201', 'PHY301'], avatarUrl: 'https://picsum.photos/seed/fiona/100/100' },
];

const StudentCard: FC<{ student: Student; onConnect: (id: string) => void; connectingId: string | null }> = ({ student, onConnect, connectingId }) => {
  const isConnecting = connectingId === student.id;
  const isConnected = student.isConnected;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
      <img src={student.avatarUrl} alt={student.name} className="w-24 h-24 rounded-full shadow-md border-4 border-white" />
      <h3 className="text-xl font-bold text-slate-800 mt-4">{student.name}</h3>
      <p className="text-blue-600 font-semibold text-sm">{student.major}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {student.courses.map(course => (
          <span key={course} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">{course}</span>
        ))}
      </div>
      <button 
        onClick={() => onConnect(student.id)}
        disabled={isConnecting || isConnected}
        className={`mt-6 w-full font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center min-h-[40px] 
          ${isConnected 
            ? 'bg-green-500 text-white cursor-default' 
            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400'
          }`
        }
      >
        {isConnecting ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Connecting...
            </>
          ) : isConnected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
};

const PartnerSection: FC = () => {
  const [students, setStudents] = useLocalStorageState<Student[]>('students', mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleConnect = (studentId: string) => {
    setConnectingId(studentId);
    setTimeout(() => {
      let studentName = '';
      setStudents(prevStudents => prevStudents.map(student => {
        if (student.id === studentId) {
          studentName = student.name;
          return { ...student, isConnected: true };
        }
        return student;
      }));
      addToast(`Connection request sent to ${studentName}!`, 'success');
      setConnectingId(null);
    }, 1000);
  };
  
  const handleResetData = () => {
    setStudents(mockStudents);
    addToast('Partner data has been reset.', 'info');
  };

  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(term) ||
      student.major.toLowerCase().includes(term) ||
      student.courses.some(course => course.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8">
      <div className="md:flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Find a Study Partner</h2>
          <p className="text-slate-500 mt-1">Connect with students in your courses and excel together.</p>
        </div>
         <button
          onClick={handleResetData}
          className="mt-4 md:mt-0 flex items-center text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Reset Data
        </button>
      </div>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search by name, course, or major..."
          className="w-full p-4 pl-12 text-lg border-2 border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for a study partner"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} onConnect={handleConnect} connectingId={connectingId}/>
          ))
        ) : (
          <p className="text-slate-500 col-span-full text-center py-8">No students found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default PartnerSection;
