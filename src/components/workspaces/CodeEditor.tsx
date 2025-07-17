import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  File, 
  Folder, 
  FolderOpen, 
  Search, 
  GitBranch, 
  Play, 
  Square, 
  RotateCcw,
  Settings,
  Terminal,
  Bug,
  FileText
} from 'lucide-react'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
  language?: string
}

const CodeEditor = () => {
  const [selectedFile, setSelectedFile] = useState<string>('src/components/Dashboard.tsx')
  const [searchTerm, setSearchTerm] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npm run dev',
    'Local:   http://localhost:3000/',
    'Network: http://192.168.1.100:3000/',
    '✓ Ready in 1.2s',
  ])

  const fileTree: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Dashboard.tsx', type: 'file', language: 'typescript' },
            { name: 'UserProfile.tsx', type: 'file', language: 'typescript' },
            { name: 'Analytics.tsx', type: 'file', language: 'typescript' },
          ]
        },
        {
          name: 'hooks',
          type: 'folder',
          children: [
            { name: 'useAuth.ts', type: 'file', language: 'typescript' },
            { name: 'useApi.ts', type: 'file', language: 'typescript' },
          ]
        },
        { name: 'App.tsx', type: 'file', language: 'typescript' },
        { name: 'main.tsx', type: 'file', language: 'typescript' },
      ]
    },
    {
      name: 'public',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file', language: 'html' },
        { name: 'favicon.ico', type: 'file' },
      ]
    },
    { name: 'package.json', type: 'file', language: 'json' },
    { name: 'tsconfig.json', type: 'file', language: 'json' },
    { name: 'vite.config.ts', type: 'file', language: 'typescript' },
  ]

  const codeContent = `import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: <Users className="h-4 w-4" />
    },
    {
      title: 'Conversion Rate',
      value: '12.5%',
      change: '+19%',
      trend: 'up',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: 'Server Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: <Activity className="h-4 w-4" />
    }
  ])

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: updateMetricValue(metric.title, metric.value)
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const updateMetricValue = (title: string, currentValue: string): string => {
    // Simulate metric updates
    const numericValue = parseFloat(currentValue.replace(/[^0-9.]/g, ''))
    const variation = (Math.random() - 0.5) * 0.1
    const newValue = numericValue * (1 + variation)
    
    if (title.includes('Revenue')) {
      return \`$\${newValue.toFixed(2)}\`
    } else if (title.includes('Users')) {
      return Math.floor(newValue).toString()
    } else if (title.includes('Rate') || title.includes('Uptime')) {
      return \`\${newValue.toFixed(1)}%\`
    }
    return currentValue
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Live Data</Badge>
          <Button size="sm">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard`

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node, index) => (
      <div key={index} style={{ paddingLeft: `${depth * 16}px` }}>
        <div 
          className={`flex items-center space-x-2 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm ${
            selectedFile === node.name ? 'bg-accent/20 text-accent' : ''
          }`}
          onClick={() => node.type === 'file' && setSelectedFile(node.name)}
        >
          {node.type === 'folder' ? (
            <FolderOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <File className="w-4 h-4 text-gray-400" />
          )}
          <span>{node.name}</span>
          {node.language && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              {node.language}
            </Badge>
          )}
        </div>
        {node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ))
  }

  const runCode = () => {
    setIsRunning(true)
    setTerminalOutput(prev => [...prev, '$ Building application...', '✓ Build completed successfully'])
    setTimeout(() => {
      setIsRunning(false)
      setTerminalOutput(prev => [...prev, '✓ Application running on http://localhost:3000'])
    }, 2000)
  }

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
        {/* Explorer Header */}
        <div className="p-3 border-b border-[#3e3e42]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Explorer</span>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Search className="w-3 h-3" />
            </Button>
          </div>
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#3c3c3c] border-[#3e3e42] text-white text-xs h-7"
          />
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold text-gray-300 mb-2 px-2">PROJECT</div>
          {renderFileTree(fileTree)}
        </div>

        {/* Git Status */}
        <div className="p-3 border-t border-[#3e3e42]">
          <div className="flex items-center space-x-2 text-xs">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
            <Badge variant="secondary" className="text-xs px-1 py-0">3</Badge>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="bg-[#2d2d30] border-b border-[#3e3e42] flex items-center">
          <div className="flex items-center px-3 py-2 bg-[#1e1e1e] border-r border-[#3e3e42]">
            <FileText className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm">{selectedFile}</span>
            <Button variant="ghost" size="sm" className="w-4 h-4 p-0 ml-2">
              <span className="text-xs">×</span>
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex">
          <div className="flex-1 relative">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e42] h-full">
              <div className="p-4 text-xs text-gray-500 font-mono">
                {Array.from({ length: 50 }, (_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
            </div>

            {/* Code Content */}
            <div className="ml-12 p-4 font-mono text-sm overflow-auto h-full">
              <pre className="text-gray-300 leading-6">
                <code dangerouslySetInnerHTML={{ 
                  __html: codeContent
                    .replace(/import/g, '<span style="color: #c586c0">import</span>')
                    .replace(/export/g, '<span style="color: #c586c0">export</span>')
                    .replace(/const|let|var/g, '<span style="color: #569cd6">$&</span>')
                    .replace(/interface|type/g, '<span style="color: #4ec9b0">$&</span>')
                    .replace(/React|useState|useEffect/g, '<span style="color: #4fc1ff">$&</span>')
                    .replace(/'[^']*'/g, '<span style="color: #ce9178">$&</span>')
                    .replace(/\/\/.*$/gm, '<span style="color: #6a9955">$&</span>')
                }} />
              </pre>
            </div>
          </div>

          {/* Minimap */}
          <div className="w-20 bg-[#2d2d30] border-l border-[#3e3e42] p-2">
            <div className="text-xs text-gray-500 mb-2">Minimap</div>
            <div className="space-y-px">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="h-1 bg-gray-600 rounded" style={{ width: `${Math.random() * 100}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="h-48 bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col">
          {/* Panel Tabs */}
          <div className="flex items-center bg-[#2d2d30] border-b border-[#3e3e42]">
            <Button variant="ghost" size="sm" className="text-xs px-3 py-1 rounded-none border-b-2 border-accent">
              <Terminal className="w-3 h-3 mr-1" />
              Terminal
            </Button>
            <Button variant="ghost" size="sm" className="text-xs px-3 py-1 rounded-none">
              <Bug className="w-3 h-3 mr-1" />
              Debug Console
            </Button>
            <div className="flex-1" />
            <div className="flex items-center space-x-2 px-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={runCode}
                disabled={isRunning}
                className="text-xs"
              >
                {isRunning ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {isRunning ? 'Stop' : 'Run'}
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <RotateCcw className="w-3 h-3 mr-1" />
                Restart
              </Button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 p-3 font-mono text-sm overflow-y-auto">
            {terminalOutput.map((line, index) => (
              <div key={index} className="mb-1 text-gray-300">
                {line}
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <span className="cursor-blink">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor