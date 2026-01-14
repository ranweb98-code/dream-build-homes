import { useState, useEffect, useCallback } from 'react';
import { Property } from '@/types/property';
import { sampleProperties } from '@/data/sampleProperties';

const SHEET_URL_KEY = 'property_sheet_url';

interface SheetRow {
  id: string;
  title: string;
  price: string;
  city: string;
  area: string;
  rooms: string;
  baths: string;
  size: string;
  description: string;
  status: string;
  images: string;
  featured: string;
}

function parseSheetData(data: SheetRow[]): Property[] {
  return data.map((row) => ({
    id: String(row.id || '').trim(),
    title: String(row.title || '').trim(),
    price: parseInt(String(row.price || '0').replace(/[^0-9]/g, ''), 10) || 0,
    city: String(row.city || '').trim(),
    area: String(row.area || '').trim(),
    rooms: parseInt(String(row.rooms || '0'), 10) || 0,
    baths: parseInt(String(row.baths || '0'), 10) || 0,
    size: parseInt(String(row.size || '0').replace(/[^0-9]/g, ''), 10) || 0,
    description: String(row.description || '').trim(),
    status: (String(row.status || 'for_sale').toLowerCase().trim() === 'sold' ? 'sold' : 'for_sale') as 'for_sale' | 'sold',
    images: String(row.images || '')
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0),
    featured: String(row.featured || '').toLowerCase().trim() === 'true',
  })).filter((property) => property.id && property.title);
}

function convertSheetUrlToJsonUrl(url: string): string | null {
  // Handle various Google Sheets URL formats
  const patterns = [
    /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const sheetId = match[1];
      return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    }
  }
  return null;
}

function parseGoogleSheetsResponse(text: string): SheetRow[] {
  // Google Sheets returns JSONP-like response, extract the JSON
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
  if (!jsonMatch) {
    throw new Error('Invalid Google Sheets response format');
  }

  const data = JSON.parse(jsonMatch[1]);
  const cols = data.table.cols.map((col: { label: string }) => 
    col.label.toLowerCase().trim()
  );
  const rows = data.table.rows;

  return rows.map((row: { c: Array<{ v: unknown } | null> }) => {
    const obj: Partial<SheetRow> = {};
    row.c.forEach((cell, index) => {
      const key = cols[index] as keyof SheetRow;
      if (key) {
        obj[key] = cell?.v != null ? String(cell.v) : '';
      }
    });
    return {
      id: obj.id || '',
      title: obj.title || '',
      price: obj.price || '',
      city: obj.city || '',
      area: obj.area || '',
      rooms: obj.rooms || '',
      baths: obj.baths || '',
      size: obj.size || '',
      description: obj.description || '',
      status: obj.status || '',
      images: obj.images || '',
      featured: obj.featured || '',
    };
  });
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SHEET_URL_KEY) || '';
    }
    return '';
  });
  const [isUsingSheet, setIsUsingSheet] = useState(false);

  const fetchFromSheet = useCallback(async (url: string) => {
    if (!url.trim()) {
      setProperties(sampleProperties);
      setIsUsingSheet(false);
      setError(null);
      return;
    }

    const jsonUrl = convertSheetUrlToJsonUrl(url);
    if (!jsonUrl) {
      setError('Invalid Google Sheets URL. Please use a valid sharing link.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data. Make sure the sheet is publicly accessible.');
      }

      const text = await response.text();
      const sheetData = parseGoogleSheetsResponse(text);
      const parsed = parseSheetData(sheetData);

      if (parsed.length === 0) {
        throw new Error('No valid properties found in the sheet. Check column headers.');
      }

      setProperties(parsed);
      setIsUsingSheet(true);
      localStorage.setItem(SHEET_URL_KEY, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
      setProperties(sampleProperties);
      setIsUsingSheet(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSheetUrl = useCallback(() => {
    localStorage.removeItem(SHEET_URL_KEY);
    setSheetUrl('');
    setProperties(sampleProperties);
    setIsUsingSheet(false);
    setError(null);
  }, []);

  const updateSheetUrl = useCallback((url: string) => {
    setSheetUrl(url);
    fetchFromSheet(url);
  }, [fetchFromSheet]);

  // Load from sheet on mount if URL exists
  useEffect(() => {
    if (sheetUrl) {
      fetchFromSheet(sheetUrl);
    }
  }, []);

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
    updateSheetUrl,
    clearSheetUrl,
    getPropertyById,
    getFeaturedProperties,
    getAvailableProperties,
    refetch: () => fetchFromSheet(sheetUrl),
  };
}
