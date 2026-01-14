import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle, Database, RefreshCw } from 'lucide-react';

export default function Admin() {
  const { sheetUrl, updateSheetUrl, clearSheetUrl, isUsingSheet, loading, error, refetch } = usePropertyContext();
  const [inputUrl, setInputUrl] = useState(sheetUrl);

  const handleSave = () => {
    updateSheetUrl(inputUrl);
    if (inputUrl.trim()) toast.success('Sheet URL saved!');
  };

  const handleClear = () => {
    clearSheetUrl();
    setInputUrl('');
    toast.success('Using sample data');
  };

  return (
    <Layout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-3xl font-bold mb-2">Admin Setup</h1>
          <p className="text-muted-foreground mb-8">Connect your Google Sheet to display your properties.</p>

          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <span className="font-medium">Data Source:</span>
              <span className={isUsingSheet ? 'text-success' : 'text-muted-foreground'}>
                {isUsingSheet ? 'Google Sheet' : 'Sample Data'}
              </span>
            </div>

            <div className="space-y-2">
              <Label>Google Sheet URL</Label>
              <Input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." />
              <p className="text-sm text-muted-foreground">Make sure your sheet is publicly accessible (Share → Anyone with link).</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm"><AlertCircle className="h-4 w-4" />{error}</div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Save & Load</Button>
              <Button variant="outline" onClick={handleClear}>Use Sample Data</Button>
              {isUsingSheet && <Button variant="ghost" onClick={refetch}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>}
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-2">Required Sheet Columns:</h3>
              <code className="text-sm bg-muted p-3 rounded block">id, title, price, city, area, rooms, baths, size, description, status, images, featured</code>
              <p className="text-sm text-muted-foreground mt-2">• <strong>status</strong>: "for_sale" or "sold"<br />• <strong>images</strong>: comma-separated URLs<br />• <strong>featured</strong>: "true" or "false"</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
