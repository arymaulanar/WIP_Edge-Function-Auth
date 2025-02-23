import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("URL")!;
const supabaseKey = Deno.env.get("ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { type, email, redirectTo } = await req.json();

  if (!type || !email) {
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
  /* resend signup otp
  * type: 'signup',
  * email: 'email@example.com',
  * options: {
  *   emailRedirectTo: 'https://example.com/welcome'
  * }
  */
  /* email change otp
  * type: 'email_change',
  * email: 'email@example.com'
  */

  const { error } = await supabase.auth.resend({
    type: type,
    email: email,
    options: {
      emailRedirectTo: redirectTo
    }
  })

  if (error) {
    const response = {
      responseCode: "OTP0001",
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