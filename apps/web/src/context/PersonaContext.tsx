"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Persona, DEMO_PERSONAS } from "../types/persona";

interface PersonaContextType {
  currentPersona: Persona;
  switchPersona: (personaId: string) => void;
  allPersonas: Persona[];
  isSocietyAdmin: boolean;
  isWingRep: boolean;
  isResident: boolean;
  isOwner: boolean;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

const STORAGE_KEY = "apnasociety_demo_persona_id";

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const found = DEMO_PERSONAS.find((p) => p.id === savedId);
        if (found) {
          setCurrentPersona(found);
          document.cookie = `apna_persona_id=${found.id}; path=/; max-age=604800`;
        }
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const switchPersona = (personaId: string) => {
    const found = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (found) {
      setCurrentPersona(found);
      try {
        localStorage.setItem(STORAGE_KEY, found.id);
        document.cookie = `apna_persona_id=${found.id}; path=/; max-age=604800`;
      } catch {
        // Fallback
      }
    }
  };

  const isSocietyAdmin = currentPersona.role === "CHAIRMAN";
  const isWingRep = currentPersona.role === "WING_REP";
  const isResident = currentPersona.role === "OWNER" || currentPersona.role === "TENANT";
  const isOwner = currentPersona.role === "OWNER";

  return (
    <PersonaContext.Provider
      value={{
        currentPersona,
        switchPersona,
        allPersonas: DEMO_PERSONAS,
        isSocietyAdmin,
        isWingRep,
        isResident,
        isOwner,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
}
