import dotenv from 'dotenv';
import glob from 'glob';
import { Config } from './../types';

export const loadConfig = async (config: Config) => {
  loadEnv();

  let includeImports = {};
  const typeormImports = await importTypeormDep(process.env.TYPEORM_ENTITIES);
  for (let i = 0; i < config.includes.length; i++) {
    const newIncludeImports = await importDep(config.includes[i]);
    includeImports = {
      ...newIncludeImports,
      ...includeImports,
    };
  }
  return {
    ...typeormImports,
  };
};

const loadEnv = () => {
  const result = dotenv.config();

  if (result.error) {
    console.log('no .env file found');
  }
};

const importTypeormDep = async (includeGlob: string | any) => {
  if (!includeGlob) {
    return;
  }

  const entitiesImport = await importDep(includeGlob);
  let getRepository;

  try {
    getRepository = (await import('typeorm')).getRepository;
  } catch (e) {
    console.log(e);
  }

  return {
    getRepository,
    ...entitiesImport,
  };
};

const importDep = async (includeGlob: string | any) => {
  if (!includeGlob) {
    return;
  }

  let imports: { [key: string]: string } = {};
  const files = await glob.sync(includeGlob);

  for (let i = 0; i < files.length; i++) {
    const filename = files[i].split('.ts')[0];
    const importedModule = await import(`./${filename}`);

    for (const mod in importedModule) {
      if (mod == 'default') {
        imports[filename.split('.')[0]] = importedModule.default;
        continue;
      }

      imports[mod as string] = importedModule[mod];
    }
  }

  return imports;
};



