import React, { FC, useState } from 'react';
import type { Course } from '../types';
import UploadIcon from './icons/UploadIcon';
import DownloadIcon from './icons/DownloadIcon';
import { useToast } from '../hooks/useToast';
import SpinnerIcon from './icons/SpinnerIcon';
import useLocalStorageState from '../hooks/useLocalStorageState';
import ArrowPathIcon from './icons/ArrowPathIcon';

const mockCourses: Course[] = [
  { id: 'c1', code: 'CS101', name: 'Intro to Computer Science', instructor: 'Dr. Alan Turing', fileUrl: '#' },
  { id: 'c2', code: 'MA203', name: 'Linear Algebra', instructor: 'Dr. Ada Lovelace', fileUrl: '#' },
  { id: 'c3', code: 'PHY301', name: 'Quantum Mechanics', instructor: 'Dr. Marie Curie', fileUrl: '#' },
  { id: 'c4', code: 'LIT120', name: 'Modernist Literature', instructor: 'Dr. Virginia Woolf', fileUrl: '#' },
];

const CourseCard: FC<{ course: Course }> = ({ course }) => {
  const { addToast } = useToast();

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    addToast(`Downloading materials for ${course.name}...`, 'info');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-blue-600">{course.code}</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{course.name}</h3>
          <p className="text-slate-500 text-sm mt-1">Instructor: {course.instructor}</p>
        </div>
         <div className="bg-red-500 p-3 rounded-full shadow-md">
          <DownloadIcon className="w-5 h-5 text-white" />
         </div>
      </div>
      <a 
        href={course.fileUrl} 
        onClick={handleDownload}
        className="mt-6 inline-flex justify-center items-center w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
      >
        Download Materials
      </a>
    </div>
  );
};

const CourseSection: FC = () => {
  const [courses, setCourses] = useLocalStorageState<Course[]>('courses', mockCourses);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', instructor: '' });
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = () => {
    if (!fileName || !newCourse.code.trim() || !newCourse.name.trim() || !newCourse.instructor.trim()) {
      addToast('Please fill all fields and select a file.', 'error');
      return;
    }
    setIsUploading(true);
    setTimeout(() => { // Simulate network request
      const createdCourse: Course = {
        id: `c${Date.now()}`,
        code: newCourse.code.toUpperCase(),
        name: newCourse.name,
        instructor: newCourse.instructor,
        fileUrl: '#',
      };
      
      setCourses([createdCourse, ...courses]);
      setIsUploading(false);
      addToast(`Material for "${createdCourse.name}" uploaded successfully!`, 'success');
      
      // Reset form
      setFileName(null);
      setNewCourse({ code: '', name: '', instructor: '' });
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }, 1500);
  };

  const handleResetData = () => {
    setCourses(mockCourses);
    addToast('Course data has been reset.', 'info');
  };

  const isUploadDisabled = !fileName || !newCourse.code.trim() || !newCourse.name.trim() || !newCourse.instructor.trim() || isUploading;

  return (
    <div className="space-y-8">
      <div className="md:flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Course Materials</h2>
          <p className="text-slate-500 mt-1">Upload your notes or download materials from your courses.</p>
        </div>
        <button
          onClick={handleResetData}
          className="mt-4 md:mt-0 flex items-center text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Reset Data
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Upload New Material</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-700">Course Code</label>
                <input type="text" name="code" id="code" value={newCourse.code} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., CS101" required disabled={isUploading}/>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Course Name</label>
                <input type="text" name="name" id="name" value={newCourse.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Intro to CS" required disabled={isUploading}/>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="instructor" className="block text-sm font-medium text-slate-700">Instructor</label>
                <input type="text" name="instructor" id="instructor" value={newCourse.instructor} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Dr. Alan Turing" required disabled={isUploading}/>
            </div>
        </div>

        <div className="mt-4 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <UploadIcon className="w-6 h-6 text-red-500" />
          </div>
          <label htmlFor="file-upload" className="mt-4 cursor-pointer inline-block bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
            {fileName ? `Selected: ${fileName}` : 'Choose a file'}
          </label>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isUploading} />
          <p className="text-xs text-slate-500 mt-2">PDF, DOCX, PPT up to 10MB</p>
          <button 
            onClick={handleUpload}
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            disabled={isUploadDisabled}
          >
            {isUploading ? (
              <>
                <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseSection;
