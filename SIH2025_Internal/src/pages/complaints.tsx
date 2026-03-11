import { CONFIG } from 'src/config-global';
import { ComplaintsView } from 'src/sections/complaints/view';

export default function Page() {
  return (
    <>
      <title>{`Complaints - ${CONFIG.appName}`}</title>
      <ComplaintsView />
    </>
  );
}
