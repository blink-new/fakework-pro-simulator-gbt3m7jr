import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { 
  Mail, 
  Search, 
  Star, 
  Archive, 
  Trash2, 
  Reply, 
  Forward, 
  Paperclip,
  Calendar,
  Users,
  Settings,
  Twitter
} from 'lucide-react'
import TwitterFeed from '../TwitterFeed'

const EmailClient = () => {
  const [selectedEmail, setSelectedEmail] = useState(0)
  
  const emails = [
    {
      id: 1,
      from: 'Sarah Johnson <sarah.johnson@company.com>',
      subject: 'Q4 Budget Review Meeting - Action Items',
      preview: 'Following up on our budget review meeting yesterday. Please find attached the revised...',
      time: '2:34 PM',
      unread: true,
      important: true,
      hasAttachment: true
    },
    {
      id: 2,
      from: 'Microsoft Teams <noreply@teams.microsoft.com>',
      subject: 'Meeting invitation: Strategic Planning Session',
      preview: 'You have been invited to a meeting. Strategic Planning Session - Q1 2024 initiatives...',
      time: '1:45 PM',
      unread: true,
      important: false,
      hasAttachment: false
    },
    {
      id: 3,
      from: 'David Chen <david.chen@vendor.com>',
      subject: 'RE: Contract Renewal Discussion',
      preview: 'Thank you for the detailed proposal. I have reviewed the terms and have a few questions...',
      time: '11:23 AM',
      unread: false,
      important: false,
      hasAttachment: true
    },
    {
      id: 4,
      from: 'HR Department <hr@company.com>',
      subject: 'Annual Performance Review - Due March 31st',
      preview: 'This is a reminder that your annual performance review is due by March 31st...',
      time: '10:15 AM',
      unread: false,
      important: true,
      hasAttachment: false
    },
    {
      id: 5,
      from: 'Finance Team <finance@company.com>',
      subject: 'Expense Report Approval Required',
      preview: 'Your expense report for February 2024 requires approval. Total amount: $2,847.50...',
      time: '9:42 AM',
      unread: false,
      important: false,
      hasAttachment: true
    }
  ]

  const folders = [
    { name: 'Inbox', count: 23, icon: <Mail className="w-4 h-4" /> },
    { name: 'Sent Items', count: 0, icon: <Mail className="w-4 h-4" /> },
    { name: 'Drafts', count: 3, icon: <Mail className="w-4 h-4" /> },
    { name: 'Archive', count: 156, icon: <Archive className="w-4 h-4" /> },
    { name: 'Deleted Items', count: 12, icon: <Trash2 className="w-4 h-4" /> },
  ]

  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#f3f2f1] border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Outlook</span>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Mail className="w-4 h-4 mr-2" />
            New Email
          </Button>
        </div>

        {/* Folders */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            {folders.map((folder) => (
              <div key={folder.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer">
                <div className="flex items-center space-x-2">
                  {folder.icon}
                  <span className="text-sm">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-300">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              <Users className="w-4 h-4 mr-2" />
              People
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-96 border-r border-gray-300 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-300">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search mail and people"
              className="pl-10 border-gray-300"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {emails.map((email, index) => (
            <div
              key={email.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedEmail === index ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => setSelectedEmail(index)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {email.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  {email.important && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <span className={`text-sm ${email.unread ? 'font-semibold' : 'font-normal'}`}>
                    {email.from.split('<')[0].trim()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                  <span className="text-xs text-gray-500">{email.time}</span>
                </div>
              </div>
              <div className={`text-sm mb-1 ${email.unread ? 'font-semibold' : 'font-normal'}`}>
                {email.subject}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {email.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {/* Email Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{emails[selectedEmail].subject}</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
              <Button variant="ghost" size="sm">
                <Forward className="w-4 h-4 mr-1" />
                Forward
              </Button>
              <Button variant="ghost" size="sm">
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <div className="font-medium">{emails[selectedEmail].from}</div>
              <div>To: john.doe@company.com</div>
            </div>
            <div className="text-right">
              <div>{emails[selectedEmail].time}</div>
              <div>Today</div>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            <p>Dear John,</p>
            
            <p>I hope this email finds you well. Following up on our budget review meeting yesterday, I wanted to share the key action items and next steps we discussed.</p>
            
            <p><strong>Action Items:</strong></p>
            <ul>
              <li>Review Q4 expense reports by March 20th</li>
              <li>Prepare budget allocation proposal for new initiatives</li>
              <li>Schedule follow-up meeting with department heads</li>
              <li>Finalize vendor contract negotiations</li>
            </ul>
            
            <p><strong>Budget Highlights:</strong></p>
            <ul>
              <li>Total Q4 budget: $2.4M (5% under target)</li>
              <li>Marketing spend: $450K (within allocated range)</li>
              <li>Technology investments: $680K (approved for Q1 2024)</li>
              <li>Personnel costs: $1.1M (including new hires)</li>
            </ul>
            
            <p>Please find attached the detailed budget breakdown and the revised financial projections for Q1 2024. I've also included the vendor comparison analysis we discussed.</p>
            
            <p>Let me know if you have any questions or need clarification on any of the items. I'm available for a quick call this afternoon if needed.</p>
            
            <p>Best regards,<br/>
            Sarah Johnson<br/>
            Senior Financial Analyst<br/>
            sarah.johnson@company.com<br/>
            (555) 123-4567</p>
          </div>

          {/* Attachments */}
          {emails[selectedEmail].hasAttachment && (
            <Card className="mt-6 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm">Attachments (3)</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Q4_Budget_Review_2024.xlsx</span>
                  <span className="text-xs text-gray-500">245 KB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Financial_Projections_Q1.pdf</span>
                  <span className="text-xs text-gray-500">1.2 MB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Vendor_Analysis_Report.docx</span>
                  <span className="text-xs text-gray-500">890 KB</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Twitter Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Twitter className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Social Updates</h3>
          </div>
        </div>
        <div className="h-full">
          <TwitterFeed 
            compact={true}
            maxHeight="calc(100vh - 120px)"
            showHeader={false}
            title="Industry News"
          />
        </div>
      </div>
    </div>
  )
}

export default EmailClient