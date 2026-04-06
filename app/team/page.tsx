"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Users, Copy, Check, Loader2, Crown, Shield, User,
  Trash2, Plus, TrendingDown, Zap, ExternalLink
} from "lucide-react";
import DashboardNav from "@/components/DashboardNav";

import { API_BASE } from '@/lib/config';

const ROLE_ICON: Record<string, React.ReactNode> = {
  owner: <Crown size={11} className="text-yellow-400" />,
  admin: <Shield size={11} className="text-blue-400" />,
  member: <User size={11} className="text-zinc-500" />,
};

export default function TeamPage() {
  const { user, isLoaded } = useUser();

  const [team, setTeam]         = useState<any>(null);
  const [members, setMembers]   = useState<any[]>([]);
  const [myRole, setMyRole]     = useState<string>("member");
  const [inviteUrl, setInviteUrl] = useState<string>("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [err, setErr]           = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    loadTeam();
  }, [isLoaded, user]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/v1/teams/mine/${user!.id}`);
      const data = await res.json();
      if (data.team) {
        setTeam(data.team);
        setMembers(data.members || []);
        setMyRole(data.my_role || "member");
      }
    } catch (e) {
      setErr("Could not load team data.");
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    if (!teamName.trim() || !user) return;
    setCreating(true);
    setErr(null);
    try {
      const res  = await fetch(`${API_BASE}/v1/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          owner_id: user.id,
          owner_email: user.primaryEmailAddress?.emailAddress,
          owner_display_name: user.fullName || user.username || "Owner",
        }),
      });
      const data = await res.json();
      setTeam(data.team);
      setInviteUrl(data.invite_url);
      setMyRole("owner");
      await loadTeam();
    } catch {
      setErr("Failed to create team.");
    } finally {
      setCreating(false);
    }
  };

  const generateInvite = async () => {
    if (!team || !user) return;
    try {
      const res  = await fetch(
        `${API_BASE}/v1/teams/${team.id}/invite?requester_id=${user.id}`,
        { method: "POST" }
      );
      const data = await res.json();
      setInviteUrl(data.invite_url);
    } catch {
      setErr("Could not generate invite.");
    }
  };

  const copyInvite = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeMember = async (userId: string) => {
    if (!team || !user) return;
    setRemoving(userId);
    try {
      await fetch(
        `${API_BASE}/v1/teams/${team.id}/members/${userId}?requester_id=${user.id}`,
        { method: "DELETE" }
      );
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    } catch {
      setErr("Failed to remove member.");
    } finally {
      setRemoving(null);
    }
  };

  const totalSavings = members.reduce((s, m) => s + (m.total_savings || 0), 0);
  const totalRequests = members.reduce((s, m) => s + (m.requests_count || 0), 0);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pb-24 selection:bg-blue-500/30">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Header */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Workspace</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            {team ? team.name : "Your Team"}
          </h1>
          {team && (
            <p className="text-zinc-600 text-xs mt-1 uppercase tracking-widest font-bold">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {err && (
          <div className="px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
            {err}
          </div>
        )}

        {/* ── NO TEAM YET ── */}
        {!team && (
          <div className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 flex flex-col items-center gap-6 text-center">
            <div className="p-5 bg-blue-600/10 rounded-2xl border border-blue-500/20">
              <Users size={32} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                Create your team
              </h2>
              <p className="text-zinc-500 text-sm max-w-md">
                Invite teammates, share a credit pool, and track who's spending what — all in one place.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-sm">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createTeam()}
                placeholder="Team name…"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-blue-500 outline-none"
              />
              <button
                onClick={createTeam}
                disabled={creating || !teamName.trim()}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create
              </button>
            </div>
          </div>
        )}

        {/* ── HAS TEAM ── */}
        {team && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Members", value: members.length, icon: <Users size={16} className="text-blue-400" /> },
                { label: "Team Requests", value: totalRequests.toLocaleString(), icon: <Zap size={16} className="text-yellow-400" /> },
                { label: "Total Saved", value: `$${totalSavings.toFixed(4)}`, icon: <TrendingDown size={16} className="text-emerald-400" /> },
              ].map((s) => (
                <div key={s.label} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{s.label}</p>
                  </div>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Invite link */}
            {(myRole === "owner" || myRole === "admin") && (
              <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Invite Link</p>
                {inviteUrl ? (
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={inviteUrl}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-400 outline-none truncate"
                    />
                    <button
                      onClick={copyInvite}
                      className="px-4 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-700 transition-all flex items-center gap-2 shrink-0"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={generateInvite}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
                  >
                    <Plus size={13} /> Generate Invite Link
                  </button>
                )}
                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-wider">
                  Link expires in 7 days · Single use
                </p>
              </div>
            )}

            {/* Members table */}
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Members &amp; Usage
                </p>
              </div>

              <div className="divide-y divide-white/5">
                {members.map((m) => (
                  <div key={m.user_id} className="px-6 py-4 flex items-center gap-4">
                    {/* Role icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 shrink-0">
                      {ROLE_ICON[m.role] || ROLE_ICON.member}
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {m.display_name || m.email || m.user_id}
                      </p>
                      {m.email && m.display_name && (
                        <p className="text-[10px] text-zinc-600 truncate">{m.email}</p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 text-right shrink-0">
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Plan</p>
                        <p className="text-xs font-bold text-zinc-400">{m.plan}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Requests</p>
                        <p className="text-xs font-bold text-white">{(m.requests_count || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Saved</p>
                        <p className="text-xs font-bold text-emerald-400">${(m.total_savings || 0).toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Credits</p>
                        <p className="text-xs font-bold text-zinc-300">{(m.credits || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Remove (owner only, not self) */}
                    {myRole === "owner" && m.user_id !== user?.id && (
                      <button
                        onClick={() => removeMember(m.user_id)}
                        disabled={removing === m.user_id}
                        className="p-2 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                      >
                        {removing === m.user_id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Trash2 size={13} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Generate new invite if one is already shown */}
            {inviteUrl && (myRole === "owner" || myRole === "admin") && (
              <div className="text-center">
                <button
                  onClick={generateInvite}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus size={11} /> Generate New Link
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
