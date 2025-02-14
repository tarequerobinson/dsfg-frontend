'use client';

import React, { useState, useEffect } from 'react';
import { Search, Clock, Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: 'Gleaner' | 'Observer';
  description?: string;
  creator?: string;
  category?: string[];
}

const NewsAggregator = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'Gleaner' | 'Observer'>('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/rss');
        if (!response.ok) {
          throw new Error('Failed to fetch news feeds');
        }

        const data = await response.json();
        
        // Parse XML to DOM
        const parser = new DOMParser();
        const gleanerXML = parser.parseFromString(data.gleaner, 'text/xml');
        const observerXML = parser.parseFromString(data.observer, 'text/xml');

        // Process Gleaner news
        const gleanerItems = Array.from(gleanerXML.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: new Date(item.querySelector('pubDate')?.textContent || '').toLocaleString(),
          description: item.querySelector('description')?.textContent?.trim() || '',
          creator: item.querySelector('dc\\:creator')?.textContent || '',
          source: 'Gleaner' as const,
          category: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '')
        }));

        // Process Observer news
        const observerItems = Array.from(observerXML.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: new Date(item.querySelector('pubDate')?.textContent || '').toLocaleString(),
          description: item.querySelector('description')?.textContent?.trim() || '',
          creator: item.querySelector('dc\\:creator')?.textContent || '',
          source: 'Observer' as const,
          category: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '')
        }));

        // Combine and sort by date
        const allNews = [...gleanerItems, ...observerItems].sort((a, b) => 
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

        setNews(allNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.creator?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'all' || item.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="space-y-6">
        <CardTitle className="text-2xl font-bold">Jamaica News Aggregator</CardTitle>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Source Filter */}
          <div className="flex space-x-2">
            {(['all', 'Gleaner', 'Observer'] as const).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedSource === source
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {source === 'all' ? 'All Sources' : source}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Newspaper className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm font-medium ${
                      item.source === 'Gleaner' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {item.source}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{item.pubDate}</span>
                  </div>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">
                    {item.title}
                    <ExternalLink className="inline-block ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                </a>

                {item.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}

                {item.creator && (
                  <p className="text-sm text-gray-500">By {item.creator}</p>
                )}

                {item.category && item.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.category.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsAggregator;