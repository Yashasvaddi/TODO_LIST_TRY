import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Users, MessageCircle, ThumbsUp, Share, Star, Phone, Video, MessageSquare } from 'lucide-react';

// Mock data for farmer community
const communityPosts = [
  {
    id: 1,
    farmer: {
      name: 'राम कुमार शर्मा',
      location: 'कानपुर, उत्तर प्रदेश',
      avatar: null,
      verified: true,
      rating: 4.8
    },
    content: 'धान की फसल में भूरा धब्बा रोग दिख रहा है। कोई अच्छा समाधान बताएं। अभी तक प्रोपिकोनाजोल का स्प्रे किया है लेकिन कोई फायदा नहीं हुआ।',
    timestamp: '2 घंटे पहले',
    likes: 12,
    comments: 8,
    shares: 3,
    category: 'रोग प्रबंधन',
    images: ['धान_फसल.jpg'],
    hasExpertReply: true
  },
  {
    id: 2,
    farmer: {
      name: 'सुनीता देवी',
      location: 'पटना, बिहार',
      avatar: null,
      verified: true,
      rating: 4.6
    },
    content: 'इस साल टमाटर की खेती से बहुत अच्छा मुनाफा हुआ है। पॉली हाउस में हाइब्रिड किस्म लगाई थी। 1 एकड़ से 500 क्विंटल उत्पादन मिला। सभी को सुझाव है कि संरक्षित खेती करें।',
    timestamp: '5 घंटे पहले',
    likes: 45,
    comments: 23,
    shares: 18,
    category: 'सफलता की कहानी',
    images: ['टमाटर_फसल.jpg', 'पॉली_हाउस.jpg'],
    hasExpertReply: false
  },
  {
    id: 3,
    farmer: {
      name: 'अमित कुमार पटेल',
      location: 'अहमदाबाद, गुजरात',
      avatar: null,
      verified: false,
      rating: 4.2
    },
    content: 'कपास में सफेद मक्खी का अटैक है। कृपया जैविक तरीके से नियंत्रण के उपाय बताएं। रासायनिक दवा का प्रयोग नहीं करना चाहता।',
    timestamp: '1 दिन पहले',
    likes: 28,
    comments: 15,
    shares: 7,
    category: 'कीट नियंत्रण',
    images: ['कपास_फसल.jpg'],
    hasExpertReply: true
  }
];

const expertReplies = [
  {
    postId: 1,
    expert: {
      name: 'डॉ. राजेश कुमार',
      title: 'कृषि वैज्ञानिक, IARI',
      verified: true
    },
    reply: 'राम कुमार जी, भूरा धब्बा रोग के लिए ट्राइसाइक्लाजोल का स्प्रे करें। 500ml/एकड़ की दर से। 10 दिन बाद दोबारा स्प्रे करें। साथ ही खेत में पानी न भरने दें।',
    timestamp: '1 घंटा पहले',
    likes: 8
  },
  {
    postId: 3,
    expert: {
      name: 'डॉ. प्रिया शर्मा',
      title: 'कीट विशेषज्ञ, PAU',
      verified: true
    },
    reply: 'जैविक नियंत्रण के लिए नीम तेल 3ml/लीटर पानी में मिलाकर छिड़काव करें। साथ ही पीले स्टिकी ट्रैप लगाएं। बीटी कॉटन की किस्म का चुनाव करें।',
    timestamp: '8 घंटे पहले',
    likes: 15
  }
];

const whatsappGroups = [
  {
    name: 'UP किसान सहायता ग्रुप',
    members: 2500,
    category: 'राज्य समूह',
    description: 'उत्तर प्रदेश के किसानों के लिए',
    admin: 'कृषि विभाग UP',
    activeToday: 450
  },
  {
    name: 'धान किसान संघ',
    members: 1800,
    category: 'फसल विशिष्ट',
    description: 'धान की खेती संबंधी चर्चा',
    admin: 'डॉ. सुरेश गुप्ता',
    activeToday: 320
  },
  {
    name: 'जैविक खेती समुदाय',
    members: 1200,
    category: 'विशिष्ट तकनीक',
    description: 'जैविक खेती के तरीके',
    admin: 'राम प्रकाश वर्मा',
    activeToday: 180
  },
  {
    name: 'किसान उत्पादक संगठन',
    members: 3200,
    category: 'व्यावसायिक',
    description: 'बाजार और मूल्य की जानकारी',
    admin: 'FPO महासंघ',
    activeToday: 680
  }
];

const videoSessions = [
  {
    id: 1,
    title: 'गेहूं में रोग प्रबंधन - लाइव सत्र',
    expert: 'डॉ. अनिल कुमार सिंह',
    institution: 'IARI, नई दिल्ली',
    scheduledTime: 'आज शाम 6:00 बजे',
    duration: '1 घंटा',
    participants: 450,
    language: 'हिंदी',
    status: 'आज'
  },
  {
    id: 2,
    title: 'जैविक खाद बनाने की तकनीक',
    expert: 'डॉ. सुमित्रा देवी',
    institution: 'PAU, लुधियाना',
    scheduledTime: 'कल सुबह 10:00 बजे',
    duration: '45 मिनट',
    participants: 280,
    language: 'हिंदी/पंजाबी',
    status: 'कल'
  },
  {
    id: 3,
    title: 'ड्रिप इरिगेशन सिस्टम सेटअप',
    expert: 'राजेश पटेल',
    institution: 'AAU, गुजरात',
    scheduledTime: '5 फरवरी शाम 4:00 बजे',
    duration: '1.5 घंटा',
    participants: 320,
    language: 'हिंदी/गुजराती',
    status: 'आगामी'
  }
];

export function FarmerCommunity() {
  const [selectedTab, setSelectedTab] = useState('community');
  const [newPost, setNewPost] = useState('');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'रोग प्रबंधन': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'कीट नियंत्रण': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'सफलता की कहानी': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>किसान समुदाय केंद्र</h1>
        <p className="text-muted-foreground">
          किसानों का डिजिटल मंच - ज्ञान साझाकरण, सहायता और विशेषज्ञ सलाह
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल सदस्य</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.45 लाख</div>
            <p className="text-xs text-muted-foreground">+2,450 इस सप्ताह</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">आज के पोस्ट</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">+18% से कल</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">विशेषज्ञ उत्तर</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
            <p className="text-xs text-muted-foreground">आज</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">व्हाट्सएप ग्रुप</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">सक्रिय समूह</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">लाइव सत्र</CardTitle>
            <Video className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">इस सप्ताह</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="community">समुदायिक चर्चा</TabsTrigger>
          <TabsTrigger value="whatsapp">व्हाट्सएप ग्रुप</TabsTrigger>
          <TabsTrigger value="video">वीडियो सत्र</TabsTrigger>
          <TabsTrigger value="analytics">विश्लेषण</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="space-y-6">
          {/* New Post */}
          <Card>
            <CardHeader>
              <CardTitle>नया प्रश्न पोस्ट करें</CardTitle>
              <CardDescription>
                अपनी समस्या साझा करें और समुदाय से मदद लें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="अपनी कृषि संबंधी समस्या या सवाल यहाँ लिखें..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-20"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">📷 फोटो जोड़ें</Button>
                  <Button variant="outline" size="sm">📍 स्थान</Button>
                </div>
                <Button>पोस्ट करें</Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.farmer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{post.farmer.name}</h3>
                          {post.farmer.verified && (
                            <Badge variant="default" className="text-xs">✓ सत्यापित</Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{post.farmer.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.farmer.location}</p>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.content}</p>
                  
                  {post.hasExpertReply && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                      {expertReplies
                        .filter(reply => reply.postId === post.id)
                        .map((reply, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default" className="bg-blue-600">
                                विशेषज्ञ उत्तर
                              </Badge>
                              <span className="font-medium text-blue-800 dark:text-blue-200">
                                {reply.expert.name}
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-300">
                                {reply.expert.title}
                              </span>
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {reply.reply}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-blue-600 dark:text-blue-400">
                              <span>{reply.timestamp}</span>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{reply.likes}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        पसंद
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        टिप्पणी
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>व्हाट्सएप किसान समुदाय</CardTitle>
              <CardDescription>
                विषयवार और क्षेत्रवार व्हाट्सएप समूहों से जुड़ें
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatsappGroups.map((group, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">सदस्य:</span>
                        <span className="font-medium">{group.members.toLocaleString('hi-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">आज सक्रिय:</span>
                        <span className="font-medium text-green-600">{group.activeToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">एडमिन:</span>
                        <span className="font-medium">{group.admin}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      व्हाट्सएप ग्रुप ज्वाइन करें
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Bot Stats */}
          <Card>
            <CardHeader>
              <CardTitle>व्हाट्सएप बॉट उपयोग</CardTitle>
              <CardDescription>
                किसान मित्र व्हाट्सएप बॉट की गतिविधि रिपोर्ट
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1.25 लाख</div>
                  <p className="text-sm text-green-700 dark:text-green-300">सक्रिय उपयोगकर्ता</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15,240</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">दैनिक संदेश</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">92%</div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">समाधान दर</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1.8 सेकंड</div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">औसत प्रतिक्रिया</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>लाइव वीडियो सत्र</CardTitle>
              <CardDescription>
                कृषि विशेषज्ञों के साथ सीधी बातचीत और प्रशिक्षण सत्र
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videoSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.expert} • {session.institution}
                        </p>
                      </div>
                      <Badge variant={session.status === 'आज' ? 'destructive' : 
                                   session.status === 'कल' ? 'secondary' : 'outline'}>
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">समय:</span>
                        <div className="font-medium">{session.scheduledTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">अवधि:</span>
                        <div className="font-medium">{session.duration}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">भाषा:</span>
                        <div className="font-medium">{session.language}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">पंजीकृत:</span>
                        <div className="font-medium text-green-600">{session.participants}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {session.status === 'आज' ? (
                        <Button className="bg-red-600 hover:bg-red-700">
                          <Video className="h-4 w-4 mr-2" />
                          लाइव ज्वाइन करें
                        </Button>
                      ) : (
                        <Button variant="outline">
                          <Video className="h-4 w-4 mr-2" />
                          पंजीकरण करें
                        </Button>
                      )}
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        फोन से ज्वाइन करें
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Past Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>पिछले सत्रों की रिकॉर्डिंग</CardTitle>
              <CardDescription>
                महत्वपूर्ण प्रशिक्षण सत्रों की वीडियो लाइब्रेरी
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  'गेहूं में खरपतवार नियंत्रण',
                  'जैविक कीट प्रबंधन तकनीक',
                  'ड्रोन तकनीक का उपयोग',
                  'मृदा स्वास्थ्य प्रबंधन',
                  'फसल बीमा योजना',
                  'कृषि मार्केटिंग रणनीति'
                ].map((title, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-sm">{title}</h4>
                    <p className="text-xs text-muted-foreground">अवधि: 45 मिनट</p>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      देखें
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Community Engagement Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>सामुदायिक सहभागिता</CardTitle>
                <CardDescription>
                  राज्यवार किसान समुदाय की गतिविधि
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { state: 'उत्तर प्रदेश', posts: 3200, active: 45000 },
                  { state: 'मध्य प्रदेश', posts: 2800, active: 38000 },
                  { state: 'महाराष्ट्र', posts: 2400, active: 35000 },
                  { state: 'कर्नाटक', posts: 1900, active: 28000 },
                  { state: 'पंजाब', posts: 1600, active: 22000 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.state}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span>पोस्ट: {item.posts}</span>
                      <span>सक्रिय: {item.active.toLocaleString('hi-IN')}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>विषयवार चर्चा</CardTitle>
                <CardDescription>
                  सबसे ज्यादा चर्चित कृषि विषय
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { topic: 'रोग प्रबंधन', percentage: 28 },
                  { topic: 'कीट नियंत्रण', percentage: 22 },
                  { topic: 'मौसम सलाह', percentage: 18 },
                  { topic: 'बाजार मूल्य', percentage: 15 },
                  { topic: 'सरकारी योजना', percentage: 17 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.topic}</span>
                      <span className="text-sm">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Expert Response Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>विशेषज्ञ प्रतिक्रिया विश्लेषण</CardTitle>
              <CardDescription>
                कृषि विशेषज्ञों की गतिविधि और प्रभावशीलता
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">340</div>
                  <p className="text-sm text-green-700 dark:text-green-300">आज के उत्तर</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.3 घंटे</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">औसत प्रतिक्रिया समय</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">94%</div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">संतुष्टि दर</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">145</div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">सक्रिय विशेषज्ञ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}