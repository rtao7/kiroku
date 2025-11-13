'use client';

import { useState, useEffect } from 'react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, Settings, LogOut, ExternalLink, Trash2, Heart } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface LinkItem {
  _id: string;
  url: string;
  title?: string;
  description?: string;
  domain: string;
  createdAt: string;
  tags?: string[];
  isFavorite?: boolean;
}

interface LinksContainerProps {
  user: User;
}

export default function LinksContainer({ user }: LinksContainerProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [searchQuery]);

  const fetchLinks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/links?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async () => {
    if (!newUrl.trim()) return;

    setAddingLink(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl }),
      });

      if (response.ok) {
        setNewUrl('');
        fetchLinks();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add link');
      }
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Failed to add link');
    } finally {
      setAddingLink(false);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !isFavorite }),
      });

      if (response.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Saved Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {links.length} links saved
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter URL..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLink()}
              />
              <Button 
                onClick={addLink} 
                disabled={addingLink || !newUrl.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                {addingLink ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading links...</div>
          </div>
        ) : links.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">
                {searchQuery ? 'No links found matching your search.' : 'No links saved yet. Add your first link above!'}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Card key={link._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm block truncate"
                      >
                        {link.title || link.url}
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                      <div className="text-xs text-gray-500 mt-1">
                        {link.domain}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(link._id, link.isFavorite || false)}
                        className="h-6 w-6 p-0"
                      >
                        <Heart 
                          className={`w-3 h-3 ${
                            link.isFavorite 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLink(link._id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {link.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                  
                  {link.tags && link.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {link.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}