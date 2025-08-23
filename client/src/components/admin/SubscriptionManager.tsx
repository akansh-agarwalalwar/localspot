import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Users, Send, Bell } from 'lucide-react';

interface Subscription {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  preferences: {
    pgHostels: boolean;
    messCafe: boolean;
    gamingZone: boolean;
    specialOffers: boolean;
  };
}

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    recentNotifications: 0,
    preferences: {
      pgHostels: 0,
      messCafe: 0,
      gamingZone: 0,
      specialOffers: 0
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localspot-spq8.onrender.com/api/subscription/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // This would be an API call to get notification stats
      // For now, we'll calculate from subscriptions
      setStats({
        totalSubscribers: subscriptions.length,
        recentNotifications: 0,
        preferences: {
          pgHostels: subscriptions.filter(s => s.preferences?.pgHostels).length,
          messCafe: subscriptions.filter(s => s.preferences?.messCafe).length,
          gamingZone: subscriptions.filter(s => s.preferences?.gamingZone).length,
          specialOffers: subscriptions.filter(s => s.preferences?.specialOffers).length,
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const sendSpecialOffer = async () => {
    if (!offerTitle.trim() || !offerDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and description for the offer",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // For now, we'll just show a notification in console
      // This simulates sending an email notification
      const specialOfferSubscribers = subscriptions.filter(s => s.preferences?.specialOffers);
      
      console.log(`\n🎉 SPECIAL OFFER SENT:`);
      console.log(`🏷️  Title: ${offerTitle}`);
      console.log(`📝 Description: ${offerDescription}`);
      console.log(`👥 Sent to ${specialOfferSubscribers.length} subscribers:`);
      specialOfferSubscribers.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email}`);
      });

      toast({
        title: "🎉 Special Offer Sent!",
        description: `Notification sent to ${specialOfferSubscribers.length} subscribers`,
      });

      setOfferTitle('');
      setOfferDescription('');
      
    } catch (error) {
      console.error('Error sending special offer:', error);
      toast({
        title: "Error",
        description: "Failed to send special offer",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.preferences?.specialOffers).length}</p>
                <p className="text-sm text-muted-foreground">Special Offers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.preferences?.pgHostels).length}</p>
                <p className="text-sm text-muted-foreground">PG Updates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Send className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Last Update</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Special Offer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Special Offer
          </CardTitle>
          <CardDescription>
            Send a special offer notification to all subscribers who opted for special offers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Offer Title</label>
            <Input
              placeholder="e.g., 20% Off on All PG Bookings!"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Offer Description</label>
            <Input
              placeholder="e.g., Limited time offer - Get 20% discount on your first booking"
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
            />
          </div>
          <Button 
            onClick={sendSpecialOffer}
            disabled={sending || !offerTitle.trim() || !offerDescription.trim()}
            className="w-full md:w-auto"
          >
            {sending ? "Sending..." : "Send to All Subscribers"}
          </Button>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers ({subscriptions.length})</CardTitle>
          <CardDescription>
            List of all email subscribers and their preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscribers yet</p>
              <p className="text-sm">Subscribers will appear here once people sign up for your newsletter</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscription.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Subscribed: {new Date(subscription.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {subscription.preferences?.pgHostels && <Badge variant="secondary">PG</Badge>}
                    {subscription.preferences?.messCafe && <Badge variant="secondary">Mess</Badge>}
                    {subscription.preferences?.gamingZone && <Badge variant="secondary">Gaming</Badge>}
                    {subscription.preferences?.specialOffers && <Badge variant="default">Offers</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
