window.SECGUARD_SUPABASE = {
  url: window.SECGUARD_SUPABASE_URL || 'https://wognlmuaslsrmfmrlzjv.supabase.co',
  anonKey: window.SECGUARD_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZ25sbXVhc2xzcm1mbXJsemp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MTYxMzAsImV4cCI6MjA5NTA5MjEzMH0.AlL078_AFGqg3j3YWbE15NbidzTOTmIi-sFXAS4VVzE',
  enabled: window.SECGUARD_USE_SUPABASE === true,
  mode: window.SECGUARD_USE_SUPABASE === true ? 'supabase-with-local-fallback' : 'local-storage-first',
};
