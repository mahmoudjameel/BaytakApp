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

export const TeamsService = {
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
