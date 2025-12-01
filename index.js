const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const os = require('os');

const app = express();
const upload = multer({ dest: path.join(os.tmpdir(), 'enc-web-uploads') });

app.use(express.static(path.join(__dirname, 'public')));

// Shell stub
const STUB = `#!/bin/sh
skip=23
set -C
umask=
umask 77
tmpfile=\`tempfile -p gztmp -d /tmp\` || exit 1
if tail +$skip "$0" | /bin/bzip2 -cd >> $tmpfile; then
  umask $umask
  /bin/chmod 700 $tmpfile
  prog="\\\`echo $0 | /bin/sed 's|^.*/||'\\\`"
  if /bin/ln -T $tmpfile "/tmp/$prog" 2>/dev/null; then
    trap '/bin/rm -f $tmpfile "/tmp/$prog"; exit $res' 0
    (/bin/sleep 5; /bin/rm -f $tmpfile "/tmp/$prog") 2>/dev/null &
    /tmp/"$prog" ${1+"$@"}; res=$?
  else
    trap '/bin/rm -f $tmpfile; exit $res' 0
    (/bin/sleep 5; /bin/rm -f $tmpfile) 2>/dev/null &
    $tmpfile ${1+"$@"}; res=$?
  fi
else
  echo Cannot decompress $0; exit 1
fi; exit $res
`;

// --------------------- ENCRYPT ---------------------
app.post('/encrypt', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('no file');

  const infile = req.file.path;
  const outName = req.file.originalname + '.enc.sh';
  const outPath = path.join(path.dirname(infile), outName);

  const outStream = fs.createWriteStream(outPath, { mode: 0o700 });

  outStream.write(STUB, 'utf8', () => {
    const bz = spawn('bzip2', ['-cv9', infile]);
    bz.stdout.pipe(outStream, { end: true });

    let stderr = '';
    bz.stderr.on('data', d => stderr += d.toString());

    bz.on('close', code => {
      if (code !== 0) return errExit(new Error(stderr));
      res.download(outPath, outName, () => cleanup());
    });
  });

  function cleanup() {
    try { fs.unlinkSync(infile); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
  }

  function errExit(e) {
    console.error(e);
    cleanup();
    res.status(500).send('Encrypt error: ' + e.message);
  }
});

// --------------------- DECRYPT ---------------------
app.post('/decrypt', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('no file');

  const infile = req.file.path;
  const outPath = infile + '.dec';
  const originalName = req.file.originalname.replace(/\.enc\.sh$/i, '') || 'decrypted.out';

  fs.readFile(infile, 'utf8', (err, data) => {
    if (err) return errExit(err);

    const lines = data.split(/\r?\n/);
    const m = (lines[1] || '').match(/^skip=(\d+)$/);
    const skip = m ? m[1] : '23';

    const cmd = `tail +${skip} ${infile} | bzip2 -cd`;

    exec(cmd, { maxBuffer: 1024 * 1024 * 200 }, (error, stdout) => {
      if (error) return errExit(error);

      fs.writeFile(outPath, stdout, () => {
        res.download(outPath, originalName, () => cleanup());
      });
    });
  });

  function cleanup() {
    try { fs.unlinkSync(infile); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
  }

  function errExit(e) {
    console.error(e);
    cleanup();
    res.status(500).send('Decrypt error: ' + e.message);
  }
});

app.listen(3000, () => console.log('Running → http://localhost:3000'));
