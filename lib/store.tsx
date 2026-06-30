"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { buildSeed } from "./seed";
import { uid } from "./format";
import { getSupabase, loadRemoteData, saveRemoteData, SUPABASE_ENABLED } from "./supabase/client";
import type {
  AppData,
  CalendarEvent,
  EventType,
  FileCategory,
  Invoice,
  InvoiceStatus,
  Message,
  NotificationPreferences,
  Profile,
  PropertyPhoto,
  Proposal,
  ProposalStatus,
  Task,
  TaskPriority,
  TaskStatus,
} from "./types";

const STORAGE_KEY = "propertypulse:v1";
const TODAY = "2026-06-30";

interface State {
  data: AppData;
  currentUserId: string | null;
  hydrated: boolean;
}

type Action =
  | { type: "HYDRATE"; payload: State }
  | { type: "REPLACE_DATA"; data: AppData }
  | { type: "LOGIN"; userId: string }
  | { type: "LOGOUT" }
  | { type: "PATCH"; mutate: (data: AppData, actorId: string) => void };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.payload, hydrated: true };
    case "REPLACE_DATA":
      return { ...state, data: action.data };
    case "LOGIN":
      return { ...state, currentUserId: action.userId };
    case "LOGOUT":
      return { ...state, currentUserId: null };
    case "PATCH": {
      const next = structuredClone(state.data);
      action.mutate(next, state.currentUserId ?? "");
      return { ...state, data: next };
    }
    default:
      return state;
  }
}

function initialState(): State {
  return { data: buildSeed(), currentUserId: null, hydrated: false };
}

interface StoreContextValue {
  data: AppData;
  currentUser: Profile | null;
  hydrated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  // mutations
  addTask: (input: Omit<Task, "id" | "created_at" | "status" | "created_by"> & { status?: TaskStatus }) => void;
  advanceTask: (taskId: string) => void;
  setTaskStatus: (taskId: string, status: TaskStatus) => void;
  addProposal: (input: { property_id: string; title: string; description?: string; vendor_name?: string; estimated_cost: number }) => void;
  respondProposal: (proposalId: string, status: ProposalStatus, response?: string) => void;
  addFile: (input: { property_id: string; name: string; category: FileCategory; size_bytes?: number }) => void;
  addInvoice: (input: { property_id: string; title: string; amount: number; due_date?: string }) => void;
  addEvent: (input: { property_id: string; title: string; type: EventType; start_date: string; end_date: string; notes?: string }) => void;
  sendMessage: (propertyId: string, body: string) => void;
  addPropertyPhoto: (input: { property_id: string; url: string; caption?: string }) => void;
  removePropertyPhoto: (photoId: string) => void;
  updateNotes: (propertyId: string, notes: string) => void;
  updateProfile: (patch: Partial<Pick<Profile, "full_name" | "email" | "phone" | "avatar_url">>) => void;
  updatePrefs: (patch: Partial<NotificationPreferences>) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function logActivity(
  data: AppData,
  actorId: string,
  propertyId: string,
  entity_type: AppData["activity_log"][number]["entity_type"],
  entityId: string,
  description: string,
) {
  data.activity_log.unshift({
    id: uid("a"),
    property_id: propertyId,
    actor_id: actorId,
    entity_type,
    entity_id: entityId,
    description,
    created_at: new Date().toISOString(),
  });
}

function nameOf(data: AppData, id: string): string {
  return data.profiles.find((p) => p.id === id)?.full_name ?? "Someone";
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  "To Do": "In Progress",
  "In Progress": "Completed",
  Completed: "Completed",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const savingRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The viewed persona is per-device; only the dataset is shared in the cloud.
  function readLocalUser(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw).currentUserId ?? null) : null;
    } catch {
      return null;
    }
  }

  // Hydrate on mount: from Supabase when configured, else from localStorage.
  useEffect(() => {
    let cancelled = false;
    const sb = getSupabase();
    const localUser = readLocalUser();

    if (sb) {
      (async () => {
        const remote = await loadRemoteData(sb);
        if (cancelled) return;
        if (remote) {
          dispatch({ type: "HYDRATE", payload: { data: remote, currentUserId: localUser, hydrated: true } });
        } else {
          // First run against an empty cloud DB: seed it.
          const seed = buildSeed();
          await saveRemoteData(sb, seed);
          if (cancelled) return;
          dispatch({ type: "HYDRATE", payload: { data: seed, currentUserId: localUser, hydrated: true } });
        }
      })().catch(() => {
        if (!cancelled) dispatch({ type: "HYDRATE", payload: { data: buildSeed(), currentUserId: localUser, hydrated: true } });
      });
      return () => {
        cancelled = true;
      };
    }

    // localStorage fallback
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: "HYDRATE", payload: { ...parsed, hydrated: true } });
        return;
      }
    } catch {
      /* ignore corrupt storage */
    }
    dispatch({ type: "HYDRATE", payload: { data: buildSeed(), currentUserId: null, hydrated: true } });
  }, []);

  // Persist on change: always cache locally; debounce-sync the dataset to the cloud.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: state.data, currentUserId: state.currentUserId }),
      );
    } catch {
      /* storage full / unavailable */
    }

    const sb = getSupabase();
    if (!sb) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      savingRef.current = true;
      saveRemoteData(sb, state.data).finally(() => {
        savingRef.current = false;
      });
    }, 700);
  }, [state]);

  // Pull the latest dataset when the tab regains focus, so edits made on another
  // device show up. Skipped while a local save is in flight to avoid clobbering.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const onFocus = async () => {
      if (savingRef.current || document.visibilityState === "hidden") return;
      const remote = await loadRemoteData(sb);
      if (remote) dispatch({ type: "REPLACE_DATA", data: remote });
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const currentUser = useMemo(
    () => state.data.profiles.find((p) => p.id === state.currentUserId) ?? null,
    [state.data.profiles, state.currentUserId],
  );

  const value = useMemo<StoreContextValue>(() => {
    const patch = (mutate: (data: AppData, actorId: string) => void) =>
      dispatch({ type: "PATCH", mutate });

    return {
      data: state.data,
      currentUser,
      hydrated: state.hydrated,
      login: (userId) => dispatch({ type: "LOGIN", userId }),
      logout: () => dispatch({ type: "LOGOUT" }),

      addTask: (input) =>
        patch((data, actor) => {
          const task: Task = {
            id: uid("t"),
            created_at: new Date().toISOString(),
            status: input.status ?? "To Do",
            created_by: actor,
            property_id: input.property_id,
            title: input.title,
            description: input.description,
            priority: input.priority,
            due_date: input.due_date,
            assigned_to: input.assigned_to,
            completed_at: input.status === "Completed" ? new Date().toISOString() : null,
          };
          data.tasks.unshift(task);
          logActivity(data, actor, task.property_id, "task", task.id, `${nameOf(data, actor)} created task “${task.title}”`);
        }),

      advanceTask: (taskId) =>
        patch((data, actor) => {
          const task = data.tasks.find((t) => t.id === taskId);
          if (!task) return;
          const next = NEXT_STATUS[task.status];
          if (next === task.status) return;
          task.status = next;
          if (next === "Completed") {
            task.completed_at = new Date().toISOString();
            logActivity(data, actor, task.property_id, "task", task.id, `${nameOf(data, actor)} completed task “${task.title}”`);
          } else {
            logActivity(data, actor, task.property_id, "task", task.id, `${nameOf(data, actor)} started task “${task.title}”`);
          }
        }),

      setTaskStatus: (taskId, status) =>
        patch((data, actor) => {
          const task = data.tasks.find((t) => t.id === taskId);
          if (!task) return;
          task.status = status;
          task.completed_at = status === "Completed" ? new Date().toISOString() : null;
          logActivity(data, actor, task.property_id, "task", task.id, `${nameOf(data, actor)} set “${task.title}” to ${status}`);
        }),

      addProposal: (input) =>
        patch((data, actor) => {
          const proposal: Proposal = {
            id: uid("pr"),
            property_id: input.property_id,
            title: input.title,
            description: input.description,
            vendor_name: input.vendor_name,
            estimated_cost: input.estimated_cost,
            status: "Pending",
            created_by: actor,
            created_at: new Date().toISOString(),
            owner_response: null,
            responded_by: null,
            responded_at: null,
          };
          data.proposals.unshift(proposal);
          logActivity(data, actor, proposal.property_id, "proposal", proposal.id, `${nameOf(data, actor)} created proposal “${proposal.title}”`);
        }),

      respondProposal: (proposalId, status, response) =>
        patch((data, actor) => {
          const proposal = data.proposals.find((p) => p.id === proposalId);
          if (!proposal) return;
          proposal.status = status;
          proposal.owner_response = response ?? proposal.owner_response ?? null;
          proposal.responded_by = actor;
          proposal.responded_at = new Date().toISOString();
          const verb = status === "Approved" ? "approved" : status === "Declined" ? "declined" : "asked a question on";
          logActivity(data, actor, proposal.property_id, "proposal", proposal.id, `${nameOf(data, actor)} ${verb} “${proposal.title}”`);
        }),

      addFile: (input) =>
        patch((data, actor) => {
          const file = {
            id: uid("f"),
            property_id: input.property_id,
            name: input.name,
            category: input.category,
            file_url: "https://example.com/files/" + encodeURIComponent(input.name),
            size_bytes: input.size_bytes ?? 256000,
            uploaded_by: actor,
            uploaded_at: new Date().toISOString(),
          };
          data.files.unshift(file);
          logActivity(data, actor, file.property_id, "file", file.id, `${nameOf(data, actor)} uploaded “${file.name}”`);
        }),

      addInvoice: (input) =>
        patch((data, actor) => {
          const invoice: Invoice = {
            id: uid("i"),
            property_id: input.property_id,
            title: input.title,
            amount: input.amount,
            due_date: input.due_date,
            status: "Unpaid",
            issued_at: TODAY,
          };
          data.invoices.unshift(invoice);
          logActivity(data, actor, invoice.property_id, "invoice", invoice.id, `${nameOf(data, actor)} issued invoice “${invoice.title}”`);
        }),

      addEvent: (input) =>
        patch((data, actor) => {
          const event: CalendarEvent = {
            id: uid("e"),
            property_id: input.property_id,
            title: input.title,
            type: input.type,
            start_date: input.start_date,
            end_date: input.end_date,
            notes: input.notes,
            source: "manual",
            external_id: null,
          };
          data.calendar_events.unshift(event);
          logActivity(data, actor, event.property_id, "event", event.id, `${nameOf(data, actor)} added “${event.title}” to the calendar`);
        }),

      sendMessage: (propertyId, body) =>
        patch((data, actor) => {
          const profile = data.profiles.find((p) => p.id === actor);
          if (!profile) return;
          const message: Message = {
            id: uid("m"),
            property_id: propertyId,
            sender_id: actor,
            sender_role: profile.role,
            body,
            created_at: new Date().toISOString(),
          };
          data.messages.push(message);
          logActivity(data, actor, propertyId, "message", message.id, `${profile.full_name} sent a message`);
        }),

      addPropertyPhoto: (input) =>
        patch((data, actor) => {
          const photo: PropertyPhoto = {
            id: uid("ph"),
            property_id: input.property_id,
            url: input.url,
            caption: input.caption,
            taken_at: new Date().toISOString().slice(0, 10),
            uploaded_by: actor,
          };
          data.property_photos.unshift(photo);
        }),

      removePropertyPhoto: (photoId) =>
        patch((data) => {
          data.property_photos = data.property_photos.filter((p) => p.id !== photoId);
        }),

      updateNotes: (propertyId, notes) =>
        patch((data) => {
          const property = data.properties.find((p) => p.id === propertyId);
          if (property) property.notes = notes;
        }),

      updateProfile: (patchInput) =>
        patch((data, actor) => {
          const profile = data.profiles.find((p) => p.id === actor);
          if (profile) Object.assign(profile, patchInput);
        }),

      updatePrefs: (patchInput) =>
        patch((data, actor) => {
          let prefs = data.notification_preferences.find((p) => p.user_id === actor);
          if (!prefs) {
            prefs = { user_id: actor, email_enabled: true, sms_enabled: false, weekly_summary: true, proposal_alerts: true };
            data.notification_preferences.push(prefs);
          }
          Object.assign(prefs, patchInput);
        }),

      resetDemo: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
        const seed = buildSeed();
        const sb = getSupabase();
        if (sb) void saveRemoteData(sb, seed);
        dispatch({ type: "HYDRATE", payload: { data: seed, currentUserId: state.currentUserId, hydrated: true } });
      },
    };
  }, [state.data, state.hydrated, currentUser, state.currentUserId]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { TODAY };
