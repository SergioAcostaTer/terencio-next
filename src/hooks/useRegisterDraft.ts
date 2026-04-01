"use client";

import { useEffect, useState } from "react";

import { useAutosave } from "@/hooks/useAutosave";
import { useDraftSync } from "@/hooks/useDraftSync";
import {
  LOCAL_STORAGE_KEY,
  createEmptyRegistrationDraftData,
  type AuthorizedPerson,
  type ClientType,
  type DocumentType,
  type DraftStorageSnapshot,
  type RegistrationDraftData,
  type RegistrationRecord,
  type UploadedDocument,
} from "@/lib/registrations/types";
import { getMissingRequirements, getStepErrors } from "@/lib/registrations/validation";

type SaveState = "idle" | "saving" | "saved" | "error" | "local_only";

function parseSnapshot(raw: string | null): DraftStorageSnapshot | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DraftStorageSnapshot;
  } catch {
    return null;
  }
}

function getMostRecentRecord(args: {
  local: DraftStorageSnapshot | null;
  remote: RegistrationRecord | null;
}) {
  if (!args.local && !args.remote) {
    return null;
  }

  if (!args.remote) {
    return { source: "local" as const, snapshot: args.local! };
  }

  if (!args.local) {
    return { source: "remote" as const, record: args.remote };
  }

  const localTime = args.local.updatedAt ? new Date(args.local.updatedAt).getTime() : 0;
  const remoteTime = new Date(args.remote.updatedAt).getTime();

  if (localTime >= remoteTime) {
    return { source: "local" as const, snapshot: args.local };
  }

  return { source: "remote" as const, record: args.remote };
}

function buildSnapshot(args: {
  draftId: string | null;
  currentStep: number;
  data: RegistrationDraftData;
  saveState: SaveState;
}) {
  const timestamp = new Date().toISOString();

  return {
    draftId: args.draftId,
    currentStep: args.currentStep,
    data: args.data,
    updatedAt: timestamp,
    lastServerSyncAt: args.saveState === "saved" ? timestamp : null,
  } satisfies DraftStorageSnapshot;
}

export function useRegisterDraft() {
  const draftSync = useDraftSync();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegistrationDraftData>(createEmptyRegistrationDraftData());
  const [hydrated, setHydrated] = useState(true);
  const [draftFound, setDraftFound] = useState(false);
  const [draftChoiceResolved, setDraftChoiceResolved] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{
    draftId: string | null;
    currentStep: number;
    data: RegistrationDraftData;
    lastSavedAt: string | null;
    pendingSync: boolean;
  } | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitValidation, setSubmitValidation] = useState<{ fields: string[]; documents: string[] } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<DocumentType, string>>>({});
  const [version, setVersion] = useState(0);
  const [pendingSync, setPendingSync] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function restore() {
      const local = parseSnapshot(window.localStorage.getItem(LOCAL_STORAGE_KEY));
      let remote: RegistrationRecord | null = null;

      if (local?.draftId) {
        try {
          const payload = await draftSync.fetchDraft(local.draftId);
          remote = payload.record;
        } catch {
          if (mounted && local) {
            setSaveState("local_only");
          }
        }
      }

      if (!mounted) {
        return;
      }

      const latest = getMostRecentRecord({ local, remote });

      if (!latest) {
        setDraftChoiceResolved(true);
        return;
      }

      if (latest.source === "local") {
        setPendingDraft({
          draftId: latest.snapshot.draftId,
          currentStep: latest.snapshot.currentStep,
          data: latest.snapshot.data,
          lastSavedAt: latest.snapshot.updatedAt,
          pendingSync: true,
        });
      } else {
        setPendingDraft({
          draftId: latest.record.id,
          currentStep: latest.record.currentStep,
          data: latest.record.data,
          lastSavedAt: latest.record.updatedAt,
          pendingSync: false,
        });
      }

      setDraftFound(true);
    }

    void restore().catch(() => {
      if (!mounted) {
        return;
      }
      setLoadError("No se pudo recuperar tu borrador. Puedes continuar y se volverá a guardar.");
      setDraftChoiceResolved(true);
    });

    return () => {
      mounted = false;
    };
  }, [draftSync]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const handleBeforeUnload = () => {
      const snapshot = buildSnapshot({
        draftId,
        currentStep,
        data,
        saveState,
      });
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentStep, data, draftId, hydrated, saveState]);

  useAutosave(
    () => {
      const snapshot = buildSnapshot({
        draftId,
        currentStep,
        data,
        saveState,
      });
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
      setLastSavedAt(snapshot.updatedAt);
      setSaveState((current) => (current === "local_only" ? "local_only" : "saved"));
    },
    200,
    [draftId, currentStep, data, version, saveState],
    hydrated && draftChoiceResolved && version > 0,
  );

  useAutosave(
    () => {
      setSaveState("saving");

      void draftSync
        .saveDraft({
          id: draftId ?? undefined,
          currentStep,
          data,
        })
        .then((payload) => {
          setDraftId(payload.record.id);
          setCurrentStep(payload.record.currentStep);
          setData(payload.record.data);
          setLastSavedAt(payload.record.updatedAt);
          setSaveState("saved");
          setPendingSync(false);
        })
        .catch(() => {
          setSaveState("local_only");
        });
    },
    1000,
    [draftId, currentStep, data, version, pendingSync],
    hydrated && draftChoiceResolved && (version > 0 || pendingSync),
  );

  function touch() {
    setVersion((value) => value + 1);
    setPendingSync(true);
    setSaveState("saving");
  }

  function dismissDraft() {
    if (pendingDraft) {
      setDraftId(pendingDraft.draftId);
      setCurrentStep(pendingDraft.currentStep);
      setData(pendingDraft.data);
      setLastSavedAt(pendingDraft.lastSavedAt);
      setPendingSync(pendingDraft.pendingSync);
      setSaveState(pendingDraft.pendingSync ? "local_only" : "saved");
    }

    setPendingDraft(null);
    setDraftFound(false);
    setDraftChoiceResolved(true);
  }

  function clearDraft() {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDraftId(null);
    setCurrentStep(1);
    setData(createEmptyRegistrationDraftData());
    setLastSavedAt(null);
    setDraftFound(false);
    setDraftChoiceResolved(true);
    setPendingDraft(null);
    setPendingSync(false);
    setVersion(0);
    setSaveState("idle");
    setSubmitError(null);
    setSubmitValidation(null);
    setUploadErrors({});
    setLegalAccepted(false);
  }

  function updateField<K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
    setSubmitValidation(null);
    setSubmitError(null);
    touch();
  }

  function setClientType(clientType: ClientType) {
    setData((current) => ({
      ...current,
      clientType,
      documents: current.documents.filter((document) => {
        if (document.type === "other") {
          return true;
        }

        if (clientType === "autonomo") {
          return document.type === "nif" || document.type === "modelo_036_037" || document.type === "alta_autonomo";
        }

        if (clientType === "empresa") {
          return document.type === "nif" || document.type === "cif_empresa";
        }

        return false;
      }),
    }));
    setSubmitValidation(null);
    setSubmitError(null);
    setUploadErrors((current) => ({
      ...current,
      modelo_036_037: undefined,
      alta_autonomo: undefined,
      cif_empresa: undefined,
    }));
    touch();
  }

  function addAuthorizedPerson() {
    const person: AuthorizedPerson = {
      id: crypto.randomUUID(),
      nombre: "",
      nif: "",
    };
    setData((current) => ({
      ...current,
      personasAutorizadas: [...current.personasAutorizadas, person],
    }));
    touch();
  }

  function updateAuthorizedPerson(id: string, field: keyof AuthorizedPerson, value: string) {
    setData((current) => ({
      ...current,
      personasAutorizadas: current.personasAutorizadas.map((person) =>
        person.id === id ? { ...person, [field]: value } : person,
      ),
    }));
    touch();
  }

  function removeAuthorizedPerson(id: string) {
    setData((current) => ({
      ...current,
      personasAutorizadas: current.personasAutorizadas.filter((person) => person.id !== id),
    }));
    touch();
  }

  async function uploadDocument(type: DocumentType, file: File) {
    setUploadErrors((current) => ({
      ...current,
      [type]: undefined,
    }));
    setUploadingType(type);

    try {
      const document = await draftSync.uploadDocument({
        draftId,
        type,
        file,
      });

      setData((current) => {
        const filtered =
          type === "other"
            ? current.documents
            : current.documents.filter((item) => item.type !== type);

        return {
          ...current,
          documents: [...filtered, document],
        };
      });
      touch();
      return document;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo subir el documento.";
      setUploadErrors((current) => ({
        ...current,
        [type]: message,
      }));
      throw error;
    } finally {
      setUploadingType(null);
    }
  }

  function setUploadError(type: DocumentType, message: string | null) {
    setUploadErrors((current) => ({
      ...current,
      [type]: message ?? undefined,
    }));
  }

  function removeDocument(documentId: string) {
    setData((current) => ({
      ...current,
      documents: current.documents.filter((item) => item.id !== documentId),
    }));
    touch();
  }

  async function submit() {
    if (!draftId) {
      setSubmitError("Todavía estamos guardando tu solicitud. Espera un momento y vuelve a intentarlo.");
      return null;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = await draftSync.submitDraft(draftId);
      if (!payload.success) {
        setSubmitValidation(payload.errors ?? { fields: [], documents: [] });
        setSubmitError(payload.error ?? "Todavía faltan algunos datos para enviar la solicitud.");
        return null;
      }

      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSaveState("saved");
      return payload.record;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo enviar la solicitud.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentStepValidation = getStepErrors(currentStep, data);
  const missingRequirements = getMissingRequirements(data);

  function updateCurrentStep(step: number) {
    setCurrentStep(step);
    touch();
  }

  return {
    draftId,
    currentStep,
    data,
    hydrated,
    draftFound,
    saveState,
    lastSavedAt,
    loadError,
    submitError,
    submitValidation,
    isSubmitting,
    uploadingType,
    uploadErrors,
    legalAccepted,
    currentStepValidation,
    missingRequirements,
    setCurrentStep: updateCurrentStep,
    updateField,
    setClientType,
    addAuthorizedPerson,
    updateAuthorizedPerson,
    removeAuthorizedPerson,
    uploadDocument,
    setUploadError,
    removeDocument,
    setLegalAccepted,
    dismissDraft,
    clearDraft,
    submit,
  };
}
