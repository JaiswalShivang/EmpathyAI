import React, { useState, useEffect } from 'react';

export default function MeditationResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/meditation-resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data.resources);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading resources...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Meditation Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource._id} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{resource.type}</span>
            {resource.type === 'VIDEO' && resource.content && (
              <div className="mt-2">
                <iframe
                  src={resource.content}
                  title={resource.title}
                  className="w-full h-32 rounded"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {resource.type === 'ARTICLE' && resource.content && (
              <div className="mt-2 text-sm">{resource.content}</div>
            )}
            {resource.tags && resource.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {resource.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}