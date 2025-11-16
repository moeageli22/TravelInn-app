import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zeeimyqduvannrxhevws.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZWlteXFkdXZhbm5yeGhldndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTI1ODQsImV4cCI6MjA3ODA4ODU4NH0.xRnMy2jaEpOKTJCCIf1BuZERatHor0ToheWZM0zP-Ho";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

