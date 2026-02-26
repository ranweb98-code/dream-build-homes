import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ChevronLeft, Sparkles, Home, ArrowRight } from 'lucide-react';
import {
  MatchPreferences,
  BUDGET_OPTIONS,
  USE_OPTIONS,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  CLIMATE_OPTIONS,
  STYLE_OPTIONS,
  PRIORITY_OPTIONS,
} from '@/types/match';
import { MatchResults } from './MatchResults';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { scoreProperties } from '@/lib/matchScoring';
import { ScoredProperty } from '@/types/match';

const TOTAL_STEPS = 7;

export function MatchWizard() {
  const navigate = useNavigate();
  const { properties, loading } = usePropertyContext();
  const [step, setStep] = useState(0); // 0 = welcome
  const [results, setResults] = useState<ScoredProperty[] | null>(null);
  const [prefs, setPrefs] = useState<MatchPreferences>({
    budget: [50000, 150000],
    use: '',
    bedrooms: '',
    bathrooms: '',
    climate: '',
    style: '',
    priorities: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => {
    if (step === TOTAL_STEPS) {
      // Calculate results
      const scored = scoreProperties(properties, prefs);
      setResults(scored);
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step === TOTAL_STEPS + 1) {
      setResults(null);
    }
    setStep(Math.max(0, step - 1));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return true; // budget always has default
      case 2: return !!prefs.use;
      case 3: return !!prefs.bedrooms && !!prefs.bathrooms;
      case 4: return !!prefs.climate;
      case 5: return !!prefs.style;
      case 6: return prefs.priorities.length > 0;
      case 7: return true; // review step
      default: return true;
    }
  };

  const togglePriority = (p: string) => {
    setPrefs((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter((x) => x !== p)
        : [...prev.priorities, p],
    }));
  };

  const selectBudgetPreset = (range: [number, number]) => {
    setPrefs((prev) => ({ ...prev, budget: range }));
  };

  // Welcome screen
  if (step === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Find your perfect mobile home in under 60 seconds
          </h1>
          <p className="text-muted-foreground text-lg">
            Answer a few quick questions and we'll match you with the best home for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 gap-2" onClick={() => setStep(1)}>
              <Sparkles className="h-5 w-5" />
              Start Matching
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 gap-2"
              onClick={() => navigate('/properties')}
            >
              <Home className="h-5 w-5" />
              Browse All Homes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (step === TOTAL_STEPS + 1 && results) {
    return <MatchResults results={results} prefs={prefs} onBack={goBack} onRestart={() => { setStep(0); setResults(null); }} />;
  }

  return (
    <div className="min-h-[80vh] flex flex-col px-4 py-8 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={goBack} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 animate-fade-up" key={step}>
        {step === 1 && (
          <StepLayout title="What's your budget?">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUDGET_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.label}
                  label={opt.label}
                  selected={prefs.budget[0] === opt.range[0] && prefs.budget[1] === opt.range[1]}
                  onClick={() => selectBudgetPreset(opt.range)}
                />
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Or use the slider: <span className="font-semibold text-foreground">${prefs.budget[0].toLocaleString()} – ${prefs.budget[1].toLocaleString()}</span>
              </p>
              <Slider
                min={20000}
                max={500000}
                step={5000}
                value={prefs.budget}
                onValueChange={(v) => setPrefs((p) => ({ ...p, budget: v as [number, number] }))}
                className="py-4"
              />
            </div>
          </StepLayout>
        )}

        {step === 2 && (
          <StepLayout title="What will this home be used for?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {USE_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={prefs.use === opt} onClick={() => setPrefs((p) => ({ ...p, use: opt }))} />
              ))}
            </div>
          </StepLayout>
        )}

        {step === 3 && (
          <StepLayout title="Size & layout preferences">
            <p className="text-sm font-medium text-muted-foreground mb-3">Bedrooms</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {BEDROOM_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={prefs.bedrooms === opt} onClick={() => setPrefs((p) => ({ ...p, bedrooms: opt }))} />
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Bathrooms</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BATHROOM_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={prefs.bathrooms === opt} onClick={() => setPrefs((p) => ({ ...p, bathrooms: opt }))} />
              ))}
            </div>
          </StepLayout>
        )}

        {step === 4 && (
          <StepLayout title="Where will you place it?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CLIMATE_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={prefs.climate === opt} onClick={() => setPrefs((p) => ({ ...p, climate: opt }))} />
              ))}
            </div>
          </StepLayout>
        )}

        {step === 5 && (
          <StepLayout title="What style do you prefer?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLE_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={prefs.style === opt} onClick={() => setPrefs((p) => ({ ...p, style: opt }))} />
              ))}
            </div>
          </StepLayout>
        )}

        {step === 6 && (
          <StepLayout title="What matters most to you?" subtitle="Select all that apply">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRIORITY_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={prefs.priorities.includes(opt)} onClick={() => togglePriority(opt)} />
              ))}
            </div>
          </StepLayout>
        )}

        {step === 7 && (
          <StepLayout title="Ready to find your match!" subtitle="We'll analyze our inventory based on your preferences.">
            <div className="bg-muted/50 rounded-xl p-6 space-y-3 text-sm">
              <SummaryRow label="Budget" value={`$${prefs.budget[0].toLocaleString()} – $${prefs.budget[1].toLocaleString()}`} />
              <SummaryRow label="Use" value={prefs.use} />
              <SummaryRow label="Bedrooms" value={prefs.bedrooms} />
              <SummaryRow label="Bathrooms" value={prefs.bathrooms} />
              <SummaryRow label="Location" value={prefs.climate} />
              <SummaryRow label="Style" value={prefs.style} />
              <SummaryRow label="Priorities" value={prefs.priorities.join(', ')} />
            </div>
          </StepLayout>
        )}
      </div>

      {/* Next button */}
      <div className="mt-8 pt-4 border-t">
        <Button
          size="lg"
          className="w-full text-lg py-6 gap-2"
          disabled={!canProceed() || loading}
          onClick={goNext}
        >
          {step === TOTAL_STEPS ? (
            <>
              <Sparkles className="h-5 w-5" />
              {loading ? 'Loading properties...' : 'Find My Perfect Home'}
            </>
          ) : (
            <>
              Continue <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function StepLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full px-5 py-4 rounded-xl border-2 text-left font-medium transition-all duration-200 text-sm md:text-base',
        selected
          ? 'border-primary bg-primary/5 text-primary shadow-sm'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50'
      )}
    >
      {label}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}
