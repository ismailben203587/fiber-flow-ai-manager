import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const demoUsers = [
      { email: 'admin@ftth.ma', password: 'password123', name: 'Neural Admin', role: 'admin' },
      { email: 'commercial@ftth.ma', password: 'password123', name: 'Commerce AI', role: 'commercial' },
      { email: 'tech@ftth.ma', password: 'password123', name: 'Tech Matrix', role: 'tech' },
      { email: 'supervisor@ftth.ma', password: 'password123', name: 'Cyber Supervisor', role: 'technicien' }
    ]

    const results = []

    for (const user of demoUsers) {
      // Try to create the user directly - if it already exists, we'll get an error
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.name
        }
      })

      if (createError) {
        if (createError.message.includes('already registered')) {
          results.push({ email: user.email, status: 'already_exists' })
          continue
        } else {
          results.push({ email: user.email, status: 'error', error: createError.message })
          continue
        }
      }

      if (!newUser.user) {
        results.push({ email: user.email, status: 'error', error: 'User creation failed' })
        continue
      }

      // Update the profile with the correct name
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: newUser.user.id,
          email: user.email,
          full_name: user.name
        })

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      // Assign the role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({
          user_id: newUser.user.id,
          role: user.role
        })

      if (roleError) {
        console.error('Role assignment error:', roleError)
      }

      results.push({ 
        email: user.email, 
        status: 'created', 
        id: newUser.user.id,
        role: user.role
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo users processing completed',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating demo users:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})