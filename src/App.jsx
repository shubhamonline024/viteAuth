import { useEffect, useState } from "react";
import { supabase } from "./SupabaseClient";
import SocialAuth from "./SocialAuth";
import EmailOtpAuth from "./EmailOtpAuth";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <div>
        <h2>Social Login</h2>
        <SocialAuth />
        <hr />
        <h2>Email OTP Login</h2>
        <EmailOtpAuth />
        <hr />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user.email}</h1>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
