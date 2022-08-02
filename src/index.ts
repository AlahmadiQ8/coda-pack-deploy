import * as path from 'path';
import * as fs from 'fs';
import * as core from '@actions/core';

export async function run() {
  const pathToPackFile = core.getInput('path-to-pack-dot-ts', { required: true, trimWhitespace: true });
  const apiToken = core.getInput('coda-api-token', { required: true, trimWhitespace: true });

  core.debug(`hi: ${process.cwd()}`)
  console.log(`hi: ${process.cwd()}`);
  
}

run().catch(core.setFailed);
