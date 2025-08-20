"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";

export default function ProfilePanel() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { profile, loading: profileLoading, create, update } = useProfile(user);

  // auth form state
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [authProcessing, setAuthProcessing] = useState(false);
  const postSignupNotice = useRef(false);

  // profile edit state
  const [fullNameInput, setFullNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [saveProcessing, setSaveProcessing] = useState(false);

  // create-missing-profile state
  const [createUname, setCreateUname] = useState("");
  const [createFull, setCreateFull] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullNameInput(profile.full_name ?? "");
      setUsernameInput(profile.username ?? "");
    }
  }, [profile]);

  const canSubmitAuth = useMemo(() => {
    if (authProcessing) return false;
    if (!email.trim() || !password) return false;
    return true;
  }, [authProcessing, email, password]);

  const handleAuth = useCallback(async () => {
    if (!canSubmitAuth) return;
    setErr(null);
    setAuthProcessing(true);
    try {
      if (mode === "signin") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
        postSignupNotice.current = true;
      }
    } catch (e: any) {
      setErr(e?.message || "Authentication failed");
    } finally {
      setAuthProcessing(false);
    }
  }, [canSubmitAuth, email, mode, password, signIn, signUp, username]);

  const canSaveProfile = useMemo(() => {
    if (saveProcessing || !profile) return false;
    const changedFull = (fullNameInput ?? "") !== (profile.full_name ?? "");
    const changedUser = (usernameInput ?? "") !== (profile.username ?? "");
    return changedFull || changedUser;
  }, [profile, saveProcessing, fullNameInput, usernameInput]);

  const saveProfile = useCallback(async () => {
    if (!canSaveProfile || !profile) return;
    setSaveProcessing(true);
    try {
      await update({
        full_name: fullNameInput.trim(),
        username: usernameInput.trim() || null,
      });
    } catch (e: any) {
      console.error("Profile save failed:", e?.message || e);
    } finally {
      setSaveProcessing(false);
    }
  }, [canSaveProfile, fullNameInput, profile, update, usernameInput]);

  // ===== RENDER =====
  if (authLoading) {
    return <div className="mb-6 rounded-2xl border p-4 bg-white shadow-sm text-gray-500">Checking session…</div>;
  }

  if (!user) {
    return (
      <div className="mb-6 rounded-2xl border p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-lg ${mode === "signin" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              onClick={() => { setMode("signin"); setErr(null); }}
            >
              Sign in
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${mode === "signup" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              onClick={() => { setMode("signup"); setErr(null); }}
            >
              Sign up
            </button>
          </div>
        </div>

        {postSignupNotice.current && (
          <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Check your email to confirm your account, then sign in.
          </div>
        )}

        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}

        <div className="flex flex-col lg:flex-row gap-3">
          {mode === "signup" && (
            <input
              className="border rounded-lg px-3 py-2 w-full lg:w-56"
              placeholder="Username (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            className="border rounded-lg px-3 py-2 flex-1"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          />
          <input
            className="border rounded-lg px-3 py-2 flex-1"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          />
          <button
            className={`px-4 py-2 rounded-lg text-white ${canSubmitAuth ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!canSubmitAuth}
            onClick={handleAuth}
          >
            {authProcessing ? (mode === "signin" ? "Signing in…" : "Creating…") : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>

        {mode === "signup" && (
          <p className="text-xs text-gray-500 mt-2">
            Your profile in <code>Soln0002 - Users</code> will be created automatically (trigger) or you can create it after you sign in.
          </p>
        )}
      </div>
    );
  }

  // Logged in
  return (
    <div className="mb-6 rounded-2xl border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {profile?.full_name ? `Welcome, ${profile.full_name}` : "Welcome"}
        </h2>
        <button onClick={signOut} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300">
          Sign out
        </button>
      </div>

      {profileLoading ? (
        <div className="text-gray-500 mt-3">Loading profile…</div>
      ) : profile ? (
        <>
          {/* Snapshot */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium break-all">{profile.email}</div>
            </div>
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="text-sm text-gray-500">Username</div>
              <div className="font-medium">{profile.username || "—"}</div>
            </div>
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="text-sm text-gray-500">Account Balance</div>
              <div className="font-medium">${Number(profile.account_balance ?? 0).toFixed(2)}</div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="mt-5">
            <h3 className="text-lg font-semibold mb-2">Edit profile</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                className="border rounded-lg px-3 py-2 w-full md:w-64"
                placeholder="Full name"
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
              />
              <input
                className="border rounded-lg px-3 py-2 w-full md:w-64"
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <button
                disabled={!canSaveProfile}
                onClick={saveProfile}
                className={`px-4 py-2 rounded-lg text-white ${
                  canSaveProfile ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {saveProcessing ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </>
      ) : (
        // ✅ Signed in but missing profile: let them create it now
        <div className="mt-4">
          <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            No profile found for your account. Create one now.
          </div>
          {createErr && <div className="text-red-600 text-sm mb-2">{createErr}</div>}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="border rounded-lg px-3 py-2 w-full md:w-64"
              placeholder="Full name (optional)"
              value={createFull}
              onChange={(e) => setCreateFull(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 w-full md:w-64"
              placeholder="Username (optional)"
              value={createUname}
              onChange={(e) => setCreateUname(e.target.value)}
            />
            <button
              disabled={creatingProfile}
              onClick={async () => {
                setCreateErr(null);
                setCreatingProfile(true);
                try {
                  await create({
                    full_name: createFull.trim() || null,
                    username: createUname.trim() || null,
                    account_balance: 0,
                  });
                  setCreateFull("");
                  setCreateUname("");
                } catch (e: any) {
                  setCreateErr(e?.message || "Failed to create profile");
                } finally {
                  setCreatingProfile(false);
                }
              }}
              className={`px-4 py-2 rounded-lg text-white ${
                creatingProfile ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {creatingProfile ? "Creating…" : "Create profile"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            A profile row will be inserted into <code>Soln0002 - Users</code> linked to your authenticated account.
          </p>
        </div>
      )}
    </div>
  );
}
