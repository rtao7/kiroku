'use client';

import { useState, useEffect } from 'react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Copy, RefreshCw, Check } from 'lucide-react';
import Link from 'next/link';

interface SettingsContainerProps {
  user: User;
}

export default function SettingsContainer({ user }: SettingsContainerProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const response = await fetch('/api/user/apikey');
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey || '');
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/user/apikey', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
      } else {
        alert('Failed to generate API key');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      alert('Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback className="text-lg">
                  {user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-lg">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>
              Use this API key to sync your Chrome extension with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : apiKey ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">Your API Key</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="api-key"
                        type="text"
                        value={apiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Keep your API key secure. If you think it has been compromised,
                      regenerate it immediately.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={generateApiKey}
                    disabled={generating}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                    Regenerate API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You don't have an API key yet. Generate one to sync your Chrome
                    extension with this account.
                  </p>
                  <Button onClick={generateApiKey} disabled={generating}>
                    {generating ? 'Generating...' : 'Generate API Key'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chrome Extension Setup</CardTitle>
            <CardDescription>
              How to connect your Chrome extension
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Install the Kiroku Chrome extension</li>
                <li>Click the extension icon in your Chrome toolbar</li>
                <li>Click on the "Settings" or "Sync" option</li>
                <li>Paste your API key from above</li>
                <li>Your links will now sync automatically</li>
              </ol>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Once connected, all links you save in the extension will appear here,
                  and links you save here will appear in the extension.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
