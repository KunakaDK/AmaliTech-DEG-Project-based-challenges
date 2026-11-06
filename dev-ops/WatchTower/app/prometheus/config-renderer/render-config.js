const fs = require('node:fs');

const template = fs.readFileSync('/template/prometheus.yml', 'utf8');
const requiredVariables = [
  'ORDER_SERVICE_NAME',
  'ORDER_SERVICE_PORT',
  'TRACKING_SERVICE_NAME',
  'TRACKING_SERVICE_PORT',
  'NOTIFICATION_SERVICE_NAME',
  'NOTIFICATION_SERVICE_PORT',
];

for (const name of requiredVariables) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (name.endsWith('_PORT') && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535)) {
    throw new Error(`Invalid port value for ${name}: ${value}`);
  }

  if (name.endsWith('_NAME') && !/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(value)) {
    throw new Error(`Invalid service name for ${name}: ${value}`);
  }
}

const rendered = template.replace(/\$\{([A-Z_]+)\}/g, (placeholder, name) => {
  if (!requiredVariables.includes(name)) {
    throw new Error(`Unsupported template variable: ${name}`);
  }
  return process.env[name];
});

if (/\$\{[^}]+\}/.test(rendered)) {
  throw new Error('Unresolved variable found in rendered Prometheus configuration');
}

fs.writeFileSync('/output/prometheus.yml', rendered);
console.log('Rendered Prometheus configuration from the Compose environment.');
