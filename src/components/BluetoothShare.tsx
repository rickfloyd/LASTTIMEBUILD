import React from 'react';

interface BluetoothShareProps {
  onClose: () => void;
}

const BluetoothShare: React.FC<BluetoothShareProps> = ({ onClose }) => {

  const handleExport = () => {
    const dataToExport = {
      appName: 'AI Quantum Charts',
      timestamp: new Date().toISOString(),
      message: 'This is a file generated from the application, ready for sharing.',
      data: {
        activeMode: 'Long-Term',
        activeTheme: 'LUCID'
      }
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shared-data.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-500 rounded-lg shadow-lg p-6 w-full max-w-md m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">File Share</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="text-gray-300">
          <p className="mb-4">
            This tool allows you to export application data to a file. You can then share this file with other devices using Bluetooth or any other file sharing method.
          </p>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-bold text-white shadow-[0_0_20px_#00BFFF] transition-all"
          >
            Generate and Download File
          </button>
        </div>
      </div>
    </div>
  );
};

export default BluetoothShare;