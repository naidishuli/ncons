#!/usr/bin/env node

import repl from 'repl';
import { loadConfig } from './loaders/config';
import config from './nconfig.json';
import { load } from 'dotenv';

loadConfig(config).then(() => {
  const startRepl = async () => {
    const myRepl = repl.start('> ');
    myRepl.context.TestClass = (await import('./TestClass')).TestClass;

  };

  startRepl().then(() => {
  }).catch(err => {
    console.log(err);
  });
});




