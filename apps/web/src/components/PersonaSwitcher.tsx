"use client";

import React, { useState } from "react";
import { usePersona } from "../context/PersonaContext";
import { Crown, Building2, Home, Key, ShieldCheck, ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export function PersonaSwitcher() {
  const { currentPersona, switchPersona, allPersonas } = usePersona();
  const [isOpen, setIsOpen] = useState(false);

  const getPersonaIcon = (role: string) => {
    switch (role) {
      case "CHAIRMAN":
        return <Crown className="w-4 h-4 text-amber-500" />;
      case "WING_REP":
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case "OWNER":
        return <Home className="w-4 h-4 text-emerald-500" />;
      case "TENANT":
        return <Key className="w-4 h-4 text-orange-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <aside aria-label="Demo Persona Switcher" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      {/* Expanded Persona Details Card */}
      {isOpen && (
        <div className="mb-3 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 p-4 shadow-2xl text-zinc-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">
                Live Hackathon Demo Persona Context
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            {allPersonas.map((p) => {
              const isSelected = p.id === currentPersona.id;
              return (
                <button
                  key={p.id}
                  onClick={() => switchPersona(p.id)}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-zinc-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                      : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-200">
                      {getPersonaIcon(p.role)}
                      {p.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate font-mono">{p.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                      {p.roleLabel}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                      {p.scopeLabel}
                    </span>
                  </div>
                  {p.pendingDues > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                      <AlertCircle className="w-3 h-3" />
                      ₹{p.pendingDues.toLocaleString("en-IN")} Pending Due
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[11px] text-zinc-400 text-center border-t border-zinc-800/60 pt-2">
            💡 <strong>Judge Note:</strong> Clicking any persona immediately re-scopes data queries, permissions, and views across the platform without manual re-login.
          </p>
        </div>
      )}

      {/* Floating Sticky Pill Bar */}
      <div className="flex items-center justify-between gap-2 p-1.5 px-3 rounded-full bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 shadow-2xl">
        {/* Current Active Indicator */}
        <div className="flex items-center gap-2 pl-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 text-xs font-bold">
            {currentPersona.avatar}
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white tracking-tight">{currentPersona.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentPersona.roleLabel}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400">
              {currentPersona.scopeLabel} • {currentPersona.flatNumber || currentPersona.wing}
            </div>
          </div>
        </div>

        {/* Quick Persona Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {allPersonas.map((p) => {
            const isSelected = p.id === currentPersona.id;
            return (
              <button
                key={p.id}
                onClick={() => switchPersona(p.id)}
                title={`Switch to ${p.name} (${p.roleLabel})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {getPersonaIcon(p.role)}
                <span className="hidden md:inline">{p.name.split(" ")[0]}</span>
                <span className="md:hidden">{p.role === "CHAIRMAN" ? "Chair" : p.role === "WING_REP" ? "Rep" : p.role === "OWNER" ? "Owner" : "Tenant"}</span>
                {p.pendingDues > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Toggle Details Chevron */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          title="Toggle Persona Details"
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
