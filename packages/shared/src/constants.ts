// ─── Roles ───────────────────────────────────────────────
export enum Role {
  CHAIRMAN = "CHAIRMAN",
  SECRETARY = "SECRETARY",
  TREASURER = "TREASURER",
  WING_REP = "WING_REP",
  COMMITTEE_MEMBER = "COMMITTEE_MEMBER",
  OWNER = "OWNER",
  TENANT = "TENANT",
  STAFF = "STAFF",
}

// ─── Scope Types ─────────────────────────────────────────
export enum ScopeType {
  SOCIETY = "SOCIETY",
  WING = "WING",
  UNIT = "UNIT",
}

// ─── Society-level roles that can see all wings ──────────
export const SOCIETY_WIDE_ROLES: Role[] = [
  Role.CHAIRMAN,
  Role.SECRETARY,
  Role.TREASURER,
  Role.COMMITTEE_MEMBER,
];

// ─── Fund Types ──────────────────────────────────────────
export enum FundType {
  MAINTENANCE = "MAINTENANCE",
  SINKING = "SINKING",
  CLUBHOUSE = "CLUBHOUSE",
  REPAIR = "REPAIR",
  PARKING = "PARKING",
  COMMON_GROUNDS = "COMMON_GROUNDS",
  OTHER = "OTHER",
}

// ─── Charge Basis ────────────────────────────────────────
export enum ChargeBasis {
  FLAT = "FLAT",
  PER_SQFT = "PER_SQFT",
  UNIT_TYPE = "UNIT_TYPE",
}

// ─── Billing Cycle Status ────────────────────────────────
export enum BillingCycleStatus {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  CLOSED = "CLOSED",
}

// ─── Invoice Status ──────────────────────────────────────
export enum InvoiceStatus {
  PENDING = "PENDING",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  WAIVED = "WAIVED",
}

// ─── Payment Method ──────────────────────────────────────
export enum PaymentMethod {
  UPI = "UPI",
  CARD = "CARD",
  NETBANKING = "NETBANKING",
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  NEFT = "NEFT",
  SIMULATED = "SIMULATED",
}

// ─── Payment Status ──────────────────────────────────────
export enum PaymentStatus {
  INITIATED = "INITIATED",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// ─── Notice Category ─────────────────────────────────────
export enum NoticeCategory {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  DECISION = "DECISION",
  RULES = "RULES",
  CLASSIFIED = "CLASSIFIED",
  EVENT = "EVENT",
  EMERGENCY = "EMERGENCY",
}

// ─── Complaint Category ──────────────────────────────────
export enum ComplaintCategory {
  PLUMBING = "PLUMBING",
  ELECTRICAL = "ELECTRICAL",
  ELEVATOR = "ELEVATOR",
  SECURITY = "SECURITY",
  PARKING = "PARKING",
  NOISE = "NOISE",
  HOUSEKEEPING = "HOUSEKEEPING",
  OTHER = "OTHER",
}

// ─── Complaint Status ────────────────────────────────────
export enum ComplaintStatus {
  OPEN = "OPEN",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  REOPENED = "REOPENED",
}

// ─── Complaint Priority ──────────────────────────────────
export enum ComplaintPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// ─── Poll Type ───────────────────────────────────────────
export enum PollType {
  YES_NO = "YES_NO",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTI_CHOICE = "MULTI_CHOICE",
}

// ─── Poll Status ─────────────────────────────────────────
export enum PollStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

// ─── Membership Relation ─────────────────────────────────
export enum MembershipRelation {
  OWNER = "OWNER",
  TENANT = "TENANT",
  FAMILY = "FAMILY",
}

// ─── Unit Type ───────────────────────────────────────────
export enum UnitType {
  ONE_BHK = "1BHK",
  TWO_BHK = "2BHK",
  THREE_BHK = "3BHK",
  FOUR_BHK = "4BHK",
  PENTHOUSE = "PENTHOUSE",
  SHOP = "SHOP",
}

// ─── Booking Status ──────────────────────────────────────
export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

// ─── Meeting Type ────────────────────────────────────────
export enum MeetingType {
  AGM = "AGM",
  SGM = "SGM",
  COMMITTEE = "COMMITTEE",
  WING = "WING",
}

// ─── Ledger Account Types ────────────────────────────────
export enum LedgerAccount {
  UNIT_RECEIVABLE = "UNIT_RECEIVABLE",
  FUND_INCOME = "FUND_INCOME",
  BANK_GATEWAY = "BANK_GATEWAY",
  LATE_FEE_INCOME = "LATE_FEE_INCOME",
  FUND_EXPENSE = "FUND_EXPENSE",
  CASH = "CASH",
}
