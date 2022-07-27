const MIN_VERSION = 14;
const nodeVersion = process.version.replace(/^v/, '');
const [nodeMajorVersion] = nodeVersion.split('.');

console.log('Checking system requirements...');
if (nodeMajorVersion < MIN_VERSION) {
  console.warn(`------------------------------------------------ \n` +
  `node version ${nodeVersion} is incompatible with this module. \n ` +
    `Expected version >=${MIN_VERSION} \n` +
    `------------------------------------------------`);
  process.exit(1);
}