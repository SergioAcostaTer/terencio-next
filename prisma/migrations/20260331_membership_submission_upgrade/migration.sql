ALTER TABLE "MembershipSubmission"
ADD COLUMN "mobile" TEXT,
ADD COLUMN "activity" TEXT,
ADD COLUMN "iaeCode" TEXT,
ADD COLUMN "tariff" TEXT,
ADD COLUMN "addressLine" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "province" TEXT,
ADD COLUMN "zone" TEXT,
ADD COLUMN "authorizedPersons" JSONB,
ADD COLUMN "documentationStatus" JSONB,
ADD COLUMN "legalAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "source" TEXT DEFAULT 'qr',
ADD COLUMN "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "MembershipSubmission"
SET
  "activity" = COALESCE("activity", 'Pendiente'),
  "addressLine" = COALESCE("addressLine", 'Pendiente'),
  "postalCode" = COALESCE("postalCode", '00000'),
  "city" = COALESCE("city", 'Pendiente'),
  "documentationStatus" = COALESCE(
    "documentationStatus",
    CASE
      WHEN "type" = 'empresa' THEN '{"cif":"pending","modelo036":"pending"}'::jsonb
      ELSE '{"dni":"pending","autonomoProof":"pending"}'::jsonb
    END
  ),
  "authorizedPersons" = COALESCE("authorizedPersons", '[]'::jsonb),
  "submittedAt" = COALESCE("submittedAt", "createdAt");

ALTER TABLE "MembershipSubmission"
ALTER COLUMN "activity" SET NOT NULL,
ALTER COLUMN "addressLine" SET NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "authorizedPersons" SET NOT NULL,
ALTER COLUMN "documentationStatus" SET NOT NULL;
