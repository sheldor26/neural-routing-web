"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useUser, useAuth, Protect } from "@clerk/nextjs";
import {
  Save, Eye, EyeOff, Code, Bold, List, Hash, Clock, Loader2,
  Image as ImageIcon, Plus, Pencil, Trash2, Globe, FileText,
  CheckCircle2, XCircle, ToggleLeft, ToggleRight, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createAuthClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Post {
  id:          string;
  slug:        string;
  title:       string;
  excerpt:     string | null;
  content:     string;
  cover_image: string | null;
  tag:         string;
  read_time:   string;
  published:    boolean;
  published_at: string;
  created_at:   string;
  updated_at:   string;
}

type Toast = { type: "success" | "error"; msg: string } | null;

const ADMIN_EMAIL = "juanmirande10@gmail.com";
const TAGS = ["Engineering", "Architecture", "Neural Research"];

// ---------------------------------------------------------------------------
// Toast component
// ---------------------------------------------------------------------------
function ToastBanner({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-sm font-bold transition-all ${
      toast.type === "success"
        ? "bg-emerald-950 border-emerald-700 text-emerald-300"
        : "bg-red-950 border-red-700 text-red-300"
    }`}>
      {toast.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      {toast.msg}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blank post
// ---------------------------------------------------------------------------
function blankPost(): Omit<Post, "id" | "slug" | "created_at" | "updated_at"> {
  return { title: "", excerpt: "", content: "", cover_image: null, tag: "Engineering", read_time: "5 min", published: false, published_at: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminBlog() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // ── Local password gate ────────────────────────────────────────────────────
  const [gateAuthed,  setGateAuthed]  = useState(false);
  const [gateUser,    setGateUser]    = useState("");
  const [gatePass,    setGatePass]    = useState("");
  const [gateError,   setGateError]   = useState("");
  const [gateLoading, setGateLoading] = useState(false);

  // Persist within the browser session (cleared on tab close)
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("blog_admin_authed") === "1") {
      setGateAuthed(true);
    }
  }, []);

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError("");
    setGateLoading(true);
    try {
      const res = await fetch("/api/blog-admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: gateUser, pass: gatePass }),
      });
      if (res.ok) {
        sessionStorage.setItem("blog_admin_authed", "1");
        setGateAuthed(true);
      } else {
        setGateError("Invalid username or password.");
      }
    } catch {
      setGateError("Connection error. Try again.");
    } finally {
      setGateLoading(false);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const [posts,        setPosts]        = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing,      setEditing]      = useState<Partial<Post> | null>(null); // null = list view
  const [form,         setForm]         = useState(blankPost());
  const [isUploading,  setIsUploading]  = useState(false);
  const [isSaving,     setIsSaving]     = useState(false);
  const [preview,      setPreview]      = useState(false);
  const [toast,        setToast]        = useState<Toast>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", msg: string) => setToast({ type, msg });

  // ---------------------------------------------------------------------------
  // Supabase client (authenticated)
  // ---------------------------------------------------------------------------
  const getSB = useCallback(async () => {
    const token = await getToken({ template: "supabase" });
    return createAuthClient(token!);
  }, [getToken]);

  // ---------------------------------------------------------------------------
  // Load posts
  // ---------------------------------------------------------------------------
  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const sb = await getSB();
      const { data, error } = await sb
        .from("posts")
        .select("id, slug, title, tag, read_time, published, published_at, created_at, updated_at")
        .order("published_at", { ascending: false });
      if (error) throw error;
      setPosts((data ?? []) as Post[]);
    } catch (e: any) {
      showToast("error", e.message ?? "Failed to load posts");
    } finally {
      setLoadingPosts(false);
    }
  }, [getSB]);

  useEffect(() => {
    if (isLoaded && user) loadPosts();
  }, [isLoaded, user?.id]);

  // ---------------------------------------------------------------------------
  // Open editor for new / existing post
  // ---------------------------------------------------------------------------
  const openNew = () => {
    setEditing({});
    setForm(blankPost());
    setPreview(false);
  };

  const openEdit = async (post: Post) => {
    setEditing(post);
    // Load full content
    const sb = await getSB();
    const { data } = await sb.from("posts").select("*").eq("id", post.id).single();
    if (data) setForm({
      title:        data.title,
      excerpt:      data.excerpt ?? "",
      content:      data.content,
      cover_image:  data.cover_image,
      tag:          data.tag,
      read_time:    data.read_time,
      published:    data.published,
      published_at: data.published_at ?? data.created_at,
    });
    setPreview(false);
  };

  // ---------------------------------------------------------------------------
  // Markdown toolbar
  // ---------------------------------------------------------------------------
  const insertMd = (prefix: string, suffix = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const newVal = value.slice(0, s) + prefix + value.slice(s, e) + suffix + value.slice(e);
    setForm(f => ({ ...f, content: newVal }));
    setTimeout(() => {
      ta.focus();
      const pos = s + prefix.length + (e - s) + suffix.length;
      ta.setSelectionRange(pos, pos);
    }, 10);
  };

  // ---------------------------------------------------------------------------
  // Image upload (inline or cover)
  // ---------------------------------------------------------------------------
  const uploadImage = async (file: File, type: "inline" | "cover") => {
    setIsUploading(true);
    try {
      const sb = await getSB();
      const ext = file.name.split(".").pop();
      const path = `uploads/${crypto.randomUUID()}.${ext}`;
      const { error } = await sb.storage.from("blog-images").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = sb.storage.from("blog-images").getPublicUrl(path);
      if (type === "cover") {
        setForm(f => ({ ...f, cover_image: publicUrl }));
        showToast("success", "Cover image uploaded");
      } else {
        insertMd(`\n![image](${publicUrl})\n`);
        showToast("success", "Image inserted");
      }
    } catch (e: any) {
      showToast("error", "Upload failed: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Save post (create or update)
  // ---------------------------------------------------------------------------
  const save = async () => {
    if (!form.title?.trim()) return showToast("error", "Title is required");
    if (!form.content?.trim()) return showToast("error", "Content is required");
    setIsSaving(true);
    try {
      const sb = await getSB();
      const slug = form.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const payload = {
        title:       form.title.trim(),
        excerpt:     form.excerpt?.trim() || null,
        content:     form.content,
        cover_image: form.cover_image || null,
        tag:         form.tag,
        read_time:   form.read_time,
        published:   form.published,
        updated_at:  new Date().toISOString(),
      };

      if (editing?.id) {
        // Update
        const { error } = await sb.from("posts").update(payload).eq("id", editing.id);
        if (error) throw error;
        showToast("success", "Post updated");
      } else {
        // Insert
        const { error } = await sb.from("posts").insert({ ...payload, slug, created_at: new Date().toISOString() });
        if (error) throw error;
        showToast("success", form.published ? "Post published!" : "Draft saved");
      }
      await loadPosts();
      setEditing(null);
    } catch (e: any) {
      showToast("error", e.message ?? "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Toggle publish
  // ---------------------------------------------------------------------------
  const togglePublish = async (post: Post) => {
    try {
      const sb = await getSB();
      const { error } = await sb.from("posts").update({ published: !post.published }).eq("id", post.id);
      if (error) throw error;
      showToast("success", !post.published ? "Post published" : "Post unpublished");
      await loadPosts();
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete post
  // ---------------------------------------------------------------------------
  const deletePost = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      const sb = await getSB();
      const { error } = await sb.from("posts").delete().eq("id", post.id);
      if (error) throw error;
      showToast("success", "Post deleted");
      await loadPosts();
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!gateAuthed) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <form
        onSubmit={handleGateSubmit}
        className="w-full max-w-sm space-y-5 bg-zinc-900/60 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl"
      >
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Blog CMS</p>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Admin Access</h1>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={gateUser}
              onChange={e => setGateUser(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="username"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={gatePass}
              onChange={e => setGatePass(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        {gateError && (
          <p className="text-[11px] text-red-400 font-bold text-center">{gateError}</p>
        )}

        <button
          type="submit"
          disabled={gateLoading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {gateLoading ? <Loader2 size={14} className="animate-spin" /> : null}
          {gateLoading ? "Verifying…" : "Enter"}
        </button>
      </form>
    </div>
  );
  // ──────────────────────────────────────────────────────────────────────────

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Protect
      condition={() => user?.primaryEmailAddress?.emailAddress.toLowerCase() === ADMIN_EMAIL}
      fallback={
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-600 space-y-3">
          <XCircle size={32} />
          <p className="text-sm font-black uppercase tracking-widest">Access denied</p>
        </div>
      }
    >
      <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">

        {/* Nav */}
        <nav className="border-b border-zinc-800/50 bg-black/30 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/blog" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={14} />
            </Link>
            <span className="text-sm font-black italic uppercase tracking-widest text-white">
              Neural <span className="text-blue-600">Editor</span>
            </span>
            {editing !== null && (
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-800 px-2 py-1 rounded-lg">
                {editing?.id ? "Editing" : "New Post"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {editing !== null && (
              <>
                <button
                  onClick={() => setPreview(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                >
                  {preview ? <EyeOff size={12} /> : <Eye size={12} />}
                  {preview ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {isSaving ? "Saving..." : editing?.id ? "Update" : form.published ? "Publish" : "Save Draft"}
                </button>
              </>
            )}
            {editing === null && (
              <button
                onClick={openNew}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
              >
                <Plus size={12} /> New Post
              </button>
            )}
          </div>
        </nav>

        {/* ── LIST VIEW ── */}
        {editing === null && (
          <main className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic">Content</p>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mt-1">All Posts</h1>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-600">{posts.length} total</span>
            </div>

            {loadingPosts ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-blue-600" size={28} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-zinc-800 rounded-[2.5rem]">
                <FileText size={40} className="text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">No posts yet</p>
                <button onClick={openNew} className="mt-4 text-blue-500 text-xs font-black hover:underline">
                  Write your first post →
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-3 px-6 py-3 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  <span className="col-span-5">Title</span>
                  <span className="col-span-2">Tag</span>
                  <span className="col-span-2">Date</span>
                  <span className="col-span-1">Status</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>

                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="grid grid-cols-12 gap-3 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] items-center transition-colors"
                  >
                    <div className="col-span-5">
                      <p className="text-sm font-bold text-white truncate">{post.title}</p>
                      <p className="text-[9px] text-zinc-600 font-mono mt-0.5">/blog/{post.slug}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-lg">
                        {post.tag}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-zinc-600 font-bold">
                        {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="col-span-1">
                      {post.published ? (
                        <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400">
                          <Globe size={10} /> Live
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-black text-zinc-600">
                          <FileText size={10} /> Draft
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublish(post)}
                        title={post.published ? "Unpublish" : "Publish"}
                        className={`p-1.5 rounded-lg transition-colors ${post.published ? "text-emerald-500 hover:bg-emerald-500/10" : "text-zinc-600 hover:text-emerald-400 hover:bg-zinc-800"}`}
                      >
                        {post.published ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                      <button
                        onClick={() => openEdit(post as Post)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deletePost(post as Post)}
                        className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* ── EDITOR VIEW ── */}
        {editing !== null && !preview && (
          <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left: fields + content */}
            <div className="lg:col-span-7 space-y-6">

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Category</label>
                  <select
                    value={form.tag}
                    onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {TAGS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Read Time</label>
                  <input
                    value={form.read_time}
                    onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="5 min"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Status</label>
                  <button
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                      form.published
                        ? "border-emerald-700 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-950 text-zinc-600 hover:text-white"
                    }`}
                  >
                    {form.published ? <Globe size={11} /> : <FileText size={11} />}
                    {form.published ? "Published" : "Draft"}
                  </button>
                </div>
              </div>

              {/* Cover image */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Cover Image</label>
                {form.cover_image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-800 group">
                    <img src={form.cover_image} alt="cover" className="w-full h-40 object-cover" />
                    <button
                      onClick={() => setForm(f => ({ ...f, cover_image: null }))}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-lg text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-28 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-blue-400 hover:border-blue-600/40 transition-all"
                  >
                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload cover</span>
                  </button>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, "cover"); }} />
              </div>

              {/* Title */}
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Post title..."
                className="w-full bg-transparent text-4xl md:text-5xl font-black italic tracking-tighter outline-none placeholder:text-zinc-800 border-b border-zinc-800/50 pb-4"
              />

              {/* Excerpt */}
              <textarea
                value={form.excerpt ?? ""}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short excerpt for the blog listing (optional)..."
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-400 outline-none focus:border-blue-500 transition-all resize-none placeholder:text-zinc-700"
              />

              {/* Markdown toolbar */}
              <div className="flex items-center gap-1 border-y border-zinc-800/40 py-2">
                {[
                  { icon: Hash,  action: () => insertMd("### "),     title: "Heading" },
                  { icon: Bold,  action: () => insertMd("**", "**"), title: "Bold" },
                  { icon: Code,  action: () => insertMd("`", "`"),   title: "Inline code" },
                  { icon: List,  action: () => insertMd("- "),       title: "List" },
                ].map(({ icon: Icon, action, title }) => (
                  <button key={title} onClick={action} title={title} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-600 hover:text-white transition-colors">
                    <Icon size={14} />
                  </button>
                ))}
                <div className="w-px h-4 bg-zinc-800 mx-1" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-900 rounded-lg text-zinc-600 hover:text-blue-400 transition-all text-[9px] font-black uppercase tracking-widest"
                >
                  {isUploading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                  Insert image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, "inline"); }} />
              </div>

              {/* Content */}
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith("image/")) uploadImage(f, "inline"); }}
                onDragOver={e => e.preventDefault()}
                placeholder="Write your post in Markdown... (you can drag & drop images here)"
                className="w-full h-[500px] bg-transparent text-zinc-400 text-sm leading-relaxed outline-none resize-none font-mono"
              />
            </div>

            {/* Right: preview */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="sticky top-20 space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 italic flex items-center gap-2">
                  <Eye size={12} /> Live Preview
                </p>
                <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2.5rem] p-8 min-h-[400px] overflow-y-auto max-h-[70vh]">
                  {form.cover_image && (
                    <img src={form.cover_image} alt="cover" className="w-full h-32 object-cover rounded-2xl mb-6" />
                  )}
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4 leading-tight">
                    {form.title || "Title..."}
                  </h2>
                  {form.excerpt && (
                    <p className="text-zinc-500 text-sm italic border-l-2 border-blue-600/30 pl-3 mb-6">{form.excerpt}</p>
                  )}
                  <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-400 prose-headings:text-white prose-headings:font-black prose-code:text-blue-400 prose-img:rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {form.content || "*Start writing to see preview...*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ── PREVIEW MODE (full width) ── */}
        {editing !== null && preview && (
          <main className="max-w-3xl mx-auto px-6 py-16">
            {form.cover_image && (
              <img src={form.cover_image} alt="cover" className="w-full h-64 object-cover rounded-[2rem] mb-10 border border-zinc-800" />
            )}
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-6">{form.title}</h1>
            {form.excerpt && <p className="text-zinc-400 text-lg italic border-l-2 border-blue-600/40 pl-4 mb-8">{form.excerpt}</p>}
            <div className="prose prose-invert prose-blue max-w-none prose-headings:font-black prose-headings:italic prose-p:text-zinc-400 prose-code:text-blue-400 prose-img:rounded-2xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
            </div>
          </main>
        )}

      </div>

      <ToastBanner toast={toast} onClose={() => setToast(null)} />
    </Protect>
  );
}
