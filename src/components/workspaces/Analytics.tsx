import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: string
  conversionRate: number
  revenue: number
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 45231,
    uniqueVisitors: 12847,
    bounceRate: 34.2,
    avgSessionDuration: '3m 42s',
    conversionRate: 2.8,
    revenue: 89450
  })

  const [timeRange, setTimeRange] = useState('7d')

  const topPages = [
    { page: '/dashboard', views: 8934, percentage: 19.8 },
    { page: '/products', views: 7621, percentage: 16.9 },
    { page: '/analytics', views: 6543, percentage: 14.5 },
    { page: '/settings', views: 4321, percentage: 9.6 },
    { page: '/profile', views: 3876, percentage: 8.6 },
  ]

  const trafficSources = [
    { source: 'Organic Search', visitors: 5234, percentage: 40.7 },
    { source: 'Direct', visitors: 3421, percentage: 26.6 },
    { source: 'Social Media', visitors: 2156, percentage: 16.8 },
    { source: 'Email', visitors: 1234, percentage: 9.6 },
    { source: 'Referral', visitors: 802, percentage: 6.2 },
  ]

  const deviceBreakdown = [
    { device: 'Desktop', users: 7234, percentage: 56.3 },
    { device: 'Mobile', users: 4321, percentage: 33.6 },
    { device: 'Tablet', users: 1292, percentage: 10.1 },
  ]

  const realtimeData = [
    { metric: 'Active Users', value: 234, change: '+12' },
    { metric: 'Page Views/min', value: 45, change: '+3' },
    { metric: 'New Sessions', value: 18, change: '-2' },
    { metric: 'Bounce Rate', value: '32%', change: '-1.2%' },
  ]

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        pageViews: prev.pageViews + Math.floor(Math.random() * 10),
        uniqueVisitors: prev.uniqueVisitors + Math.floor(Math.random() * 3),
        bounceRate: Math.max(20, Math.min(50, prev.bounceRate + (Math.random() - 0.5) * 2)),
        conversionRate: Math.max(1, Math.min(5, prev.conversionRate + (Math.random() - 0.5) * 0.2)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Website performance and user insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white rounded-lg border p-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
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
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+2.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Data */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Real-time Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {realtimeData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-600">{item.metric}</div>
                <div className={`text-xs ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change} last 5 min
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{page.page}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-bold text-sm">{page.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{page.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{source.source}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-bold text-sm">{source.visitors.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.device === 'Desktop' && <Monitor className="w-5 h-5 text-gray-600" />}
                    {device.device === 'Mobile' && <Smartphone className="w-5 h-5 text-gray-600" />}
                    {device.device === 'Tablet' && <Monitor className="w-5 h-5 text-gray-600" />}
                    <span className="font-medium text-sm">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right min-w-16">
                      <div className="font-bold text-sm">{device.users.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{device.percentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Data */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { country: 'United States', users: 4234, percentage: 32.9 },
                { country: 'United Kingdom', users: 2156, percentage: 16.8 },
                { country: 'Canada', users: 1543, percentage: 12.0 },
                { country: 'Germany', users: 1234, percentage: 9.6 },
                { country: 'France', users: 987, percentage: 7.7 },
              ].map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{country.country}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-bold text-sm">{country.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics