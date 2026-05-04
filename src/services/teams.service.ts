import { apiRequest } from './api';

export type Team = {
  id: number;
  name: string;
  isActive?: boolean;
  categories?: { id: number; name: string }[];
  members?: TeamMember[];
};

export type TeamMember = {
  id: number;
  fullName: string;
  email: string;
  isActive?: boolean;
  permissions?: string[];
};

function normalizeTeam(raw: unknown): Team {
  if (!raw || typeof raw !== 'object') return { id: 0, name: '' };
  const o = raw as Record<string, unknown>;
  return {
    id: Number(o.id ?? 0),
    name: String(o.name ?? o.teamName ?? ''),
    isActive: o.isActive !== false,
    members: Array.isArray(o.members) ? o.members as TeamMember[] : undefined,
  };
}

function normalizeList(json: unknown): Team[] {
  if (Array.isArray(json)) return json.map(normalizeTeam);
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    const list =
      Array.isArray(o.data) ? o.data :
      Array.isArray(o.items) ? o.items :
      Array.isArray(o.teams) ? o.teams : null;
    if (list) return list.map(normalizeTeam);
  }
  return [];
}

export const TeamsService = {
  async getAll(): Promise<Team[]> {
    const json = await apiRequest<unknown>('/teams');
    return normalizeList(json);
  },

  async getMembers(teamId: number): Promise<TeamMember[]> {
    const json = await apiRequest<unknown>(`/teams/${teamId}/members`);
    if (Array.isArray(json)) return json as TeamMember[];
    if (json && typeof json === 'object') {
      const o = json as Record<string, unknown>;
      const list = Array.isArray(o.data) ? o.data : Array.isArray(o.items) ? o.items : null;
      if (list) return list as TeamMember[];
    }
    return [];
  },

  async create(payload: { name: string; categoryIds: number[] }): Promise<Team> {
    return apiRequest('/teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: number, payload: { name?: string; categoryIds?: number[]; isActive?: boolean }): Promise<Team> {
    return apiRequest(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async addMember(teamId: number, payload: {
    fullName: string;
    email: string;
    password: string;
    permissions?: string[];
  }): Promise<TeamMember> {
    return apiRequest(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateMember(teamId: number, memberId: number, payload: {
    fullName?: string;
    permissions?: string[];
    isActive?: boolean;
  }): Promise<TeamMember> {
    return apiRequest(`/teams/${teamId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async removeMember(teamId: number, memberId: number): Promise<void> {
    return apiRequest(`/teams/${teamId}/members/${memberId}`, { method: 'DELETE' });
  },

  async resetMemberPassword(teamId: number, memberId: number, password: string): Promise<void> {
    return apiRequest(`/teams/${teamId}/members/${memberId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },
};
