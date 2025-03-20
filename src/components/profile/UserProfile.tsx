
import { useState } from 'react';
import { User, Settings, LogOut, Upload, Edit, CheckCircle } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  user: UserType;
}

export function UserProfile({ user }: UserProfileProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || ''
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setAvatarPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative space-y-8 animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-primary/20 bg-secondary">
            <img 
              src={avatarPreview} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          </div>
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <label 
                htmlFor="avatar-upload" 
                className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-full cursor-pointer hover:bg-black/80"
              >
                <Upload size={16} />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="hidden" 
                />
              </label>
            </div>
          )}
        </div>
        
        {/* User info */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="glass-input mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="glass-input mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="glass-input mt-1 min-h-[80px]"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              {user.bio && <p className="mt-3">{user.bio}</p>}
            </>
          )}
        </div>
        
        {/* Action buttons */}
        <div className={cn(
          "mt-4 sm:mt-0 ml-auto",
          isEditing ? "space-x-2" : "space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row"
        )}>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="glass-panel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle size={16} className="mr-2" /> Save Profile
                  </span>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="space-x-2 glass-panel"
              >
                <Edit size={16} /> <span>Edit Profile</span>
              </Button>
              <Button
                variant="outline"
                className="space-x-2 glass-panel"
              >
                <Settings size={16} /> <span>Settings</span>
              </Button>
              <Button
                variant="outline"
                className="space-x-2 text-destructive hover:text-destructive glass-panel"
              >
                <LogOut size={16} /> <span>Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* User stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-5 transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium">Total Widgets</h3>
          <p className="text-3xl font-bold mt-2">{user.widgetCount}</p>
        </div>
        
        <div className="glass-panel rounded-xl p-5 transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium">Favorites</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        
        <div className="glass-panel rounded-xl p-5 transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium">Public Widgets</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        
        <div className="glass-panel rounded-xl p-5 transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium">Member Since</h3>
          <p className="text-xl font-bold mt-2">{formatDate(user.joinedAt)}</p>
        </div>
      </div>
    </div>
  );
}
