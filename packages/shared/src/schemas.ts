import { z } from "zod";
import {
  Role,
  ScopeType,
  PaymentMethod,
  NoticeCategory,
  ComplaintCategory,
  ComplaintPriority,
  PollType,
  MembershipRelation,
  UnitType,
} from "./constants";

// ─── Auth Schemas ────────────────────────────────────────
export const sendOtpSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
});

export const verifyOtpSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ─── Society / Wing / Unit ───────────────────────────────
export const createWingSchema = z.object({
  name: z.string().min(1).max(50),
  floors: z.number().int().min(1).max(100),
});

export const createUnitSchema = z.object({
  wingId: z.string().uuid(),
  number: z.string().min(1), // e.g. "A-101"
  floor: z.number().int().min(0),
  areaSqft: z.number().positive(),
  type: z.nativeEnum(UnitType),
});

// ─── Finance ─────────────────────────────────────────────
export const paymentIntentSchema = z.object({
  invoiceIds: z.array(z.string().uuid()).min(1),
});

export const recordOfflinePaymentSchema = z.object({
  unitId: z.string().uuid(),
  invoiceIds: z.array(z.string().uuid()).min(1),
  amount: z.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Notices ─────────────────────────────────────────────
export const createNoticeSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  category: z.nativeEnum(NoticeCategory),
  pinned: z.boolean().default(false),
  targetWingIds: z.array(z.string().uuid()).optional(),
  targetUnitIds: z.array(z.string().uuid()).optional(),
  publishAt: z.string().datetime().optional(),
  expireAt: z.string().datetime().optional(),
});

// ─── Complaints ──────────────────────────────────────────
export const createComplaintSchema = z.object({
  category: z.nativeEnum(ComplaintCategory),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priority: z.nativeEnum(ComplaintPriority).default(ComplaintPriority.MEDIUM),
  anonymous: z.boolean().default(false),
  wingId: z.string().uuid().optional(),
  unitId: z.string().uuid().optional(),
});

export const addComplaintCommentSchema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().default(false),
});

// ─── Polls ───────────────────────────────────────────────
export const createPollSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  type: z.nativeEnum(PollType),
  options: z.array(z.string().min(1)).min(2),
  ownersOnly: z.boolean().default(true),
  secretBallot: z.boolean().default(false),
  quorumPercentage: z.number().min(0).max(100).optional(),
  opensAt: z.string().datetime(),
  closesAt: z.string().datetime(),
  wingId: z.string().uuid().optional(), // null = society-wide
});

export const castVoteSchema = z.object({
  pollId: z.string().uuid(),
  optionIds: z.array(z.string().uuid()).min(1),
});

// ─── Amenity Booking ─────────────────────────────────────
export const createBookingSchema = z.object({
  amenityId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
});

// ─── Meetings ────────────────────────────────────────────
export const rsvpSchema = z.object({
  meetingId: z.string().uuid(),
  response: z.enum(["ATTENDING", "PROXY", "NOT_ATTENDING"]),
});
