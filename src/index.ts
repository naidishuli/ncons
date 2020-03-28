import repl from 'repl';
import { loadConfig } from './loaders/config';
import config from './nconfig.json';

loadConfig(config).then(() => {
  const startRepl = async () => {
    const myRepl = repl.start('> ');

  };

  startRepl().then(() => {
  }).catch(err => {
    console.log(err);
  });
});




