import { CONFIG } from 'src/config-global';
import { AnalyticsView } from 'src/sections/analytics/view';

export default function Page() {
  return (
    <>
      <title>{`Analytics - ${CONFIG.appName}`}</title>
      <AnalyticsView />
    </>
  );
}
