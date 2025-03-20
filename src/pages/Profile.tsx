
import { MainLayout } from '@/components/layout/MainLayout';
import { UserProfile } from '@/components/profile/UserProfile';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { currentUser, myWidgets } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Profile() {
  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    // In a real app, this would update the server
    console.log(`Toggled favorite status for widget ${id}`);
  };
  
  const publicWidgets = myWidgets.filter(widget => widget.isPublic);
  const privateWidgets = myWidgets.filter(widget => !widget.isPublic);
  
  return (
    <MainLayout>
      <div className="space-y-10 animate-fade-in">
        {/* User Profile */}
        <UserProfile user={currentUser} />
        
        {/* User's Widgets */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">My Widgets</h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="glass-panel">
              <TabsTrigger value="all">All ({myWidgets.length})</TabsTrigger>
              <TabsTrigger value="public">Public ({publicWidgets.length})</TabsTrigger>
              <TabsTrigger value="private">Private ({privateWidgets.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWidgets.map(widget => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="public" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicWidgets.map(widget => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="private" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {privateWidgets.map(widget => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
