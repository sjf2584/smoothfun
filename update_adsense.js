const fs = require('fs');
const files = [
  'index.html', 
  'perfect-shape.html', 
  'color-match.html', 
  'pitch.html', 
  'stopwatch.html', 
  'memory.html', 
  'fakeout.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  // 1. Add Meta Tag if not exists
  if (!content.includes('google-adsense-account')) {
    content = content.replace('</head>', '  <meta name="google-adsense-account" content="ca-pub-1363977997493751">\n</head>');
  }

  // 2. Replace commented script with active script
  // Example of what is currently there:
  // <!-- Google AdSense: pub-1363977997493751 로 교체 후 주석 해제 -->
  // <!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-1363977997493751" crossorigin="anonymous"></script> -->
  content = content.replace(/<!-- Google AdSense[\s\S]*?<\/script> -->/g, `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1363977997493751" crossorigin="anonymous"></script>`);
  
  // 2-1. Also replace if they are in single line format from previous edits
  content = content.replace(/<!--\s*<script async src=".*adsbygoogle.js.*<\/script>\s*-->/g, `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1363977997493751" crossorigin="anonymous"></script>`);

  // 3. Update data-ad-client in ins tags
  content = content.replace(/data-ad-client="pub-1363977997493751"/g, 'data-ad-client="ca-pub-1363977997493751"');
  
  fs.writeFileSync(f, content, 'utf8');
  console.log(`Updated ${f}`);
});
