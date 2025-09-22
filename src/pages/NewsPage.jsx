import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-farm-green mb-6">Farming News & Guides</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {news.map(article => (
            <div key={article.id} className="card">
              <h2 className="text-2xl font-bold text-farm-green mb-2">{article.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{new Date(article.createdAt.seconds * 1000).toLocaleDateString()}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
