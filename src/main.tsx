import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import App from './App.tsx'
import { store } from './store'
import './index.css'

// Handle GitHub Pages SPA redirect format
// The spa-github-pages script converts paths to query strings like ?/path
// Format: /survey-tool/?/auth/login becomes /survey-tool/?/auth/login
// We need to extract the path from the query string and update the URL
const search = window.location.search;
if (search.startsWith('?/')) {
  // Extract the path from the query string (everything after ?/)
  const pathFromQuery = search.slice(2).split('&')[0].replace(/~and~/g, '&');
  
  // Get remaining query params (if any)
  const remainingParams = search.slice(2).split('&').slice(1)
    .map(param => param.replace(/~and~/g, '&'))
    .join('&');
  
  // Reconstruct the URL with the proper path
  const basePath = '/survey-tool';
  const newPath = basePath + '/' + pathFromQuery;
  const newSearch = remainingParams ? '?' + remainingParams : '';
  const newUrl = newPath + newSearch + window.location.hash;
  
  // Replace the current URL without reload
  window.history.replaceState({}, '', newUrl);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" />
    </Provider>
  </StrictMode>,
)

