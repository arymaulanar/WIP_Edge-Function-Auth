import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("URL")!;
const supabaseKey = Deno.env.get("ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    const response = {
      responseCode: "SIGNUP0001",
      responseMessage: error.message,
      data: {}
    }
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const response = {
    responseCode: "00000",
    responseMessage: "",
    data: { user: data.user }
  }
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});