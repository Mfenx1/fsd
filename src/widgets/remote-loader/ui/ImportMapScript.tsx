import { getEnv } from '$shared';
import { getImportMapData } from '../config';


export const ImportMapScript = () => {
  const env = getEnv();
  const data = getImportMapData(env);
  const imports = Object.keys(data.imports);

  if (imports.length === 0) return null;

  return (
    <script
      type="importmap"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
};