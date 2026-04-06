"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2, CheckCircle2, Users, ArrowRight } from "lucide-react";

import { API_BASE } from '@/lib/config';

export default function JoinTeamPage() {
  const { token }     = useParams<{ token: string }>();
  const { user, isLoaded } = useUser();
  const router        = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "waiting">("waiting");
  const [teamName, setTeamName] = useState("");
  const [errMsg, setErrMsg]     = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      // Store token in sessionStorage and redirect to sign-in
      sessionStorage.setItem("pending_team_invite", token);
      router.push(`/sign-in?redirect_url=/team/join/${token}`);
      return;
    }
    joinTeam();
  }, [isLoaded, user]);

  const joinTeam = async () => {
    if (!user) return;
    setStatus("loading");
    try {
      const res  = await fetch(`${API_BASE}/v1/teams/join/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:      user.id,
          email:        user.primaryEmailAddress?.emailAddress,
          display_name: user.fullName || user.username || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to join team");
      }

      const data = await res.json();
      setTeamName(data.team?.name || "the team");
      setStatus("success");

      setTimeout(() => router.push("/team"), 2500);
    } catch (e: any) {
      setErrMsg(e.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">

        {(status === "waiting" || status === "loading") && (
          <>
            <div className="flex justify-center">
              <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                <Loader2 size={32} className="animate-spin text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Joining team…
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center">
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              You joined <span className="text-blue-400">{teamName}</span>
            </h1>
            <p className="text-zinc-500 text-sm">Redirecting to your team dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center">
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <Users size={32} className="text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-red-400">
              Invite invalid
            </h1>
            <p className="text-zinc-500 text-sm">{errMsg}</p>
            <a
              href="/team"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
            >
              Go to Team <ArrowRight size={14} />
            </a>
          </>
        )}

      </div>
    </div>
  );
}
