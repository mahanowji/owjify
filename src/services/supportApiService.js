import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { SEED_SUPPORT_TICKETS } from '../data/supportTickets';

/**
 * OWJIFY Support & Operator REST API Client
 * ---------------------------------------------------------------------------
 * Designed for direct integration with backend REST endpoints:
 * - POST   {API_BASE}/operator/auth/login
 * - GET    {API_BASE}/support/tickets
 * - POST   {API_BASE}/support/tickets
 * - POST   {API_BASE}/operator/tickets/:id/reply
 * - PATCH  {API_BASE}/operator/tickets/:id/status
 *
 * When VITE_API_BASE_URL is configured, requests are dispatched via fetch()
 * with Bearer token authorization. In standalone frontend mode, operations
 * fall back cleanly to localStorage state so every workflow works out of the box.
 */

const API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : null;

function getLocalTickets() {
  const stored = readStorage(STORAGE_KEYS.SUPPORT_TICKETS, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    writeStorage(STORAGE_KEYS.SUPPORT_TICKETS, SEED_SUPPORT_TICKETS);
    return SEED_SUPPORT_TICKETS;
  }
  return stored;
}

function saveLocalTickets(list) {
  writeStorage(STORAGE_KEYS.SUPPORT_TICKETS, list);
  return list;
}

export const SUPPORT_API_ENDPOINTS = {
  mode: API_BASE ? 'LIVE_REST_API' : 'API_READY_SIMULATION',
  baseUrl: API_BASE || '/api',
  operatorLogin: `${API_BASE || '/api'}/operator/auth/login`,
  listTickets: `${API_BASE || '/api'}/support/tickets`,
  replyTicket: (id) => `${API_BASE || '/api'}/operator/tickets/${id}/reply`,
  updateStatus: (id) => `${API_BASE || '/api'}/operator/tickets/${id}/status`,
};

export const supportApiService = {
  getTicketsSync() {
    return getLocalTickets();
  },

  async fetchTickets(token = null) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/support/tickets`, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          saveLocalTickets(data);
          return data;
        }
      } catch {
        // Graceful fallback to local store if remote API is unreachable
      }
    }
    return getLocalTickets();
  },

  async submitTicket(payload, token = null) {
    const newId = `SUP-${Math.floor(1042 + Math.random() * 8900)}`;
    const now = new Date().toISOString();

    const newTicket = {
      id: newId,
      category: payload.category || 'general',
      priority: payload.priority || 'normal',
      status: 'open',
      reporterUserId: payload.reporterUserId || null,
      reporterRole: payload.reporterRole || 'guest',
      reporterName: payload.reporterName || 'کاربر اوجیفای',
      reporterEmail: payload.reporterEmail || '',
      relatedAdId: payload.relatedAdId || null,
      relatedAdTitle: payload.relatedAdTitle || null,
      subject:
        typeof payload.subject === 'string'
          ? { fa: payload.subject, en: payload.subject }
          : payload.subject,
      messages: [
        {
          id: `st_m_${Date.now()}`,
          authorRole: 'reporter',
          authorName: payload.reporterName || 'User',
          text:
            typeof payload.message === 'string'
              ? { fa: payload.message, en: payload.message }
              : payload.message,
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/support/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(newTicket),
        });
        if (res.ok) {
          const created = await res.json();
          const updated = [created, ...getLocalTickets()];
          saveLocalTickets(updated);
          return created;
        }
      } catch {
        // Fallback to local state
      }
    }

    const updated = [newTicket, ...getLocalTickets()];
    saveLocalTickets(updated);
    return newTicket;
  },

  async replyToTicket({ ticketId, replyText, authorName, authorRole = 'operator', nextStatus }, token = null) {
    const now = new Date().toISOString();
    const msg = {
      id: `st_m_${Date.now()}`,
      authorRole,
      authorName,
      text: { fa: replyText, en: replyText },
      createdAt: now,
    };

    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/operator/tickets/${ticketId}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ replyText, authorRole, nextStatus }),
        });
      } catch {
        // Fallback to local persistence
      }
    }

    const nextList = getLocalTickets().map((t) => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status:
          nextStatus ||
          (authorRole === 'operator' || authorRole === 'admin' ? 'answered' : 'open'),
        updatedAt: now,
        messages: [...(t.messages || []), msg],
      };
    });

    saveLocalTickets(nextList);
    return nextList;
  },

  async updateTicketStatus({ ticketId, status }, token = null) {
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/operator/tickets/${ticketId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status }),
        });
      } catch {
        // Fallback to local persistence
      }
    }

    const nextList = getLocalTickets().map((t) =>
      t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    saveLocalTickets(nextList);
    return nextList;
  },
};
