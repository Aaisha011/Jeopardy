export async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
  
    if (error) {
      return { error: error.message };
    }
  
    return { message: "Google login successful" };
  }
  