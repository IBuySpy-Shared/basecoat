import { create } from 'zustand';
import type { Agent, Scan, User, Repository } from '../types';

interface AppState {
  user: User | null;
  agents: Agent[];
  scans: Scan[];
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setAgents: (agents: Agent[]) => void;
  setScans: (scans: Scan[]) => void;
  setRepositories: (repos: Repository[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useStore = create<AppState>((set) => ({
  user: null,
  agents: [],
  scans: [],
  repositories: [],
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setAgents: (agents) => set({ agents }),
  setScans: (scans) => set({ scans }),
  setRepositories: (repos) => set({ repositories: repos }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useStore;
