const SUPABASE_URL = "https://rcifcttqhkupbofbaxyq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjaWZjdHRxaGt1cGJvZmJheHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzcwNDEsImV4cCI6MjA5NzIxMzA0MX0.gFRBS18QbEwj7TJslJh0uhqHlFePIJrLV-H01eWGRnI";

let supabaseClient = null;

try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase başlatıldı.');
  }
} catch (e) {
  console.warn('⚠️ Supabase başlatılamadı, localStorage fallback kullanılacak:', e.message);
  supabaseClient = null;
}
