import { useState, useEffect, useCallback } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  Twitter, 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  RefreshCw,
  Clock,
  TrendingUp
} from 'lucide-react'

interface Tweet {
  id: string
  text: string
  created_at: string
  author: {
    id: string
    name: string
    username: string
    profile_image_url: string
    verified: boolean
  }
  metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
  media?: Array<{
    type: string
    url?: string
    preview_image_url?: string
  }>
  entities?: {
    hashtags?: Array<{ tag: string }>
    mentions?: Array<{ username: string }>
    urls?: Array<{ expanded_url: string, display_url: string }>
  }
}

interface TwitterFeedProps {
  compact?: boolean
  maxHeight?: string
  showHeader?: boolean
  title?: string
}

const TwitterFeed = ({ 
  compact = false, 
  maxHeight = "400px", 
  showHeader = true,
  title = "Twitter Feed"
}: TwitterFeedProps) => {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchTweets = useCallback(async () => {
    const token = localStorage.getItem('twitter_access_token')
    if (!token) {
      setError('Twitter account not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('https://gbt3m7jr--twitter-timeline.functions.blink.new', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tweets')
      }

      const data = await response.json()
      setTweets(data.tweets || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching tweets:', error)
      setError('Failed to load tweets')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTweets()
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchTweets, 120000)
    return () => clearInterval(interval)
  }, [fetchTweets])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return 'now'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const renderTweet = (tweet: Tweet) => (
    <div key={tweet.id} className={`p-3 hover:bg-muted/30 transition-colors ${compact ? 'border-b border-border/50' : ''}`}>
      <div className="flex space-x-3">
        <img 
          src={tweet.author.profile_image_url} 
          alt={tweet.author.name}
          className={`rounded-full ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`font-semibold truncate ${compact ? 'text-sm' : ''}`}>
              {tweet.author.name}
            </span>
            {tweet.author.verified && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                ✓
              </Badge>
            )}
            <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              @{tweet.author.username}
            </span>
            <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              ·
            </span>
            <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              {formatTime(tweet.created_at)}
            </span>
          </div>
          
          <div className={`text-foreground mb-2 ${compact ? 'text-sm' : ''}`}>
            {tweet.text}
          </div>

          {tweet.media && tweet.media.length > 0 && (
            <div className="mb-2">
              {tweet.media.map((media, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border">
                  {media.type === 'photo' && media.url && (
                    <img 
                      src={media.url} 
                      alt="Tweet media"
                      className="w-full max-h-64 object-cover"
                    />
                  )}
                  {media.type === 'video' && media.preview_image_url && (
                    <div className="relative">
                      <img 
                        src={media.preview_image_url} 
                        alt="Video preview"
                        className="w-full max-h-64 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!compact && (
            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{formatNumber(tweet.metrics.reply_count)}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                <Repeat2 className="w-4 h-4" />
                <span className="text-sm">{formatNumber(tweet.metrics.retweet_count)}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{formatNumber(tweet.metrics.like_count)}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                <Share className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (error && !tweets.length) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <Twitter className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchTweets}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {showHeader && (
        <>
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Twitter className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">{title}</h3>
                {tweets.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {tweets.length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {lastUpdate && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{lastUpdate.toLocaleTimeString()}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchTweets}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}
      
      <ScrollArea className="flex-1" style={{ maxHeight }}>
        {isLoading && tweets.length === 0 ? (
          <div className="p-4 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading tweets...</p>
          </div>
        ) : tweets.length === 0 ? (
          <div className="p-4 text-center">
            <Twitter className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No tweets found</p>
          </div>
        ) : (
          <div className={compact ? '' : 'divide-y divide-border'}>
            {tweets.map(renderTweet)}
          </div>
        )}
      </ScrollArea>
      
      {error && tweets.length > 0 && (
        <div className="p-2 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-700">{error}</p>
        </div>
      )}
    </Card>
  )
}

export default TwitterFeed