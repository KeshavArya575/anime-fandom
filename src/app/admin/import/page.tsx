// app/admin/import/page.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input'; // Import shadcn/ui components
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [seriesName, setSeriesName] = useState('');

  const handleSpecificImport = async () => {
    if (!seriesName) {
      setMessage('Please enter a series name.');
      return;
    }
    setIsLoading(true);
    setMessage(`Importing "${seriesName}"...`);
    
    const response = await fetch('/api/import-series-by-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesName }),
    });
    const result = await response.json();
    setMessage(result.message || result.error);
    setIsLoading(false);
  };
  
  // ... (Your existing handleCharacterImport and handleSeriesImport functions can stay if you want them)

  return (
    <div className="p-8 space-y-12">
      <div className="max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Import Specific Series</h1>
          <p className="mt-2 text-gray-600">Enter the exact name of a series to import or update it from AniList.</p>
        </div>
        <div>
          <Label htmlFor="seriesName">Series Name</Label>
          <Input
            id="seriesName"
            type="text"
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            placeholder="e.g., Fate/Zero"
            className="mt-2"
          />
        </div>
        <Button onClick={handleSpecificImport} disabled={isLoading} className="w-full">
          {isLoading ? 'Importing...' : 'Import by Name'}
        </Button>
      </div>

      {message && (
        <p className={`mt-4 text-sm font-medium ${message.includes('Error') || message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}