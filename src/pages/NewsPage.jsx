import React, { useState } from 'react';
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const sampleNews = [
  {
    id: 1,
    title: 'The Future of Sustainable Farming',
    createdAt: { seconds: 1679339400 }, // March 20, 2023
    content: `Sustainable farming is more important than ever. New technologies in drip irrigation and soil health are paving the way for a greener future.\n\nKey practices include:\n- Crop rotation\n- Cover cropping\n- Reduced tillage\n- Integrated pest management`,
  },
  {
    id: 2,
    title: 'Bumper Harvest Expected for Wheat This Season',
    createdAt: { seconds: 1679253000 }, // March 19, 2023
    content: `Farmers are reporting excellent conditions for wheat crops this year. Favorable weather and low instances of disease are contributing to an expected bumper harvest. Market prices are expected to be stable.`,
  },
  {
    id: 3,
    title: 'A Guide to Organic Pest Control',
    createdAt: { seconds: 1679166600 }, // March 18, 2023
    content: `Going organic? Natural pest control is a great way to keep your crops healthy without synthetic chemicals. Consider introducing beneficial insects like ladybugs and lacewings to your farm. Neem oil and companion planting are also effective strategies.`,
  },
];

export default function NewsPage() {
  const [news] = useState(sampleNews);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl mt-6 font-bold text-center text-farm-green mb-6">Farming News & Guides</h1>

      <div className="space-y-6">
        {news.map(article => (
          <div key={article.id} className="card">
            <h2 className="text-2xl font-bold text-farm-green mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{new Date(article.createdAt.seconds * 1000).toLocaleDateString()}</p>
            <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
