import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Antes de configurar VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY en .env,
// `supabase` queda en null para que el sitio siga funcionando (el formulario
// de contacto sigue enviando por WhatsApp aunque no haya guardado en la BD).
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
