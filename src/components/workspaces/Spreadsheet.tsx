import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Save, 
  Download, 
  Upload, 
  Printer, 
  Share, 
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Percent,
  DollarSign
} from 'lucide-react'

interface CellData {
  value: string | number
  formula?: string
  format?: 'currency' | 'percentage' | 'number' | 'text'
  style?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    align?: 'left' | 'center' | 'right'
    backgroundColor?: string
  }
}

const Spreadsheet = () => {
  const [selectedCell, setSelectedCell] = useState<string>('A1')
  const [formulaBar, setFormulaBar] = useState<string>('')
  const [data, setData] = useState<Record<string, CellData>>({})

  // Initialize with sample financial data
  useEffect(() => {
    const sampleData: Record<string, CellData> = {
      'A1': { value: 'Q4 2024 Financial Analysis', style: { bold: true, align: 'center' } },
      'A3': { value: 'Revenue Streams', style: { bold: true } },
      'A4': { value: 'Product Sales' },
      'A5': { value: 'Service Revenue' },
      'A6': { value: 'Licensing' },
      'A7': { value: 'Total Revenue', style: { bold: true } },
      'B3': { value: 'Q1', style: { bold: true, align: 'center' } },
      'C3': { value: 'Q2', style: { bold: true, align: 'center' } },
      'D3': { value: 'Q3', style: { bold: true, align: 'center' } },
      'E3': { value: 'Q4', style: { bold: true, align: 'center' } },
      'F3': { value: 'Total', style: { bold: true, align: 'center' } },
      'B4': { value: 2450000, format: 'currency' },
      'C4': { value: 2680000, format: 'currency' },
      'D4': { value: 2890000, format: 'currency' },
      'E4': { value: 3120000, format: 'currency' },
      'F4': { value: 11140000, format: 'currency', formula: '=SUM(B4:E4)' },
      'B5': { value: 890000, format: 'currency' },
      'C5': { value: 920000, format: 'currency' },
      'D5': { value: 980000, format: 'currency' },
      'E5': { value: 1050000, format: 'currency' },
      'F5': { value: 3840000, format: 'currency', formula: '=SUM(B5:E5)' },
      'B6': { value: 340000, format: 'currency' },
      'C6': { value: 380000, format: 'currency' },
      'D6': { value: 420000, format: 'currency' },
      'E6': { value: 460000, format: 'currency' },
      'F6': { value: 1600000, format: 'currency', formula: '=SUM(B6:E6)' },
      'B7': { value: 3680000, format: 'currency', formula: '=SUM(B4:B6)', style: { bold: true } },
      'C7': { value: 3980000, format: 'currency', formula: '=SUM(C4:C6)', style: { bold: true } },
      'D7': { value: 4290000, format: 'currency', formula: '=SUM(D4:D6)', style: { bold: true } },
      'E7': { value: 4630000, format: 'currency', formula: '=SUM(E4:E6)', style: { bold: true } },
      'F7': { value: 16580000, format: 'currency', formula: '=SUM(F4:F6)', style: { bold: true } },
      'A9': { value: 'Growth Analysis', style: { bold: true } },
      'A10': { value: 'QoQ Growth' },
      'B10': { value: 0, format: 'percentage' },
      'C10': { value: 0.081, format: 'percentage', formula: '=(C7-B7)/B7' },
      'D10': { value: 0.078, format: 'percentage', formula: '=(D7-C7)/C7' },
      'E10': { value: 0.079, format: 'percentage', formula: '=(E7-D7)/D7' },
    }
    setData(sampleData)
  }, [])

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  const rows = Array.from({ length: 25 }, (_, i) => i + 1)

  const formatCellValue = (cell: CellData): string => {
    if (typeof cell.value === 'number') {
      switch (cell.format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cell.value)
        case 'percentage':
          return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(cell.value)
        case 'number':
          return new Intl.NumberFormat('en-US').format(cell.value)
        default:
          return cell.value.toString()
      }
    }
    return cell.value.toString()
  }

  const getCellStyle = (cell: CellData) => {
    const style: React.CSSProperties = {}
    if (cell.style?.bold) style.fontWeight = 'bold'
    if (cell.style?.italic) style.fontStyle = 'italic'
    if (cell.style?.underline) style.textDecoration = 'underline'
    if (cell.style?.align) style.textAlign = cell.style.align
    if (cell.style?.backgroundColor) style.backgroundColor = cell.style.backgroundColor
    return style
  }

  const handleCellClick = (col: string, row: number) => {
    const cellId = `${col}${row}`
    setSelectedCell(cellId)
    const cell = data[cellId]
    setFormulaBar(cell?.formula || cell?.value?.toString() || '')
  }

  return (
    <div className="h-full bg-white text-black flex flex-col">
      {/* Excel-like Header */}
      <div className="bg-[#217346] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-bold">Microsoft Excel</span>
          <span className="text-sm">Financial_Analysis_Q4_2024.xlsx</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-600 text-white">AutoSave On</Badge>
          <span className="text-sm">Saved to OneDrive</span>
        </div>
      </div>

      {/* Ribbon */}
      <div className="bg-[#f3f2f1] border-b border-gray-300 p-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-xs">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Underline className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <DollarSign className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Percent className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Name Box and Formula Bar */}
      <div className="bg-white border-b border-gray-300 p-2 flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Name Box:</span>
          <Input 
            value={selectedCell} 
            readOnly 
            className="w-20 h-6 text-sm border-gray-300" 
          />
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-sm font-medium">fx</span>
          <Input 
            value={formulaBar}
            onChange={(e) => setFormulaBar(e.target.value)}
            className="flex-1 h-6 text-sm border-gray-300"
            placeholder="Enter formula or value..."
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-12 h-8 bg-[#f3f2f1] border border-gray-300 text-xs font-medium"></th>
              {columns.map((col) => (
                <th key={col} className="w-24 h-8 bg-[#f3f2f1] border border-gray-300 text-xs font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="w-12 h-8 bg-[#f3f2f1] border border-gray-300 text-xs font-medium text-center">
                  {row}
                </td>
                {columns.map((col) => {
                  const cellId = `${col}${row}`
                  const cell = data[cellId]
                  const isSelected = selectedCell === cellId
                  
                  return (
                    <td
                      key={cellId}
                      className={`w-24 h-8 border border-gray-300 text-xs cursor-pointer hover:bg-blue-50 ${
                        isSelected ? 'bg-blue-100 border-blue-500 border-2' : ''
                      }`}
                      onClick={() => handleCellClick(col, row)}
                      style={cell ? getCellStyle(cell) : {}}
                    >
                      <div className="px-2 py-1 h-full flex items-center">
                        {cell ? formatCellValue(cell) : ''}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="bg-[#f3f2f1] border-t border-gray-300 px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>Sheet1</span>
          <span>100%</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Sum: $16,580,000</span>
          <span>Count: 25</span>
          <span>Average: $663,200</span>
        </div>
      </div>
    </div>
  )
}

export default Spreadsheet