module.exports = {
  // TypeScript/JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'npx eslint --fix',
    'npx prettier --write',
  ],
  
  // JSON, YAML, Markdown files
  '*.{json,yaml,yml,md}': ['npx prettier --write'],
  
  // Package files - ensure lock file is updated
  'package.json': ['npx prettier --write'],
};

