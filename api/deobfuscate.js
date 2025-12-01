// api/deobfuscate.js
// POST JSON { "content": "<obfuscated-script-text>" }
// Returns original file as attachment (if payload found), or error.

const zlib = require('zlib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed — use POST with JSON { content }');
    return;
  }
  const body = req.body || {};
  const content = body.content;
  if (!content) {
    res.status(400).send('Missing "content" in JSON body');
    return;
  }

  try {
    // Extract long base64 payload between _payload='...'
    // This uses a tolerant regex (single-quoted string)
    const m = content.match(/_payload='([A-Za-z0-9+/=\\s]+)'/);
    if (!m) {
      res.status(400).send('No payload found in uploaded script.');
      return;
    }
    const b64 = m[1].replace(/\s+/g, '');
    const gzBuf = Buffer.from(b64, 'base64');
    const out = zlib.gunzipSync(gzBuf);
    const originalText = out.toString('utf8');

    const outName = (body.filename || 'deobfuscated.sh').replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'text/x-sh');
    res.setHeader('Content-Disposition', `attachment; filename="${outName}"`);
    res.send(originalText);
  } catch (err) {
    console.error(err);
    res.status(500).send('Deobfuscation failed: ' + err.message);
  }
};
