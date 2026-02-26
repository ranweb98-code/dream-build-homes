import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Trophy, Flame, Bed, Bath, Maximize, DollarSign, RotateCcw, ArrowRight, Heart, Calculator, Eye, Phone } from 'lucide-react';
import { ScoredProperty, MatchPreferences } from '@/types/match';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MatchResultsProps {
  results: ScoredProperty[];
  prefs: MatchPreferences;
  onBack: () => void;
  onRestart: () => void;
}

export function MatchResults({ results, prefs, onBack, onRestart }: MatchResultsProps) {
  const { toast } = useToast();
  const [showLead, setShowLead] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const topMatch = results[0];
  const alternatives = results.slice(1, 4);

  const formatPrice = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const formatSize = (n: number) => new Intl.NumberFormat('en-US').format(n);

  const submitLead = async () => {
    if (!leadEmail && !leadPhone) return;
    setSubmitting(true);
    try {
      await supabase.from('inquiries').insert({
        full_name: 'Match Assistant Lead',
        email: leadEmail || 'not-provided@match.com',
        phone: leadPhone || 'N/A',
        message: `AI Match inquiry. Budget: ${formatPrice(prefs.budget[0])}–${formatPrice(prefs.budget[1])}, Use: ${prefs.use}, Style: ${prefs.style}, Bedrooms: ${prefs.bedrooms}`,
        preferred_contact: 'either',
        property_id: topMatch?.property.id,
        property_title: topMatch?.property.title,
      });
      toast({ title: 'Got it!', description: "We'll reach out with personalized options." });
      setShowLead(false);
    } catch {
      toast({ title: 'Error', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (results.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md animate-fade-up">
          <h2 className="text-2xl font-bold">No matches found</h2>
          <p className="text-muted-foreground">We couldn't find homes matching your exact criteria. Try adjusting your preferences.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onBack} variant="outline">Go Back</Button>
            <Button onClick={onRestart}>Start Over</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Top Match */}
      {topMatch && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold">Your Perfect Match</h2>
          </div>
          <div className="bg-card border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={topMatch.property.images[0] || '/placeholder.svg'}
                alt={topMatch.property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
                  {topMatch.score}% Match
                </Badge>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/70 to-transparent p-6">
                <p className="text-3xl font-bold text-background">{formatPrice(topMatch.property.price)}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <h3 className="text-xl font-bold">{topMatch.property.title}</h3>

              {/* Specs */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {topMatch.property.rooms} Beds</span>
                <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {topMatch.property.baths} Baths</span>
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {formatSize(topMatch.property.size)} sqft</span>
              </div>

              {/* Why it matches */}
              {topMatch.reasons.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold">Why this is your match:</p>
                  <ul className="space-y-1">
                    {topMatch.reasons.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-0.5">✓</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Financing */}
              <div className="bg-primary/5 rounded-xl p-4 flex items-center gap-3">
                <Calculator className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Estimated monthly cost: <span className="text-primary">{formatPrice(topMatch.monthlyPayment)}/mo</span></p>
                  <p className="text-xs text-muted-foreground">10% down ({formatPrice(topMatch.downPayment)}) · 30yr @ 7%</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/properties/${topMatch.property.id}`}>
                  <Button className="w-full gap-2"><Eye className="h-4 w-4" /> View Details</Button>
                </Link>
                <Button variant="outline" className="gap-2" onClick={() => setShowLead(true)}>
                  <Phone className="h-4 w-4" /> Contact Advisor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-bold">Also Great For You</h3>
          </div>
          <div className="grid gap-4">
            {alternatives.map((item) => (
              <div key={item.property.id} className="bg-card border rounded-xl p-4 flex gap-4 items-center">
                <img
                  src={item.property.images[0] || '/placeholder.svg'}
                  alt={item.property.title}
                  className="w-24 h-24 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{item.property.title}</h4>
                    <Badge variant="secondary" className="shrink-0">{item.score}%</Badge>
                  </div>
                  <p className="text-lg font-bold">{formatPrice(item.property.price)}</p>
                  <p className="text-xs text-muted-foreground">{item.property.rooms} bed · {item.property.baths} bath · {formatSize(item.property.size)} sqft</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. {formatPrice(item.monthlyPayment)}/mo</p>
                </div>
                <Link to={`/properties/${item.property.id}`}>
                  <Button size="sm" variant="outline"><ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Capture */}
      {!showLead ? (
        <div className="bg-muted/50 rounded-2xl p-6 text-center space-y-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-bold">Want personalized deals and availability in your area?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setShowLead(true)} className="gap-2">
              <Heart className="h-4 w-4" /> Yes — Get My Options
            </Button>
            <Button variant="ghost" onClick={onRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Start Over
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl p-6 space-y-4 animate-scale-in">
          <h3 className="text-lg font-bold">Get personalized options</h3>
          <p className="text-sm text-muted-foreground">We'll reach out with the best deals matching your preferences.</p>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Your email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Phone number (optional)"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={submitLead} disabled={submitting || (!leadEmail && !leadPhone)} className="flex-1">
              {submitting ? 'Sending...' : 'Get My Options'}
            </Button>
            <Button variant="ghost" onClick={() => setShowLead(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Restart */}
      <div className="text-center">
        <Button variant="link" onClick={onRestart} className="gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" /> Start a new match
        </Button>
      </div>
    </div>
  );
}
