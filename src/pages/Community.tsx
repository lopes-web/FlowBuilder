
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { SearchBar } from '@/components/ui/SearchBar';
import { useState } from 'react';

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">Community</h1>
          <p className="text-muted-foreground mt-2">
            Discover and share Elementor widgets with the community
          </p>
        </div>
        
        {/* Search */}
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search community widgets..."
        />
        
        {/* Community Feed */}
        <CommunityFeed />
      </div>
    </MainLayout>
  );
}
