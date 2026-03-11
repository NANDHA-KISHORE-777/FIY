import { CONFIG } from 'src/config-global';
import { IPCLibraryView } from 'src/sections/ipc-library/view';

export default function Page() {
  return (
    <>
      <title>{`IPC Library - ${CONFIG.appName}`}</title>
      <IPCLibraryView />
    </>
  );
}
