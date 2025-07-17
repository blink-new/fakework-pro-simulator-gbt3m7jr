import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Twitter, LogOut, RefreshCw } from 'lucide-react'

interface TwitterUser {
  id: string
  username: string
  name: string
  profile_image_url: string
  verified: boolean
}

interface TwitterAuthProps {
  onAuthChange: (isAuthenticated: boolean, user?: TwitterUser) => void
}

const TwitterAuth = ({ onAuthChange }: TwitterAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<TwitterUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('twitter_access_token')
      if (token) {
        const response = await fetch('https://gbt3m7jr--twitter-auth.functions.blink.new/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setIsAuthenticated(true)
          onAuthChange(true, userData)
        } else {
          localStorage.removeItem('twitter_access_token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }, [onAuthChange])

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus()
  }, [checkAuthStatus])

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Start OAuth flow
      const response = await fetch('https://gbt3m7jr--twitter-auth.functions.blink.new/start')
      const { auth_url } = await response.json()
      
      // Open popup window for OAuth
      const popup = window.open(
        auth_url,
        'twitter-oauth',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      )

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          // Check if authentication was successful
          setTimeout(checkAuthStatus, 1000)
          setIsLoading(false)
        }
      }, 1000)

      // Listen for message from popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
          const { access_token, user: userData } = event.data
          localStorage.setItem('twitter_access_token', access_token)
          setUser(userData)
          setIsAuthenticated(true)
          onAuthChange(true, userData)
          popup?.close()
          setIsLoading(false)
        } else if (event.data.type === 'TWITTER_AUTH_ERROR') {
          setError(event.data.error)
          setIsLoading(false)
        }
      }

      window.addEventListener('message', messageListener)
      
      // Cleanup
      setTimeout(() => {
        window.removeEventListener('message', messageListener)
        if (!popup?.closed) {
          popup?.close()
          setIsLoading(false)
        }
      }, 300000) // 5 minute timeout
      
    } catch (error) {
      setError('Failed to start authentication')
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('twitter_access_token')
    setUser(null)
    setIsAuthenticated(false)
    onAuthChange(false)
  }

  if (isAuthenticated && user) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={user.profile_image_url} 
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{user.name}</span>
                {user.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">@{user.username}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkAuthStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="text-center">
        <Twitter className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Connect Twitter Account</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Connect your Twitter account to populate your fake work tabs with real Twitter feeds
        </p>
        {error && (
          <div className="text-sm text-red-500 mb-4 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        <Button 
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Twitter className="w-4 h-4 mr-2" />
              Connect Twitter
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}

export default TwitterAuth