import minimist from 'minimist';
// parse inputs
import keystore from './keystore';
import list from './list';

const args = minimist(process.argv.slice(2));
const commands = { keystore, list };
const command = args._[0];

if (!commands[command]) {
  throw new Error(`Command '${command}' not available`);
  // TODO show the available commands
}

commands[command](args);
