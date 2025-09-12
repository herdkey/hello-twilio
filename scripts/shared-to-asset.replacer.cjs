const hasExt = (s) => /\.[a-zA-Z0-9]+$/.test(s);

exports.default = function sharedToAsset({ orig }) {
  // Skip if we've already transformed this line
  if (orig.includes('Runtime.getAssets()')) return orig;

  // Match: require("./...") or require("../..."), with optional "shared/"
  // Capture whatever comes after that
  const regex = /require\(\s*(['"])(?:\.\.?\/)+(?:shared\/)?([^'"]+)\1\s*\)/g;

  return orig.replace(regex, (_m, _q, inner) => {
    let name = inner;
    if (!hasExt(name)) name += '.js';
    const assetKey = `/${name}`;
    return `require(Runtime.getAssets()['${assetKey}'].path)`;
  });
};
