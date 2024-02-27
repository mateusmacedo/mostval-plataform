module.exports = {
  '{libs,apps}/**/*.{js,ts,tsx}': [
    'nx affected --target test --uncommitted',
    'nx affected --target lint --uncommitted --fix=true',
    'nx format:write --uncommitted',
  ],
};
