import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { 
  Database, 
  Play, 
  Save, 
  Download, 
  RefreshCw, 
  Table, 
  Search,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

const DatabaseTool = () => {
  const [query, setQuery] = useState(`SELECT 
  u.user_id,
  u.username,
  u.email,
  COUNT(o.order_id) as total_orders,
  SUM(o.total_amount) as total_spent,
  MAX(o.order_date) as last_order_date
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.created_date >= '2024-01-01'
GROUP BY u.user_id, u.username, u.email
HAVING total_spent > 1000
ORDER BY total_spent DESC
LIMIT 50;`)

  const [results, setResults] = useState([
    { user_id: 1001, username: 'john_doe', email: 'john@company.com', total_orders: 15, total_spent: 4250.00, last_order_date: '2024-03-15' },
    { user_id: 1002, username: 'jane_smith', email: 'jane@company.com', total_orders: 23, total_spent: 6780.50, last_order_date: '2024-03-14' },
    { user_id: 1003, username: 'mike_wilson', email: 'mike@company.com', total_orders: 8, total_spent: 2340.25, last_order_date: '2024-03-13' },
    { user_id: 1004, username: 'sarah_jones', email: 'sarah@company.com', total_orders: 31, total_spent: 8920.75, last_order_date: '2024-03-16' },
    { user_id: 1005, username: 'david_brown', email: 'david@company.com', total_orders: 12, total_spent: 3456.80, last_order_date: '2024-03-12' },
  ])

  const [isExecuting, setIsExecuting] = useState(false)
  const [executionTime, setExecutionTime] = useState('0.234s')

  const tables = [
    { name: 'users', rows: 15420, size: '2.3 MB' },
    { name: 'orders', rows: 89650, size: '12.7 MB' },
    { name: 'products', rows: 2340, size: '890 KB' },
    { name: 'categories', rows: 45, size: '12 KB' },
    { name: 'order_items', rows: 234560, size: '45.2 MB' },
    { name: 'reviews', rows: 12890, size: '3.4 MB' },
  ]

  const executeQuery = () => {
    setIsExecuting(true)
    setTimeout(() => {
      setIsExecuting(false)
      setExecutionTime(`${(Math.random() * 2 + 0.1).toFixed(3)}s`)
    }, 1500)
  }

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
        {/* Connection Info */}
        <div className="p-4 border-b border-[#3e3e42]">
          <div className="flex items-center space-x-2 mb-3">
            <Database className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">SQL Workbench</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Server:</span>
              <span>prod-db-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Database:</span>
              <span>ecommerce</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">User:</span>
              <span>analyst</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">Connected</span>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-300">Tables</span>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {tables.map((table) => (
              <div key={table.name} className="group">
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#3e3e42] cursor-pointer">
                  <Table className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{table.name}</span>
                </div>
                <div className="ml-6 text-xs text-gray-500 space-y-1">
                  <div>{table.rows.toLocaleString()} rows</div>
                  <div>{table.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Query History */}
        <div className="p-4 border-t border-[#3e3e42]">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-300">Recent</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-[#3e3e42] rounded cursor-pointer hover:bg-[#4e4e52]">
              SELECT * FROM users...
            </div>
            <div className="p-2 bg-[#3e3e42] rounded cursor-pointer hover:bg-[#4e4e52]">
              UPDATE orders SET...
            </div>
            <div className="p-2 bg-[#3e3e42] rounded cursor-pointer hover:bg-[#4e4e52]">
              SELECT COUNT(*)...
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-[#2d2d30] border-b border-[#3e3e42] p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={executeQuery}
              disabled={isExecuting}
              className="text-green-400 hover:text-green-300"
            >
              <Play className="w-4 h-4 mr-1" />
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Execution time: {executionTime}</span>
            <span>Rows: {results.length}</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Query OK
            </Badge>
          </div>
        </div>

        {/* Query Editor */}
        <div className="h-64 border-b border-[#3e3e42] relative">
          <div className="absolute left-0 top-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e42] h-full">
            <div className="p-2 text-xs text-gray-500 font-mono">
              {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className="leading-5">{i + 1}</div>
              ))}
            </div>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-full bg-[#1e1e1e] text-white font-mono text-sm p-4 pl-16 resize-none border-none outline-none"
            placeholder="Enter your SQL query here..."
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Query Results</h3>
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Filter results..." 
                  className="w-64 bg-[#3e3e42] border-[#3e3e42] text-white"
                />
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Card className="bg-[#252526] border-[#3e3e42]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#3e3e42]">
                        <th className="text-left p-3 font-medium text-gray-300">user_id</th>
                        <th className="text-left p-3 font-medium text-gray-300">username</th>
                        <th className="text-left p-3 font-medium text-gray-300">email</th>
                        <th className="text-right p-3 font-medium text-gray-300">total_orders</th>
                        <th className="text-right p-3 font-medium text-gray-300">total_spent</th>
                        <th className="text-left p-3 font-medium text-gray-300">last_order_date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={index} className="border-b border-[#3e3e42] hover:bg-[#3e3e42]/30">
                          <td className="p-3 text-blue-400">{row.user_id}</td>
                          <td className="p-3">{row.username}</td>
                          <td className="p-3 text-gray-300">{row.email}</td>
                          <td className="p-3 text-right text-yellow-400">{row.total_orders}</td>
                          <td className="p-3 text-right text-green-400">${row.total_spent.toFixed(2)}</td>
                          <td className="p-3 text-gray-300">{row.last_order_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Query Stats */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <span>5 rows returned</span>
                <span>Execution time: {executionTime}</span>
                <span>Memory used: 2.4 MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Query executed successfully</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseTool