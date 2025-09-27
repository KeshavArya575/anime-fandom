// app/admin/import/page.tsx
'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    setIsLoading(true);
    setMessage('Starting import... This may take a minute.');

    try {
      const response = await fetch('/api/import', { method: 'POST' });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Something went wrong');
      setMessage(result.message);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Import Characters</h1>
      <p className="mb-4 text-gray-600">Click the button to import all characters from the Fate/stay night category.</p>
      
      <button
        onClick={handleImport}
        disabled={isLoading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Importing...' : 'Start Import'}
      </button>

      {message && (
        <p className={`mt-4 text-sm font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}