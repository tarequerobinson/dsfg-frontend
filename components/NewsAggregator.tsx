"use client"

import { useState, useEffect } from "react"
import {
  MagnifyingGlassIcon,
  ClockIcon,
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import ReactMarkdown from "react-markdown"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import OpenAI from "openai"
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline"




interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: "Gleaner" | "Observer"
  description?: string
  creator?: string
  category?: string[]
  content?: string
}

const ITEMS_PER_PAGE = 10

const NewsAggregator = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<"all" | "Gleaner" | "Observer">("all")
  const [summary, setSummary] = useState<string>("")
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false);
const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
const [audioError, setAudioError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);




  const fetchArticleContent = async (url: string) => {
    try {
      setArticleLoading(true)
      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          return `${data.error} In the meantime, you can read this article at: ${url}`
        }
        throw new Error(data.error || "Failed to fetch article")
      }

      return data.content
    } catch (error) {
      console.error("Error fetching article:", error)
      return `Unable to load article content. You can read this article at: ${url}`
    } finally {
      setArticleLoading(false)
    }
  }

  const handleArticleClick = async (article: NewsItem) => {
    const content = await fetchArticleContent(article.link)
    setSelectedArticle({ ...article, content })
  }



  const handleTextToSpeech = async () => {
    // If already playing, stop the current audio
    if (isPlaying && audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlaying(false);
      return;
    }
  
    setIsLoading(true);
    setAudioError(null);
  
    // Create an AbortController for the fetch request
    const abortController = new AbortController();
  
    try {
      // Clean up previous audio if it exists
      if (audioRef) {
        audioRef.pause();
        URL.revokeObjectURL(audioRef.src);
        setAudioRef(null);
      }
  
      if (!summary.trim()) {
        throw new Error('No text available to play');
      }
  
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
        signal: abortController.signal
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }
  
      const contentType = response.headers.get('Content-Type');
      if (!contentType?.includes('audio/mpeg')) {
        throw new Error('Invalid audio format received');
      }
  
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Received empty audio data');
      }
  
      const audio = new Audio();
      
      // Set up event listeners before setting the source
      const audioLoadPromise = new Promise((resolve, reject) => {
        audio.addEventListener('loadeddata', resolve, { once: true });
        audio.addEventListener('error', () => {
          const error = audio.error;
          reject(new Error(error ? `Audio error: ${error.message}` : 'Error loading audio'));
        }, { once: true });
      });
  
      // Create object URL and set it as the audio source
      const audioUrl = URL.createObjectURL(blob);
      audio.src = audioUrl;
  
      // Wait for audio to load
      await audioLoadPromise;
  
      // Set up playback event listeners
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        // Keep the URL for potential replay
      });
  
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });
  
      // Start playback
      await audio.play();
      setAudioRef(audio);
      setIsPlaying(true);
  
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Audio request was cancelled');
      } else {
        console.error('Audio playback error:', error);
        setAudioError(error instanceof Error ? error.message : 'Error playing audio');
      }
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  
    // Return cleanup function
    return () => {
      abortController.abort();
    };
  };
  
  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        URL.revokeObjectURL(audioRef.src);
      }
    };
  }, [audioRef]);
      




  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === "all" || item.source === selectedSource
    return matchesSearch && matchesSource
  })

  const paginatedNews = filteredNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/rss")
        if (!response.ok) {
          throw new Error("Failed to fetch news feeds")
        }

        const data = await response.json()

        const parser = new DOMParser()
        const gleanerXML = parser.parseFromString(data.gleaner, "text/xml")
        const observerXML = parser.parseFromString(data.observer, "text/xml")

        const gleanerItems = Array.from(gleanerXML.querySelectorAll("item")).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: new Date(item.querySelector("pubDate")?.textContent || "").toLocaleString(),
          description: item.querySelector("description")?.textContent?.trim() || "",
          creator: item.querySelector("dc\\:creator")?.textContent || "",
          source: "Gleaner" as const,
          category: Array.from(item.querySelectorAll("category")).map((cat) => cat.textContent || ""),
        }))

        const observerItems = Array.from(observerXML.querySelectorAll("item")).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: new Date(item.querySelector("pubDate")?.textContent || "").toLocaleString(),
          description: item.querySelector("description")?.textContent?.trim() || "",
          creator: item.querySelector("dc\\:creator")?.textContent || "",
          source: "Observer" as const,
          category: Array.from(item.querySelectorAll("category")).map((cat) => cat.textContent || ""),
        }))

        const allNews = [...gleanerItems, ...observerItems].sort(
          (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
        )

        setNews(allNews)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

// Add these to your component
const [lastSummaryTime, setLastSummaryTime] = useState<number>(0)
const SUMMARY_COOLDOWN = 30000 // 30 seconds

useEffect(() => {
  const generateAISummary = async () => {
    if (filteredNews.length === 0 || 
        Date.now() - lastSummaryTime < SUMMARY_COOLDOWN ||
        summaryLoading
    ) return

    try {
      setSummaryLoading(true)
      const topArticles = filteredNews.slice(0, 50)

      const response = await fetch("/api/summarize-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          articles: topArticles,
          prompt: `As a Jamaican financial analyst, create a 150-word markdown brief with:
          1. **Jamaica Financial Brief** header with date
          2. Weather metaphor reflecting economic climate
          3. **Key Developments** with <span class="text-green-500">[Positive]</span>/<span class="text-orange-500">[Watch]</span>
          4. **Your Money Impact** section
          5. **JSE Spotlight** with ↗︎/↘︎ symbols
          Use only span elements for coloring, no other HTML.`
        }),
      })


      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Summary service unavailable")
      }

      const data = await response.json()
      setSummary(data.summary)
      setLastSummaryTime(Date.now())
    } catch (error) {
      console.error("Summary error:", error)
      setSummary(error instanceof Error ? error.message : "Unable to generate summary")
      // Queue retry after cooldown
      setTimeout(() => setLastSummaryTime(0), SUMMARY_COOLDOWN)
    } finally {
      setSummaryLoading(false)
    }
  }

  const debouncedSummary = setTimeout(generateAISummary, 2000)
  return () => clearTimeout(debouncedSummary)
}, [filteredNews, lastSummaryTime])

const markdownComponents = {
  a: ({ node, ...props }: any) => (
    <a 
      {...props} 
      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
      target="_blank" 
      rel="noopener noreferrer"
    />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 {...props} className="text-xl font-semibold mt-4 mb-2" />
  ),
  ul: ({ node, ...props }: any) => (
    <ul {...props} className="list-disc pl-6 space-y-1" />
  ),
  ol: ({ node, ...props }: any) => (
    <ol {...props} className="list-decimal pl-6 space-y-1" />
  ),
  span: ({ node, ...props }: any) => {
    const colorMatch = props.className?.match(/text-(.+)/)
    return colorMatch ? (
      <span className={`text-${colorMatch[1]} dark:text-${colorMatch[1]}-300`}>
        {props.children}
      </span>
    ) : (
      <span {...props} />
    )
  },
  strong: ({ node, ...props }: any) => (
    <strong className="font-semibold text-green-600 dark:text-green-400" {...props} />
  ),
  em: ({ node, ...props }: any) => (
    <em className="italic text-yellow-600 dark:text-yellow-400" {...props} />
  )
}


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
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content || "" }} />
              {selectedArticle.content?.includes("You can read this article at:") && (
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
    )
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
            {(["all", "Gleaner", "Observer"] as const).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors
                  ${
                    selectedSource === source
                      ? "bg-blue-500 text-white dark:bg-blue-600"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-neutral-700"
                  }`}
              >
                {source === "all" ? "All Sources" : source}
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




      <div className="flex items-center gap-2">
    {audioError && (
      <span className="text-sm text-red-500">{audioError}</span>
    )}
    <button
      onClick={handleTextToSpeech}
      disabled={isLoading}
      className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
      title={isPlaying ? "Stop" : "Play summary"}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
      ) : isPlaying ? (
        <SpeakerXMarkIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      ) : (
        <SpeakerWaveIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      )}
    </button>
  </div>

      {summary ? (
        <div className="text-neutral-600 dark:text-dark-text prose dark:prose-invert max-w-none">
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[
    rehypeRaw, 
    [rehypeSanitize, {
      tagNames: ['span'],
      attributes: {
        span: ['className']
      }
    }]
  ]}
  components={markdownComponents}
  urlTransform={(uri) => {
    try {
      const url = new URL(uri)
      return url.protocol === 'http:' || url.protocol === 'https:' ? uri : ''
    } catch {
      return ''
    }
  }}
>
  {summary}
</ReactMarkdown>
        </div>
      ) : (
        <p className="text-neutral-500 dark:text-neutral-400">
          Analysis unavailable at the moment
        </p>
      )}
    </div>




  )}
            {paginatedNews.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border hover:border-blue-500 dark:hover:border-blue-400 transition-all
                         bg-white dark:bg-dark-surface border-neutral-200 dark:border-dark-border cursor-pointer"
                onClick={() => handleArticleClick(item)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <span
                      className={`inline-flex items-center text-sm font-medium
                      ${
                        item.source === "Gleaner"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
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

                {item.description && <p className="text-neutral-600 dark:text-dark-text mb-2">{item.description}</p>}

                {item.creator && (
                  <div className="flex items-center text-sm text-neutral-500 dark:text-dark-text">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {item.creator}
                  </div>
                )}
              </div>
            ))}

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NewsAggregator

