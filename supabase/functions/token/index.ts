import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("URL")!;
const supabaseKey = Deno.env.get("ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { refresh_token } = await req.json();
  if (!refresh_token) {
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token
  });

  if (error) {
    const response = {
      responseCode: "TOKEN0001",
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
    data: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    }
  }
  
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});