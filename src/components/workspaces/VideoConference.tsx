import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Users, 
  MessageSquare, 
  Share, 
  Settings,
  MoreHorizontal,
  Hand,
  Circle
} from 'lucide-react'

const VideoConference = () => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  
  const participants = [
    { name: 'John Doe (You)', role: 'Host', avatar: 'JD', isPresenting: false, isMuted: false },
    { name: 'Sarah Johnson', role: 'Presenter', avatar: 'SJ', isPresenting: true, isMuted: false },
    { name: 'Mike Wilson', role: 'Participant', avatar: 'MW', isPresenting: false, isMuted: true },
    { name: 'Emily Chen', role: 'Participant', avatar: 'EC', isPresenting: false, isMuted: false },
    { name: 'David Brown', role: 'Participant', avatar: 'DB', isPresenting: false, isMuted: true },
    { name: 'Lisa Garcia', role: 'Participant', avatar: 'LG', isPresenting: false, isMuted: false },
  ]

  const chatMessages = [
    { user: 'Sarah Johnson', message: 'Good morning everyone! Thanks for joining.', time: '10:00' },
    { user: 'Mike Wilson', message: 'Morning! Looking forward to the presentation.', time: '10:01' },
    { user: 'Emily Chen', message: 'Can everyone see the slides clearly?', time: '10:02' },
    { user: 'David Brown', message: 'Yes, looks great on my end.', time: '10:02' },
    { user: 'Lisa Garcia', message: 'Perfect here too. Ready when you are!', time: '10:03' },
  ]

  return (
    <div className="h-full bg-[#1f1f1f] text-white flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Meeting Header */}
        <div className="bg-[#2d2d2d] p-4 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Q1 Strategy Review Meeting</h1>
            <Badge variant="secondary" className="bg-red-600 text-white">
              <Circle className="w-3 h-3 mr-1 fill-current" />
              {isRecording ? 'Recording' : 'Not Recording'}
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>Meeting ID: 123-456-789</span>
            <span>•</span>
            <span>Duration: 23:45</span>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          {/* Main Presenter View */}
          <div className="h-2/3 mb-4">
            <Card className="h-full bg-[#2d2d2d] border-gray-600 relative overflow-hidden">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                    SJ
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                  <Badge variant="secondary" className="bg-blue-600">Presenting</Badge>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-black/50">
                  <Share className="w-3 h-3 mr-1" />
                  Screen Sharing
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 rounded p-2">
                  <p className="text-sm">"As you can see from the Q4 results, we've exceeded our targets by 15%. This positions us well for the upcoming quarter..."</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Participant Thumbnails */}
          <div className="h-1/3">
            <div className="grid grid-cols-5 gap-2 h-full">
              {participants.slice(0, 5).map((participant, index) => (
                <Card key={index} className="bg-[#2d2d2d] border-gray-600 relative overflow-hidden">
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold mb-2 mx-auto">
                        {participant.avatar}
                      </div>
                      <p className="text-xs font-medium truncate">{participant.name.split(' ')[0]}</p>
                    </div>
                  </div>
                  {participant.isMuted && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <MicOff className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                  {participant.name.includes('You') && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs bg-blue-600">You</Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#2d2d2d] p-4 border-t border-gray-600">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full w-12 h-12 p-0"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <Share className="w-5 h-5" />
            </Button>
            
            <Button
              variant={isRecording ? "destructive" : "secondary"}
              size="lg"
              onClick={() => setIsRecording(!isRecording)}
              className="rounded-full w-12 h-12 p-0"
            >
              <Circle className="w-5 h-5 fill-current" />
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <Hand className="w-5 h-5" />
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-12 h-12 p-0 ml-8"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-[#2d2d2d] border-l border-gray-600 flex flex-col">
        {/* Sidebar Tabs */}
        <div className="flex border-b border-gray-600">
          <Button variant="ghost" className="flex-1 rounded-none border-b-2 border-blue-500 text-blue-400">
            <Users className="w-4 h-4 mr-2" />
            Participants ({participants.length})
          </Button>
          <Button variant="ghost" className="flex-1 rounded-none">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>

        {/* Participants List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {participant.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-gray-400">{participant.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {participant.isPresenting && (
                    <Badge variant="secondary" className="text-xs bg-blue-600">Presenting</Badge>
                  )}
                  {participant.isMuted && (
                    <MicOff className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section (Hidden by default, shown when chat tab is active) */}
        <div className="hidden flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-blue-400">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-gray-300">{msg.message}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-600">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
              />
              <Button size="sm">Send</Button>
            </div>
          </div>
        </div>

        {/* Meeting Info */}
        <div className="p-4 border-t border-gray-600">
          <div className="text-xs text-gray-400 space-y-1">
            <div>Host: John Doe</div>
            <div>Started: 10:00 AM</div>
            <div>Scheduled: 1 hour</div>
            <div>Recording: {isRecording ? 'Active' : 'Inactive'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoConference