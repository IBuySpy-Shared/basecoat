import { create } from 'zustand';
import type { Agent, Scan } from '../types';

interface AppState {
  agents: Agent[];
  scans: Scan[];
  loading: boolean;
  error: string | null;
  setAgents: (agents: Agent[]) => void;
  setScans: (scans: Scan[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useStore = create<AppState>((set) => ({
  agents: [],
  scans: [],
  loading: false,
  error: null,
  setAgents: (agents) => set({ agents }),
  setScans: (scans) => set({ scans }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useStore;
