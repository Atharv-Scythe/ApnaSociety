export interface Persona {
  id: string;
  name: string;
  email: string;
  role: "CHAIRMAN" | "WING_REP" | "OWNER" | "TENANT";
  roleLabel: string;
  badgeColor: string;
  scopeType: "SOCIETY" | "WING" | "UNIT";
  scopeLabel: string;
  wing?: string;
  flatNumber?: string;
  phone: string;
  avatar: string;
  pendingDues: number;
  unreadNoticesCount: number;
  openComplaintsCount: number;
  description: string;
}

export const DEMO_PERSONAS: Persona[] = [
  {
    id: "user-chairman-1",
    name: "Rajesh Sharma",
    email: "chairman@apex.com",
    role: "CHAIRMAN",
    roleLabel: "Society Chairman",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    scopeType: "SOCIETY",
    scopeLabel: "Entire Society (All Wings)",
    wing: "All Wings",
    flatNumber: "A-1001",
    phone: "+91 98200 11223",
    avatar: "RS",
    pendingDues: 0,
    unreadNoticesCount: 3,
    openComplaintsCount: 5,
    description: "Full oversight of all 40 flats, 4 fund heads, billing cycles, AGM meetings & elections.",
  },
  {
    id: "user-wingrep-a",
    name: "Sunita Patel",
    email: "wingrep.a@apex.com",
    role: "WING_REP",
    roleLabel: "Wing Rep (Wing A)",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    scopeType: "WING",
    scopeLabel: "Wing A Isolated Scope",
    wing: "Wing A",
    flatNumber: "A-201",
    phone: "+91 98200 22334",
    avatar: "SP",
    pendingDues: 0,
    unreadNoticesCount: 2,
    openComplaintsCount: 2,
    description: "Scoped view for Wing A only (20 flats). Handles Wing elevator tickets and Wing notices.",
  },
  {
    id: "user-owner-a402",
    name: "Amit Verma",
    email: "resident.a402@apex.com",
    role: "OWNER",
    roleLabel: "Flat Owner (A-402)",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    scopeType: "UNIT",
    scopeLabel: "Flat A-402 (Wing A)",
    wing: "Wing A",
    flatNumber: "A-402",
    phone: "+91 98200 33445",
    avatar: "AV",
    pendingDues: 4500,
    unreadNoticesCount: 1,
    openComplaintsCount: 1,
    description: "Resident owner. Current pending bill of ₹4,500 due. Can vote in polls & book amenities.",
  },
  {
    id: "user-tenant-b101",
    name: "Karan Rao",
    email: "tenant.b101@apex.com",
    role: "TENANT",
    roleLabel: "Tenant Resident (B-101)",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    scopeType: "UNIT",
    scopeLabel: "Flat B-101 (Wing B)",
    wing: "Wing B",
    flatNumber: "B-101",
    phone: "+91 98200 44556",
    avatar: "KR",
    pendingDues: 0,
    unreadNoticesCount: 1,
    openComplaintsCount: 0,
    description: "Tenant in Wing B. Can view notices, raise complaints, and book amenities.",
  },
];
