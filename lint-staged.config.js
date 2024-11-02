module.exports = {
  '{libs,apps}/**/*.{js,ts,tsx}': [
    'nx affected --target test --uncommitted',
    'nx format:write --uncommitted',
  ],
};
