import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { TrendingUp, TrendingDown, Search, Bell, Settings, User, Twitter } from 'lucide-react'
import TwitterFeed from '../TwitterFeed'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: string
  high: number
  low: number
}

interface NewsItem {
  id: string
  headline: string
  time: string
  source: string
  priority: 'high' | 'medium' | 'low'
}

const BloombergTerminal = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: 'SPY', price: 428.67, change: 2.34, changePercent: 0.55, volume: '89.2M', high: 429.12, low: 425.89 },
    { symbol: 'AAPL', price: 189.43, change: -1.23, changePercent: -0.64, volume: '52.1M', high: 191.20, low: 188.90 },
    { symbol: 'MSFT', price: 378.85, change: 4.67, changePercent: 1.25, volume: '28.7M', high: 379.45, low: 374.12 },
    { symbol: 'GOOGL', price: 138.21, change: -0.89, changePercent: -0.64, volume: '31.4M', high: 139.87, low: 137.45 },
    { symbol: 'TSLA', price: 248.50, change: 8.92, changePercent: 3.72, volume: '95.6M', high: 251.30, low: 239.80 },
    { symbol: 'NVDA', price: 875.28, change: 15.67, changePercent: 1.82, volume: '41.2M', high: 882.45, low: 859.12 },
  ])

  const [news, setNews] = useState<NewsItem[]>([
    { id: '1', headline: 'Fed Chair Powell Signals Potential Rate Cut in Q2', time: '09:23', source: 'Reuters', priority: 'high' },
    { id: '2', headline: 'Tech Earnings Beat Expectations Across Sector', time: '09:15', source: 'Bloomberg', priority: 'high' },
    { id: '3', headline: 'Oil Prices Surge on Middle East Tensions', time: '09:08', source: 'WSJ', priority: 'medium' },
    { id: '4', headline: 'European Markets Open Higher on ECB Comments', time: '08:45', source: 'FT', priority: 'medium' },
    { id: '5', headline: 'Crypto Rally Continues as Bitcoin Hits New High', time: '08:32', source: 'CoinDesk', priority: 'low' },
  ])

  const [command, setCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Bloomberg Terminal v24.1.2 - Professional',
    'Connected to Bloomberg Network',
    'Market Data: LIVE | News: LIVE | Analytics: ACTIVE',
    '> Ready for commands...',
  ])

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1,
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && command.trim()) {
      const newOutput = [...terminalOutput, `> ${command}`]
      
      // Simulate command responses
      if (command.toLowerCase().includes('help')) {
        newOutput.push('Available commands: EQUITY, NEWS, CHART, PORT, CALC, HELP')
      } else if (command.toLowerCase().includes('equity')) {
        newOutput.push('Equity markets: S&P 500 +0.55% | NASDAQ +0.82% | DOW +0.34%')
      } else if (command.toLowerCase().includes('news')) {
        newOutput.push('Latest: Fed signals dovish stance, Tech earnings strong')
      } else {
        newOutput.push(`Command "${command}" executed. Data retrieved.`)
      }
      
      setTerminalOutput(newOutput.slice(-10)) // Keep last 10 lines
      setCommand('')
    }
  }

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm overflow-hidden">
      {/* Bloomberg Header */}
      <div className="bg-orange-500 text-black px-4 py-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-bold">BLOOMBERG</span>
          <span className="text-xs">TERMINAL</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span>NYC 09:23:45</span>
          <span>LON 14:23:45</span>
          <span>TKY 22:23:45</span>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Market Data */}
        <div className="w-1/3 border-r border-green-400/30 p-4">
          <div className="mb-4">
            <h2 className="text-orange-400 font-bold mb-2">MARKET OVERVIEW</h2>
            <div className="space-y-1">
              {marketData.map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center py-1 border-b border-green-400/20">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-bold w-12">{stock.symbol}</span>
                    <span className="text-white">{stock.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </span>
                    <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                    {stock.change >= 0 ? 
                      <TrendingUp className="w-3 h-3 text-green-400" /> : 
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Indices */}
          <div className="mb-4">
            <h3 className="text-orange-400 font-bold mb-2">INDICES</h3>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-green-900/20 p-2 rounded">
                <div className="text-yellow-400">S&P 500</div>
                <div className="text-white">4,287.50</div>
                <div className="text-green-400">+23.45 (+0.55%)</div>
              </div>
              <div className="bg-green-900/20 p-2 rounded">
                <div className="text-yellow-400">NASDAQ</div>
                <div className="text-white">13,431.34</div>
                <div className="text-green-400">+109.23 (+0.82%)</div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="bg-black border border-green-400/30 p-2 h-32 overflow-y-auto">
            <div className="text-xs">
              {terminalOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center mt-2">
              <span className="text-orange-400 mr-2">BBG&gt;</span>
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleCommand}
                className="bg-transparent border-none text-green-400 text-xs p-0 h-auto focus:ring-0"
                placeholder="Enter command..."
              />
              <span className="cursor-blink text-green-400">_</span>
            </div>
          </div>
        </div>

        {/* Middle Panel - News & Analytics */}
        <div className="w-1/3 border-r border-green-400/30 p-4">
          <div className="mb-4">
            <h2 className="text-orange-400 font-bold mb-2 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              BREAKING NEWS
            </h2>
            <div className="space-y-2">
              {news.map((item) => (
                <div key={item.id} className="border-b border-green-400/20 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-white text-xs leading-tight mb-1">
                        {item.headline}
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-yellow-400">{item.time}</span>
                        <span className="text-gray-400">{item.source}</span>
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs px-1 py-0"
                        >
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Functions */}
          <div className="mb-4">
            <h3 className="text-orange-400 font-bold mb-2">QUICK FUNCTIONS</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button variant="outline" size="sm" className="bg-green-900/20 border-green-400/30 text-green-400 hover:bg-green-900/40">
                EQUITY
              </Button>
              <Button variant="outline" size="sm" className="bg-green-900/20 border-green-400/30 text-green-400 hover:bg-green-900/40">
                BONDS
              </Button>
              <Button variant="outline" size="sm" className="bg-green-900/20 border-green-400/30 text-green-400 hover:bg-green-900/40">
                FOREX
              </Button>
              <Button variant="outline" size="sm" className="bg-green-900/20 border-green-400/30 text-green-400 hover:bg-green-900/40">
                COMMODITIES
              </Button>
            </div>
          </div>

          {/* Economic Calendar */}
          <div>
            <h3 className="text-orange-400 font-bold mb-2">TODAY'S EVENTS</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-white">10:00 Consumer Confidence</span>
                <span className="text-yellow-400">HIGH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">14:00 Fed Speech - Powell</span>
                <span className="text-red-400">CRITICAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">15:30 Oil Inventory</span>
                <span className="text-green-400">MEDIUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Twitter Feed */}
        <div className="w-1/3 p-4">
          <div className="h-full">
            <h2 className="text-orange-400 font-bold mb-2 flex items-center">
              <Twitter className="w-4 h-4 mr-2" />
              SOCIAL SENTIMENT
            </h2>
            <div className="h-full bg-black border border-green-400/30 rounded overflow-hidden">
              <TwitterFeed 
                compact={true}
                maxHeight="100%"
                showHeader={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-orange-500 text-black px-4 py-1 text-xs flex justify-between">
        <div>Market Status: OPEN | Data Delay: REAL-TIME | Connection: SECURE</div>
        <div>User: TRADER001 | Firm: GOLDMAN SACHS | Terminal: NYC-001</div>
      </div>
    </div>
  )
}

export default BloombergTerminal