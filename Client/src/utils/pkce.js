// utils/pkce.js
export function generatePKCECodes() {
    const array = new Uint32Array(56);
    window.crypto.getRandomValues(array);
    const code_verifier = Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('').slice(0, 128);
  
    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
  
    return window.crypto.subtle.digest('SHA-256', data).then(digest => {
      const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  
      return {
        code_verifier,
        code_challenge: base64Digest
      };
    });
  }
  