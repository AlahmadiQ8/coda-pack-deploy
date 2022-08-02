import * as path from 'path';
import * as fs from 'fs';
import * as core from '@actions/core';
import * as io from '@actions/io';
import * as exec from "@actions/exec";

interface CodaConfig  {
  apiKey: string
}

export async function run() {
  const pathToPackFile = core.getInput('path-to-pack-dot-ts', { required: true, trimWhitespace: true });
  const apiKey = core.getInput('coda-api-token', { required: true, trimWhitespace: true });
  
  const projectRoot = process.cwd();
  const codaConfig: CodaConfig = { apiKey }
  const codaConfigFilePath = path.join(projectRoot, '.coda.json');

  // TODO: This is probably be a huge security risk. Need to invetigate best practices
  fs.writeFileSync(codaConfigFilePath, JSON.stringify(codaConfig));

  let output = '';
  let error = '';
  let options: exec.ExecOptions = {};
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString();
    },
    stderr: (data: Buffer) => {
      error += data.toString();
    }
  };

  const runnerTempDirectory = process.cwd(); 
  const pathToCodaCli = path.join(runnerTempDirectory, 'dist', 'coda-cli')
  await exec.exec(`node ${pathToCodaCli} upload ${pathToPackFile}`, [], options)

  // Remove file containing sensitive information just in case
  io.rmRF(codaConfigFilePath);

  console.log('---- HI ----');
  console.log(output);
  console.log(error);
}

run().catch(core.setFailed);
