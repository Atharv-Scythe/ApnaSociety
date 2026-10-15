"use client";

import React from "react";
import { usePersona } from "../context/PersonaContext";
import { Building, Shield, Bell, HelpCircle } from "lucide-react";

export function Header() {
  const { currentPersona } = usePersona();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Society Context */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg shadow-md shadow-indigo-500/20">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                ApnaSociety
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-600/20">
                v0.1 Phase 0
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Building className="w-3 h-3 text-zinc-400" />
              Apex Heights CHS • Baner, Pune
            </p>
          </div>
        </div>

        {/* Center: System Scope Pills */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Scope: <strong>{currentPersona.scopeLabel}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Role: <strong>{currentPersona.roleLabel}</strong></span>
          </div>
        </div>

        {/* Right: Persona Badge & Notifications */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Notices"
            >
              <Bell className="w-5 h-5" />
              {currentPersona.unreadNoticesCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {currentPersona.unreadNoticesCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-sm">
              {currentPersona.avatar}
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {currentPersona.name}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {currentPersona.flatNumber || currentPersona.wing}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
