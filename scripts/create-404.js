import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const indexPath = join(distDir, 'index.html');
const outputPath = join(distDir, '404.html');

// Read the built index.html
const indexContent = readFileSync(indexPath, 'utf-8');

// SPA redirect script for GitHub Pages
// This script handles client-side routing for GitHub Pages
// It redirects 404s to the React app which handles routing
const redirectScript = `
    <script>
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      // For project pages with base path, segmentCount should be 1
      var segmentCount = 1;
      
      var l = window.location;
      var pathSegments = l.pathname.split('/').filter(Boolean);
      
      // Only redirect if not already redirected (no ?/ in query string)
      if (!l.search.includes('?/')) {
        var basePath = pathSegments[0] || 'survey-tool';
        var routePath = pathSegments.slice(segmentCount).join('/');
        
        var newPath = '/' + basePath + '/?/' + 
          routePath.replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash;
        
        l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + newPath);
      }
    </script>`;

// Inject the redirect script right after the opening <head> tag
const modifiedContent = indexContent.replace(
  /(<head[^>]*>)/i,
  `$1${redirectScript}`
);

// Write the 404.html file
writeFileSync(outputPath, modifiedContent, 'utf-8');
console.log('✓ Created dist/404.html with SPA redirect script');

