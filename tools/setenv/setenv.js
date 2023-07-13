const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const PREFIX = 'ANGULAR_';
const DIVIDER = '_';
const MULTILEVEL_DIVIDER = '__';
const OUTPUT_DIR = '/usr/share/nginx/html/mono-internet-banking-frontend/assets/configuration';
const BOOLEAN_VALUE_KEYWORDS = {
  yes: true,
  no: false,
  enabled: true,
  disabled: false,
  true: true,
  false: false,
};

const variables = {};

async function main() {
  console.log('[Node Script]: Setting environment variables');

  const envVars = (await execAsync('printenv')).stdout.split('\n');

  for (const env of envVars) {
    const [key, val] = env.split('=');
    if (key.startsWith(PREFIX)) assignValue(variables, key, val);
  }

  fs.writeFileSync(path.resolve(OUTPUT_DIR) + '/config.json', JSON.stringify(variables));

  console.log('[Node Script]: Config file was created');
}

function assignValue(variables, key = '', value) {
  const convertedValue = convertValue(value);

  if (!key.includes(MULTILEVEL_DIVIDER)) {
    variables[convertToCamelCase(key)] = convertedValue;
    return variables;
  }

  const [root, child] = key.split(MULTILEVEL_DIVIDER);
  const rootKey = convertToCamelCase(root);
  const subkey = convertToCamelCase(child);

  if (variables[rootKey] && typeof variables[rootKey] === 'object') {
    variables[rootKey][subkey] = convertedValue;
    return variables;
  }

  variables[rootKey] = {
    [subkey]: convertedValue,
  };
  return variables;
}

function convertToCamelCase(params = '') {
  const name = getVariableName(params);
  const [first, ...others] = name.toLowerCase().split(DIVIDER);
  const capitalCases = others.map((e) => e[0].toUpperCase() + e.slice(1));

  return first + capitalCases.join('');
}

function convertValue(value) {
  const booleanValue = BOOLEAN_VALUE_KEYWORDS[value.toLowerCase()];
  return typeof booleanValue === 'undefined' ? value : booleanValue;
}

function getVariableName(variable = '') {
  const prefixIndex = variable.indexOf(PREFIX);
  const firstSeparatorIndex = prefixIndex + PREFIX.length;

  return prefixIndex < 0 ? variable : variable.slice(firstSeparatorIndex);
}

main();
