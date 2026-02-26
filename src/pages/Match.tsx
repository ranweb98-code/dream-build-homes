import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MatchWizard } from '@/components/match/MatchWizard';

export default function Match() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="pt-20">
        <MatchWizard />
      </div>
    </Layout>
  );
}
