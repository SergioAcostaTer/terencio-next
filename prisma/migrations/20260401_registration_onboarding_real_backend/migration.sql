ALTER TABLE "MembershipSubmission"
ADD COLUMN "onboardingDocuments" JSONB,
ADD COLUMN "currentStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "completionPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "MembershipSubmission"
SET
  "updatedAt" = COALESCE("submittedAt", "createdAt"),
  "completionPercentage" = CASE
    WHEN "status" IN ('pending', 'review_pending', 'approved') THEN 100
    ELSE 0
  END,
  "currentStep" = 5;

UPDATE "MembershipSubmission"
SET "status" = 'review_pending'
WHERE "status" = 'pending';
