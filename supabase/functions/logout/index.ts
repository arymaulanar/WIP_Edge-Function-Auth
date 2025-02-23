import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("URL")!;
const supabaseKey = Deno.env.get("ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { access_token  } = await req.json();
  if (!access_token ) {
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  supabase.auth.setAuth(access_token);
  const { error } = await supabase.auth.signOut();
  if (error) {
    const response = {
      responseCode: "LOGOUT0001",
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
    data: {}
  }
  
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});