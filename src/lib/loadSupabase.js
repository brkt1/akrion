// Keep the SDK out of the first public render. The admin keeps its normal
// singleton and receives the same client when it calls the shared data APIs.
export const loadSupabase = async () => {
  const { supabase } = await import('./supabase')
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}
