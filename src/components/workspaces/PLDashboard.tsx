import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'

interface PLData {
  revenue: number
  cogs: number
  grossProfit: number
  operatingExpenses: number
  ebitda: number
  netIncome: number
  margins: {
    gross: number
    operating: number
    net: number
  }
}

interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  unrealizedPL: number
  realizedPL: number
  totalPL: number
}

const PLDashboard = () => {
  const [currentPL, setCurrentPL] = useState<PLData>({
    revenue: 16580000,
    cogs: 8290000,
    grossProfit: 8290000,
    operatingExpenses: 5420000,
    ebitda: 2870000,
    netIncome: 2150000,
    margins: {
      gross: 50.0,
      operating: 17.3,
      net: 13.0
    }
  })

  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'AAPL',
      quantity: 1000,
      avgPrice: 185.50,
      currentPrice: 189.43,
      marketValue: 189430,
      unrealizedPL: 3930,
      realizedPL: 0,
      totalPL: 3930
    },
    {
      symbol: 'MSFT',
      quantity: 500,
      avgPrice: 375.20,
      currentPrice: 378.85,
      marketValue: 189425,
      unrealizedPL: 1825,
      realizedPL: 2500,
      totalPL: 4325
    },
    {
      symbol: 'GOOGL',
      quantity: 800,
      avgPrice: 140.10,
      currentPrice: 138.21,
      marketValue: 110568,
      unrealizedPL: -1512,
      realizedPL: 850,
      totalPL: -662
    },
    {
      symbol: 'TSLA',
      quantity: 300,
      avgPrice: 245.80,
      currentPrice: 248.50,
      marketValue: 74550,
      unrealizedPL: 810,
      realizedPL: -1200,
      totalPL: -390
    },
    {
      symbol: 'NVDA',
      quantity: 100,
      avgPrice: 860.25,
      currentPrice: 875.28,
      marketValue: 87528,
      unrealizedPL: 1503,
      realizedPL: 3200,
      totalPL: 4703
    }
  ])

  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Simulate real-time P&L updates
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const priceChange = (Math.random() - 0.5) * 2
        const newPrice = Math.max(pos.currentPrice + priceChange, 1)
        const newMarketValue = pos.quantity * newPrice
        const newUnrealizedPL = (newPrice - pos.avgPrice) * pos.quantity
        
        return {
          ...pos,
          currentPrice: newPrice,
          marketValue: newMarketValue,
          unrealizedPL: newUnrealizedPL,
          totalPL: newUnrealizedPL + pos.realizedPL
        }
      }))
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const totalPortfolioValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const totalUnrealizedPL = positions.reduce((sum, pos) => sum + pos.unrealizedPL, 0)
  const totalRealizedPL = positions.reduce((sum, pos) => sum + pos.realizedPL, 0)
  const totalPL = totalUnrealizedPL + totalRealizedPL

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">P&L Dashboard</h1>
          <p className="text-gray-600">Real-time profit & loss analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live Data
          </Badge>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total market value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPL >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-600" /> : 
              <TrendingDown className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPL)}
            </div>
            <p className="text-xs text-muted-foreground">
              Realized + Unrealized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalUnrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalUnrealizedPL)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realized P&L</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalRealizedPL)}
            </div>
            <p className="text-xs text-muted-foreground">
              Closed positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Current Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Symbol</th>
                  <th className="text-right py-3 px-4 font-medium">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium">Avg Price</th>
                  <th className="text-right py-3 px-4 font-medium">Current Price</th>
                  <th className="text-right py-3 px-4 font-medium">Market Value</th>
                  <th className="text-right py-3 px-4 font-medium">Unrealized P&L</th>
                  <th className="text-right py-3 px-4 font-medium">Realized P&L</th>
                  <th className="text-right py-3 px-4 font-medium">Total P&L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.symbol} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-medium">{position.symbol}</span>
                        {position.totalPL < -1000 && (
                          <AlertTriangle className="w-4 h-4 ml-2 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">{position.quantity.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">${position.avgPrice.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">${position.currentPrice.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(position.marketValue)}</td>
                    <td className={`text-right py-3 px-4 font-medium ${
                      position.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(position.unrealizedPL)}
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${
                      position.realizedPL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(position.realizedPL)}
                    </td>
                    <td className={`text-right py-3 px-4 font-bold ${
                      position.totalPL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(position.totalPL)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Statement Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Income Statement (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Revenue</span>
                <span className="font-bold text-green-600">{formatCurrency(currentPL.revenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Cost of Goods Sold</span>
                <span className="text-red-600">({formatCurrency(currentPL.cogs)})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Gross Profit</span>
                <span className="font-bold">{formatCurrency(currentPL.grossProfit)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Operating Expenses</span>
                <span className="text-red-600">({formatCurrency(currentPL.operatingExpenses)})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">EBITDA</span>
                <span className="font-bold">{formatCurrency(currentPL.ebitda)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300">
                <span className="font-bold">Net Income</span>
                <span className="font-bold text-green-600 text-lg">{formatCurrency(currentPL.netIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="w-5 h-5 mr-2" />
              Key Ratios & Margins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Gross Margin</span>
                  <span className="font-bold">{formatPercent(currentPL.margins.gross)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${currentPL.margins.gross}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Operating Margin</span>
                  <span className="font-bold">{formatPercent(currentPL.margins.operating)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${currentPL.margins.operating * 2}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Net Margin</span>
                  <span className="font-bold">{formatPercent(currentPL.margins.net)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${currentPL.margins.net * 3}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">Portfolio Performance</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Return</span>
                  <span className={`font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent((totalPL / (totalPortfolioValue - totalPL)) * 100)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PLDashboard