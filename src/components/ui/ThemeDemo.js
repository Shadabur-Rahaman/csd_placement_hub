import React, { useState } from 'react';
import GradientSelect from './GradientSelect';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeDemo = () => {
  const { theme } = useTheme();
  const [selectedFramework, setSelectedFramework] = useState('html');

  const frameworks = [
    { value: 'html', label: 'HTML' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ];

  const handleFrameworkChange = (e) => {
    setSelectedFramework(e.target.value);
  };

  return (
    <div className={`p-8 rounded-xl ${theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-800 shadow-xl'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Framework Selection
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className={`block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
            Select your preferred framework:
          </label>
          <GradientSelect 
            options={frameworks} 
            defaultValue={selectedFramework}
            onChange={handleFrameworkChange}
          />
        </div>
        
        <div className={`mt-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
            You selected: <span className="font-semibold">{frameworks.find(f => f.value === selectedFramework)?.label}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo; 