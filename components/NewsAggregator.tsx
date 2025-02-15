"use client"

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

import { Search, Clock, Newspaper, ExternalLink, Loader2, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import OpenAI from 'openai';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: 'Gleaner' | 'Observer';
  description?: string;
  creator?: string;
  category?: string[];
  content?: string;
}

const NewsAggregator = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'Gleaner' | 'Observer'>('all');
  const [summary, setSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: 'sk-66538260acee404caa2a8f4ddd73167f',
    dangerouslyAllowBrowser: true,
  });

  const fetchArticleContent = async (url: string) => {
    try {
      setArticleLoading(true);
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          return `${data.error} In the meantime, you can read this article at: ${url}`;
        }
        throw new Error(data.error || 'Failed to fetch article');
      }
      
      return data.content;
    } catch (error) {
      console.error('Error fetching article:', error);
      return `Unable to load article content. You can read this article at: ${url}`;
    } finally {
      setArticleLoading(false);
    }
  };

  const handleArticleClick = async (article: NewsItem) => {
    const content = await fetchArticleContent(article.link);
    setSelectedArticle({ ...article, content });
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.creator?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'all' || item.source === selectedSource;
    return matchesSearch && matchesSource;
  });

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
        
        const parser = new DOMParser();
        const gleanerXML = parser.parseFromString(data.gleaner, 'text/xml');
        const observerXML = parser.parseFromString(data.observer, 'text/xml');

        const gleanerItems = Array.from(gleanerXML.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: new Date(item.querySelector('pubDate')?.textContent || '').toLocaleString(),
          description: item.querySelector('description')?.textContent?.trim() || '',
          creator: item.querySelector('dc\\:creator')?.textContent || '',
          source: 'Gleaner' as const,
          category: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '')
        }));

        const observerItems = Array.from(observerXML.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: new Date(item.querySelector('pubDate')?.textContent || '').toLocaleString(),
          description: item.querySelector('description')?.textContent?.trim() || '',
          creator: item.querySelector('dc\\:creator')?.textContent || '',
          source: 'Observer' as const,
          category: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '')
        }));

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

  useEffect(() => {
    const generateAISummary = async () => {
      if (filteredNews.length === 0) return;
      
      setSummaryLoading(true);
      try {
        const topArticles = filteredNews.slice(0, 3)
          .map(item => `${item.title}: ${item.description}`).join('\n\n');
        
        const completion = await openai.chat.completions.create({
          messages: [{
            role: 'system',
            content: 'You are a news assistant. Generate a concise summary of these articles:'
          }, {
            role: 'user',
            content: topArticles
          }],
          model: 'deepseek-chat',
        });

        setSummary(completion.choices[0].message.content || '');
      } catch (error) {
        setSummary('Failed to generate AI summary');
      } finally {
        setSummaryLoading(false);
      }
    };

    generateAISummary();
  }, [filteredNews]);

  if (selectedArticle) {
    return (
      <Card className="max-w-4xl mx-auto bg-white dark:bg-dark-bg border-neutral-200 dark:border-dark-border">
        <CardHeader className="space-y-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to news
          </button>
          <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-dark-text">
            {selectedArticle.title}
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-neutral-600 dark:text-dark-text">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <span className="inline-flex items-center">
                <NewspaperIcon className="h-4 w-4 mr-1" />
                {selectedArticle.source}
              </span>
              {selectedArticle.creator && (
                <span className="inline-flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {selectedArticle.creator}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4" />
              <span>{selectedArticle.pubDate}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {articleLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400" />
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} />
              {selectedArticle.content?.includes('You can read this article at:') && (
                <div className="mt-4 p-4 bg-neutral-50 dark:bg-dark-surface rounded-lg">
                  <p className="text-neutral-600 dark:text-dark-text">{selectedArticle.content}</p>
                  <a 
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                    Open in new tab
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-dark-bg border-neutral-200 dark:border-dark-border">
      <CardHeader className="space-y-6">
        <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-dark-text">
          Business News (Jamaica)
        </CardTitle>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-dark-surface border-neutral-200 dark:border-dark-border text-neutral-900 dark:text-dark-text
                       placeholder-neutral-400 dark:placeholder-neutral-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            {(['all', 'Gleaner', 'Observer'] as const).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors
                  ${selectedSource === source
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-neutral-700'
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.length > 0 && (
              <div className="p-4 bg-neutral-50 dark:bg-dark-surface rounded-lg border border-neutral-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-neutral-900 dark:text-dark-text">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                  News Summary
                  {summaryLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 dark:border-blue-400 ml-2" />
                  )}
                </h3>
                {summary && <p className="text-neutral-600 dark:text-dark-text">{summary}</p>}
              </div>
            )}

            {filteredNews.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border hover:border-blue-500 dark:hover:border-blue-400 transition-all
                         bg-white dark:bg-dark-surface border-neutral-200 dark:border-dark-border cursor-pointer"
                onClick={() => handleArticleClick(item)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <span className={`inline-flex items-center text-sm font-medium
                      ${item.source === 'Gleaner' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-orange-600 dark:text-orange-400'}`}>
                      <NewspaperIcon className="h-4 w-4 mr-1" />
                      {item.source}
                    </span>
                    {item.category?.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-dark-text rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-500 dark:text-dark-text">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">{item.pubDate}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-dark-text hover:text-blue-600 dark:hover:text-blue-400">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-neutral-600 dark:text-dark-text mb-2">{item.description}</p>
                )}

                {item.creator && (
                  <div className="flex items-center text-sm text-neutral-500 dark:text-dark-text">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {item.creator}
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
