"use client";

import React, { useState } from "react";
import { usePersona } from "../context/PersonaContext";
import {
  ShieldCheck,
  Building,
  Layers,
  Wallet,
  FileText,
  AlertTriangle,
  Vote,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Receipt,
  Users,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const { currentPersona, isSocietyAdmin, isWingRep, isResident, isOwner, switchPersona } = usePersona();
  const [billPaid, setBillPaid] = useState(false);
  const [voted, setVoted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ─── Hero / Context Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-zinc-900 border border-indigo-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Apex Heights CHS • Live Demo Environment
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-indigo-400">{currentPersona.name}</span>
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl">
              {currentPersona.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] text-zinc-400 uppercase font-semibold tracking-wider">Active Scope</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentPersona.scopeLabel}
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] text-zinc-400 uppercase font-semibold tracking-wider">Assigned Role</div>
              <div className="text-sm font-bold text-indigo-300 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
                {currentPersona.roleLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ─── Persona-Adaptive View ────────────────────────────────────────── */}
      {isSocietyAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Society-Wide Executive Command Center
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-medium">
              Chairman Oversight
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
                <span>Total Reserves</span>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                ₹5,40,000
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Across 4 Segregated Fund Heads
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
                <span>Collection Rate</span>
                <Receipt className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                94.2%
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                38 of 40 Flats Cleared Oct 2026
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
                <span>Active Units & Wings</span>
                <Building className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                40 Flats
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Wing A (20 Flats) • Wing B (20 Flats)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
                <span>Governance Quorum</span>
                <Vote className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                72.5%
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                29 / 40 Votes in Solar AGM Poll
              </div>
            </div>
          </div>

          {/* Fund Breakdown & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center justify-between">
                <span>Fund Head Ledger Breakdown</span>
                <span className="text-xs font-normal text-zinc-500">Append-Only Immutability</span>
              </h3>
              <div className="space-y-3">
                {[
                  { name: "General Maintenance Fund", balance: "₹2,85,000", target: "65%", color: "bg-indigo-500" },
                  { name: "Sinking Fund (Statutory)", balance: "₹1,60,000", target: "25%", color: "bg-emerald-500" },
                  { name: "Clubhouse & Amenities Reserve", balance: "₹65,000", target: "8%", color: "bg-amber-500" },
                  { name: "Major Repairs & Painting Fund", balance: "₹30,000", target: "2%", color: "bg-rose-500" },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      <span>{f.name}</span>
                      <span className="font-mono text-sm">{f.balance}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${f.color} rounded-full`} style={{ width: f.target }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Executive Quick Triggers
              </h3>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-left transition-all">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Broadcast Society-wide Notice
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-left transition-all">
                <span className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-500" />
                  Trigger November Billing Run
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-left transition-all">
                <span className="flex items-center gap-2">
                  <Vote className="w-4 h-4 text-amber-500" />
                  Review Active Solar AGM Poll
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isWingRep && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              Wing A Dedicated Representative Portal
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-medium">
              Wing A Isolation Guard Active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Isolation Boundary Enforced:</strong> As Wing A Rep, you only see tickets, notices, and units belonging to Wing A. Wing B complaints and society-wide bank accounts are strictly isolated.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Wing A Flats</div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">20 Units</div>
              <div className="text-xs text-zinc-500 mt-1">Floors 1 to 10 (101 to 1002)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Wing A Open Tickets</div>
              <div className="text-2xl font-black text-amber-500 mt-2">2 In Progress</div>
              <div className="text-xs text-zinc-500 mt-1">Elevator #1 sensor replacement</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Wing Targeted Notices</div>
              <div className="text-2xl font-black text-indigo-500 mt-2">1 Active</div>
              <div className="text-xs text-zinc-500 mt-1">Wing A Elevator Maintenance (Oct 16)</div>
            </div>
          </div>
        </div>
      )}

      {isResident && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              Resident Flat Hub — {currentPersona.flatNumber}
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
              {isOwner ? "Owner Perspective" : "Tenant Perspective"}
            </span>
          </div>

          {/* Pending Due Card (for A-402) */}
          {isOwner && currentPersona.pendingDues > 0 && !billPaid && (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase">
                      Payment Overdue
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Invoice #INV-2026-10-A402</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    October 2026 Maintenance Bill: <span className="text-rose-600 dark:text-rose-400">₹4,500</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Breakdown: General Maint (₹3,000) + Sinking Fund (₹1,000) + Clubhouse (₹500)
                  </p>
                </div>

                <button
                  onClick={() => setBillPaid(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                >
                  <Receipt className="w-4 h-4" />
                  Simulate UPI / Razorpay Payment
                </button>
              </div>
            </div>
          )}

          {billPaid && (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <div>
                  <h4 className="font-bold text-sm">Payment Successful & Ledger Synchronized!</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    ₹4,500 credited to Apex Society Ledger across 3 fund heads. Receipt #REC-98231 auto-generated.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBillPaid(false)}
                className="text-xs underline text-emerald-600 dark:text-emerald-400"
              >
                Reset Demo
              </button>
            </div>
          )}

          {/* Resident Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active AGM Poll Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  AGM Poll #1
                </span>
                <span className="text-xs text-zinc-400">Closes Oct 20</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Resolution: Approve 50kW Rooftop Solar Installation
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Estimated budget: ₹12,00,000 from Sinking Fund. Expected 40% reduction in common area electricity bill.
                </p>
              </div>

              {!voted ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setVoted(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    Vote YES (In Favor)
                  </button>
                  <button
                    onClick={() => setVoted(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    Vote NO
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <span>✅ Vote recorded for Unit {currentPersona.flatNumber}</span>
                  <button onClick={() => setVoted(false)} className="text-[11px] underline">Change</button>
                </div>
              )}
            </div>

            {/* Amenity Booking Shortcut */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Amenities
                </span>
                <span className="text-xs text-emerald-500 font-medium">Slots Available</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Clubhouse Party Hall & Badminton Court
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Automated slot reservation with conflict-free double booking prevention and automated dues verification.
                </p>
              </div>
              <button className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                <Calendar className="w-4 h-4" />
                Reserve Amenity Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Phase 0 Architecture & Hackathon Readiness Showcase ──────────── */}
      <section className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Phase 0: Monorepo Foundation & Seed Status
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Targeted deliverables verified and ready for Phase 1 Scoped RBAC implementation
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Phase 0 Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span>Task 0.1: Turborepo Monorepo</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Next.js 16 (App Router + Tailwind) + NestJS 12 + @apnasociety/shared with Zod schemas & utils.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span>Task 0.2: Postgres 16 & Redis 7</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Containerized docker-compose.yml with healthchecks, pgcrypto, and persistent volumes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span>Task 0.3: Relational Schema</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Prisma schema covering 10 modules: Scoped RBAC, Fund Heads, Ledger, Notices, Complaints, Polls.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span>Task 0.4: Realistic DB Seeder</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Apex Heights CHS pre-seeded with 40 flats, 4 fund heads, 3 billing runs, and 4 demo roles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span>Task 0.5: Persona Switcher</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              1-click sticky floating bar live at the bottom. Instant state re-scoping across views.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <span>Next: Phase 1 Sprint</span>
              <ArrowRight className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
              Identity, RBAC Guards, Wing Isolation filters, and Resident / Admin dashboard shells.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
