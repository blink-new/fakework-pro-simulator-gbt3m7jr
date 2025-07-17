import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Server, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Download
} from 'lucide-react'

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 23.4, unit: '%', status: 'normal', trend: 'stable' },
    { name: 'Memory Usage', value: 67.8, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disk Usage', value: 45.2, unit: '%', status: 'normal', trend: 'stable' },
    { name: 'Network I/O', value: 1.2, unit: 'Mbps', status: 'normal', trend: 'down' },
    { name: 'Temperature', value: 68, unit: '°C', status: 'normal', trend: 'stable' },
    { name: 'Power Usage', value: 85.3, unit: 'W', status: 'normal', trend: 'stable' },
  ])

  const [processes, setProcesses] = useState([
    { pid: 1234, name: 'chrome.exe', cpu: 15.2, memory: 245.6, status: 'running' },
    { pid: 5678, name: 'node.exe', cpu: 8.7, memory: 128.4, status: 'running' },
    { pid: 9012, name: 'code.exe', cpu: 12.1, memory: 189.2, status: 'running' },
    { pid: 3456, name: 'teams.exe', cpu: 6.3, memory: 156.8, status: 'running' },
    { pid: 7890, name: 'outlook.exe', cpu: 3.2, memory: 98.7, status: 'running' },
  ])

  const [logs, setLogs] = useState([
    { time: '14:23:45', level: 'INFO', message: 'System startup completed successfully' },
    { time: '14:22:12', level: 'WARN', message: 'High memory usage detected on process chrome.exe' },
    { time: '14:21:33', level: 'INFO', message: 'Network connection established' },
    { time: '14:20:45', level: 'ERROR', message: 'Failed to connect to backup server' },
    { time: '14:19:22', level: 'INFO', message: 'Scheduled backup completed' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 5),
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="h-full bg-gray-900 text-white p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Monitor</h1>
          <p className="text-gray-400">Real-time system performance monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Online
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{metric.name}</CardTitle>
              {getStatusIcon(metric.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metric.value.toFixed(1)}{metric.unit}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </div>
                <div className="text-xs text-gray-400">
                  {metric.trend === 'up' && '↗ Increasing'}
                  {metric.trend === 'down' && '↘ Decreasing'}
                  {metric.trend === 'stable' && '→ Stable'}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className={`h-2 rounded-full ${
                    metric.status === 'critical' ? 'bg-red-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Cpu className="w-5 h-5 mr-2" />
              Top Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">PID</th>
                    <th className="text-left py-2 text-gray-300">Process</th>
                    <th className="text-right py-2 text-gray-300">CPU %</th>
                    <th className="text-right py-2 text-gray-300">Memory (MB)</th>
                    <th className="text-center py-2 text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process) => (
                    <tr key={process.pid} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-2 text-gray-400">{process.pid}</td>
                      <td className="py-2 text-white font-medium">{process.name}</td>
                      <td className="py-2 text-right text-yellow-400">{process.cpu.toFixed(1)}%</td>
                      <td className="py-2 text-right text-blue-400">{process.memory.toFixed(1)}</td>
                      <td className="py-2 text-center">
                        <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                          {process.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Server className="w-5 h-5 mr-2" />
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-700">
                  <span className="text-xs text-gray-400 font-mono">{log.time}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      log.level === 'ERROR' ? 'border-red-500 text-red-400' :
                      log.level === 'WARN' ? 'border-yellow-500 text-yellow-400' :
                      'border-green-500 text-green-400'
                    }`}
                  >
                    {log.level}
                  </Badge>
                  <span className="text-sm text-gray-300 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network & Storage Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Wifi className="w-5 h-5 mr-2" />
              Network Interfaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <div>
                  <div className="font-medium text-white">Ethernet</div>
                  <div className="text-sm text-gray-400">192.168.1.100</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm">Connected</div>
                  <div className="text-xs text-gray-400">1 Gbps</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <div>
                  <div className="font-medium text-white">Wi-Fi</div>
                  <div className="text-sm text-gray-400">192.168.1.101</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-sm">Standby</div>
                  <div className="text-xs text-gray-400">300 Mbps</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <HardDrive className="w-5 h-5 mr-2" />
              Storage Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">C: System Drive (SSD)</span>
                  <span className="text-sm text-gray-400">512 GB</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">230 GB used / 512 GB total</div>
              </div>
              <div className="p-3 bg-gray-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">D: Data Drive (HDD)</span>
                  <span className="text-sm text-gray-400">2 TB</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">1.36 TB used / 2 TB total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SystemMonitor