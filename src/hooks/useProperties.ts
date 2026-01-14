import { useState, useEffect, useCallback } from 'react';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isUsingSheet, setIsUsingSheet] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Fetch properties from edge function (public - no auth needed)
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-properties');

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        setError(data.error);
        setProperties([]);
        setIsUsingSheet(false);
      } else if (data.properties && data.properties.length > 0) {
        setProperties(data.properties);
        setIsUsingSheet(true);
      } else {
        setProperties([]);
        setIsUsingSheet(false);
      }
      setConfigLoaded(true);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to load properties');
      setProperties([]);
      setIsUsingSheet(false);
      setConfigLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load sheet URL from database (admin only - for admin panel)
  const loadSheetUrlFromDb = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'google_sheet_url')
        .maybeSingle();

      if (dbError) {
        // Not an admin or no access - that's fine, just return empty
        console.log('Could not load sheet URL (admin only)');
        return '';
      }
      
      const url = data?.value || '';
      setSheetUrl(url);
      return url;
    } catch (err) {
      console.error('Failed to load config:', err);
      return '';
    }
  }, []);

  const saveSheetUrlToDb = useCallback(async (url: string) => {
    try {
      const { error: dbError } = await supabase
        .from('site_config')
        .update({ value: url })
        .eq('key', 'google_sheet_url');

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      console.error('Failed to save config:', err);
      return false;
    }
  }, []);

  const clearSheetUrl = useCallback(async () => {
    const saved = await saveSheetUrlToDb('');
    if (saved) {
      setSheetUrl('');
      setProperties([]);
      setIsUsingSheet(false);
      setError(null);
    }
  }, [saveSheetUrlToDb]);

  const updateSheetUrl = useCallback(async (url: string) => {
    setSheetUrl(url);
    const saved = await saveSheetUrlToDb(url);
    if (saved) {
      await fetchProperties();
    }
  }, [saveSheetUrlToDb, fetchProperties]);

  // Load properties on mount via edge function
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const getPropertyById = useCallback((id: string): Property | undefined => {
    return properties.find((p) => String(p.id) === String(id));
  }, [properties]);

  const getFeaturedProperties = useCallback((): Property[] => {
    return properties.filter((p) => p.featured);
  }, [properties]);

  const getAvailableProperties = useCallback((): Property[] => {
    return properties.filter((p) => p.status === 'for_sale');
  }, [properties]);

  return {
    properties,
    loading,
    error,
    sheetUrl,
    isUsingSheet,
    configLoaded,
    updateSheetUrl,
    clearSheetUrl,
    loadSheetUrlFromDb,
    getPropertyById,
    getFeaturedProperties,
    getAvailableProperties,
    refetch: fetchProperties,
  };
}
