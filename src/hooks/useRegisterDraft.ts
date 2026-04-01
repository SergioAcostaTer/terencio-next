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
import { getStepErrors } from "@/lib/registrations/validation";

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

export function useRegisterDraft() {
  const draftSync = useDraftSync();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegistrationDraftData>(createEmptyRegistrationDraftData());
  const [hydrated, setHydrated] = useState(false);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitValidation, setSubmitValidation] = useState<{ fields: string[]; documents: string[] } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [pendingSync, setPendingSync] = useState(false);

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
        setHydrated(true);
        return;
      }

      if (latest.source === "local") {
        setDraftId(latest.snapshot.draftId);
        setCurrentStep(latest.snapshot.currentStep);
        setData(latest.snapshot.data);
        setLastSavedAt(latest.snapshot.updatedAt);
        setRestoredFromDraft(true);
        setPendingSync(true);
      } else {
        setDraftId(latest.record.id);
        setCurrentStep(latest.record.currentStep);
        setData(latest.record.data);
        setLastSavedAt(latest.record.updatedAt);
        setRestoredFromDraft(true);
      }

      setHydrated(true);
    }

    void restore().catch(() => {
      if (!mounted) {
        return;
      }
      setLoadError("No se pudo recuperar tu borrador. Puedes continuar y se volverá a guardar.");
      setHydrated(true);
    });

    return () => {
      mounted = false;
    };
  }, [draftSync]);

  useAutosave(
    () => {
      const snapshot: DraftStorageSnapshot = {
        draftId,
        currentStep,
        data,
        updatedAt: new Date().toISOString(),
        lastServerSyncAt: saveState === "saved" ? new Date().toISOString() : null,
      };
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
      setLastSavedAt(snapshot.updatedAt);
    },
    120,
    [draftId, currentStep, data, version],
    hydrated && version > 0,
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
    900,
    [draftId, currentStep, data, version, pendingSync],
    hydrated && (version > 0 || pendingSync),
  );

  function touch() {
    setVersion((value) => value + 1);
    setPendingSync(true);
    setSaveState("saving");
  }

  function updateField<K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
    setSubmitValidation(null);
    touch();
  }

  function setClientType(clientType: ClientType) {
    setData((current) => ({
      ...current,
      clientType,
      documents: current.documents.filter((document) => document.type === "other" || document.type === "nif"),
    }));
    setSubmitValidation(null);
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
    setUploadError(null);
    setUploadingType(type);

    try {
      const document = await draftSync.uploadDocument({
        draftId,
        type,
        file,
      });

      setData((current) => {
        const filtered = current.documents.filter((item) => !(item.type === type && type !== "other"));
        return {
          ...current,
          documents: [...filtered, document],
        };
      });
      touch();
      return document;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "No se pudo subir el documento.");
      throw error;
    } finally {
      setUploadingType(null);
    }
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
    } catch {
      setSubmitError("No se pudo enviar la solicitud. Tu borrador sigue guardado.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentStepValidation = getStepErrors(currentStep, data);

  function updateCurrentStep(step: number) {
    setCurrentStep(step);
    touch();
  }

  return {
    draftId,
    currentStep,
    data,
    hydrated,
    restoredFromDraft,
    saveState,
    lastSavedAt,
    loadError,
    submitError,
    submitValidation,
    isSubmitting,
    uploadingType,
    uploadError,
    currentStepValidation,
    setCurrentStep: updateCurrentStep,
    updateField,
    setClientType,
    addAuthorizedPerson,
    updateAuthorizedPerson,
    removeAuthorizedPerson,
    uploadDocument,
    removeDocument,
    submit,
  };
}
