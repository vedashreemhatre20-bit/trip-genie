// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables completion, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is super_admin
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "super_admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "list": {
        // List all users with their profiles
        const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("*");

        const enrichedUsers = users.users.map((u) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          user_metadata: u.user_metadata,
          profile: profiles?.find((p) => p.id === u.id) || null,
        }));

        return new Response(JSON.stringify({ users: enrichedUsers }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "stats": {
        // Get user statistics
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const { data: trips } = await supabaseAdmin.from("trips").select("id, created_at");

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const today = now.toDateString();

        const stats = {
          totalUsers: users?.users?.length || 0,
          activeToday: users?.users?.filter(
            (u) => u.last_sign_in_at && new Date(u.last_sign_in_at).toDateString() === today
          ).length || 0,
          newThisWeek: users?.users?.filter(
            (u) => new Date(u.created_at) > weekAgo
          ).length || 0,
          totalTrips: trips?.length || 0,
          tripsThisWeek: trips?.filter(
            (t) => new Date(t.created_at) > weekAgo
          ).length || 0,
        };

        return new Response(JSON.stringify(stats), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update-role": {
        // Update user role
        const body = await req.json();
        const { userId, role } = body;

        if (!userId || !role || !["user", "super_admin"].includes(role)) {
          return new Response(
            JSON.stringify({ error: "Invalid userId or role" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ role })
          .eq("id", userId);

        if (updateError) throw updateError;

        // Also update user metadata
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { role },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action. Use: list, stats, update-role" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});