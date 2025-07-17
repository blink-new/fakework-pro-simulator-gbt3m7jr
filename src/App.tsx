import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { 
  Monitor, 
  Code, 
  FileSpreadsheet, 
  TrendingUp, 
  Database, 
  Mail, 
  Video,
  Activity,
  BarChart3,
  Plus,
  X,
  Twitter,
  Settings
} from 'lucide-react'
import TwitterAuth from './components/TwitterAuth'

// Import workspace components
import BloombergTerminal from './components/workspaces/BloombergTerminal'
import CodeEditor from './components/workspaces/CodeEditor'
import Spreadsheet from './components/workspaces/Spreadsheet'
import PLDashboard from './components/workspaces/PLDashboard'
import DatabaseTool from './components/workspaces/DatabaseTool'
import EmailClient from './components/workspaces/EmailClient'
import VideoConference from './components/workspaces/VideoConference'
import SystemMonitor from './components/workspaces/SystemMonitor'
import Analytics from './components/workspaces/Analytics'

interface WorkspaceTab {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
  type: string
}

const workspaceTypes = [
  { id: 'bloomberg', title: 'Bloomberg Terminal', icon: <TrendingUp className="w-4 h-4" />, component: BloombergTerminal },
  { id: 'code', title: 'VS Code', icon: <Code className="w-4 h-4" />, component: CodeEditor },
  { id: 'excel', title: 'Excel Analytics', icon: <FileSpreadsheet className="w-4 h-4" />, component: Spreadsheet },
  { id: 'pnl', title: 'P&L Dashboard', icon: <BarChart3 className="w-4 h-4" />, component: PLDashboard },
  { id: 'database', title: 'SQL Workbench', icon: <Database className="w-4 h-4" />, component: DatabaseTool },
  { id: 'email', title: 'Outlook', icon: <Mail className="w-4 h-4" />, component: EmailClient },
  { id: 'video', title: 'Teams Meeting', icon: <Video className="w-4 h-4" />, component: VideoConference },
  { id: 'monitor', title: 'System Monitor', icon: <Activity className="w-4 h-4" />, component: SystemMonitor },
  { id: 'analytics', title: 'Analytics', icon: <Monitor className="w-4 h-4" />, component: Analytics },
]

function App() {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isTwitterConnected, setIsTwitterConnected] = useState(false)
  const [twitterUser, setTwitterUser] = useState<any>(null)
  const [showTwitterAuth, setShowTwitterAuth] = useState(false)

  useEffect(() => {
    // Initialize with Bloomberg terminal
    const initialTab = {
      id: 'bloomberg-1',
      title: 'Bloomberg Terminal',
      icon: <TrendingUp className="w-4 h-4" />,
      component: <BloombergTerminal />,
      type: 'bloomberg'
    }
    setTabs([initialTab])
    setActiveTab(initialTab.id)

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const addTab = (workspaceType: typeof workspaceTypes[0]) => {
    const newTab: WorkspaceTab = {
      id: `${workspaceType.id}-${Date.now()}`,
      title: workspaceType.title,
      icon: workspaceType.icon,
      component: <workspaceType.component />,
      type: workspaceType.id
    }
    setTabs(prev => [...prev, newTab])
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id)
      }
      return newTabs
    })
  }

  const handleTwitterAuthChange = (isAuthenticated: boolean, user?: any) => {
    setIsTwitterConnected(isAuthenticated)
    setTwitterUser(user)
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="h-8 bg-card border-b border-border flex items-center justify-between px-4 text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-accent">FakeWork Pro</span>
          <Badge variant="secondary" className="text-xs">Enterprise Edition</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground">
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </span>
          <div className="flex items-center space-x-2">
            {isTwitterConnected ? (
              <div className="flex items-center space-x-1">
                <Twitter className="w-3 h-3 text-blue-500" />
                <span className="text-muted-foreground">@{twitterUser?.username}</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowTwitterAuth(true)}
              >
                <Twitter className="w-3 h-3 mr-1" />
                Connect
              </Button>
            )}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-muted/30 border-b border-border flex items-center">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-2 border-r border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                activeTab === tab.id ? 'bg-background border-b-2 border-accent' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="text-sm font-medium truncate max-w-32">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {/* Add Tab Dropdown */}
        <div className="px-2">
          <div className="relative group">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">Add Workspace</div>
                {workspaceTypes.map((workspace) => (
                  <Button
                    key={workspace.id}
                    variant="ghost"
                    className="w-full justify-start text-sm h-8"
                    onClick={() => addTab(workspace)}
                  >
                    {workspace.icon}
                    <span className="ml-2">{workspace.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            {tab.component}
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>CPU: 23%</span>
          <span>RAM: 8.2GB</span>
          <span>Network: 1.2 Mbps</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Session: 2h 34m</span>
          <span>User: john.doe@company.com</span>
        </div>
      </div>

      {/* Twitter Auth Modal */}
      {showTwitterAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Twitter Integration</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTwitterAuth(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <TwitterAuth onAuthChange={handleTwitterAuthChange} />
            {isTwitterConnected && (
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  onClick={() => setShowTwitterAuth(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App