import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle, Database, RefreshCw, LogOut } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, checkingAdmin, signOut } = useAuth();
  const { sheetUrl, updateSheetUrl, clearSheetUrl, isUsingSheet, loading, error, refetch, properties, loadSheetUrlFromDb } = usePropertyContext();
  const [inputUrl, setInputUrl] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Redirect to home if authenticated but not admin
  useEffect(() => {
    if (!authLoading && !checkingAdmin && user && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, authLoading, isAdmin, checkingAdmin, navigate]);

  // Load sheet URL for admin
  useEffect(() => {
    const loadUrl = async () => {
      if (user && isAdmin) {
        const url = await loadSheetUrlFromDb();
        setInputUrl(url);
      }
    };
    loadUrl();
  }, [user, isAdmin, loadSheetUrlFromDb]);

  // Update input when sheetUrl changes
  useEffect(() => {
    setInputUrl(sheetUrl);
  }, [sheetUrl]);

  // Validate Google Sheet URL format
  const validateSheetUrl = (url: string): { valid: boolean; error?: string } => {
    if (!url.trim()) {
      return { valid: true }; // Empty URL is allowed (clears config)
    }
    
    try {
      const parsed = new URL(url);
      
      // Only allow HTTPS
      if (parsed.protocol !== 'https:') {
        return { valid: false, error: 'Only HTTPS URLs are allowed' };
      }
      
      // Only allow Google Sheets domain
      if (parsed.hostname !== 'docs.google.com') {
        return { valid: false, error: 'Only Google Sheets URLs are allowed' };
      }
      
      // Validate spreadsheet path format
      if (!/\/spreadsheets\/d\/[a-zA-Z0-9-_]+/.test(url)) {
        return { valid: false, error: 'Invalid Google Sheets URL format. Use the share URL from your spreadsheet.' };
      }
      
      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  };

  const handleSave = async () => {
    const validation = validateSheetUrl(inputUrl);
    
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid URL');
      return;
    }
    
    await updateSheetUrl(inputUrl);
    if (inputUrl.trim()) {
      toast.success('Sheet URL saved and synced!');
    }
  };

  const handleClear = async () => {
    await clearSheetUrl();
    setInputUrl('');
    toast.success('Sheet URL cleared');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out successfully');
  };

  if (authLoading || checkingAdmin) {
    return (
      <Layout>
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Admin Setup</h1>
              <p className="text-muted-foreground">Connect your Google Sheet to display your properties.</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <span className="font-medium">Data Source:</span>
              {isUsingSheet ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Google Sheet ({properties.length} properties)
                </span>
              ) : (
                <span className="text-muted-foreground">No sheet connected</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Google Sheet URL</Label>
              <Input 
                value={inputUrl} 
                onChange={(e) => setInputUrl(e.target.value)} 
                placeholder="https://docs.google.com/spreadsheets/d/..." 
              />
              <p className="text-sm text-muted-foreground">
                Make sure your sheet is publicly accessible (Share → Anyone with link).
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save & Sync
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={loading}>
                Clear Sheet
              </Button>
              {isUsingSheet && (
                <Button variant="ghost" onClick={refetch} disabled={loading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              )}
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-2">Required Sheet Columns:</h3>
              <code className="text-sm bg-muted p-3 rounded block overflow-x-auto">
                id, title, price, city, area, rooms, baths, size, description, status, images, featured
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                • <strong>status</strong>: "for_sale" or "sold"<br />
                • <strong>images</strong>: comma-separated URLs<br />
                • <strong>featured</strong>: "true" or "false"
              </p>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-2">Logged in as:</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
