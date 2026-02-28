const fetch = require('node-fetch');

const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=treatments&limit=20`;
const headers = {
  'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
};

fetch(url, { headers })
  .then(r => r.json())
  .then(data => {
    const treatments = new Set();
    data.forEach(p => {
      if (p.treatments) {
        const arr = Array.isArray(p.treatments) ? p.treatments : [p.treatments];
        arr.forEach(t => {
          if (t) treatments.add(t);
        });
      }
    });
    console.log("Treatments found in database:");
    Array.from(treatments).sort().forEach(t => console.log(`  - ${t}`));
  })
  .catch(e => console.error('Error:', e));
