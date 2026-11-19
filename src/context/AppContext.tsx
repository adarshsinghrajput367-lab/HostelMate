import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { dataService } from '../services/storageService';
import { Listing, ShortlistItem } from '../types';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'warning';
}

interface AppContextValue {
  listings: Listing[];
  shortlist: ShortlistItem[];
  compareIds: string[];
  toasts: ToastMessage[];
  isShortlisted: (listingId: string) => boolean;
  toggleShortlist: (listingId: string) => void;
  updateShortlistNote: (listingId: string, note: string) => void;
  isCompared: (listingId: string) => boolean;
  toggleCompare: (listingId: string) => void;
  removeCompare: (listingId: string) => void;
  clearCompare: () => void;
  setCompareIdsDirect: (ids: string[]) => void;
  showToast: (message: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: string) => void;
  resetAllLocalData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [listings] = useState<Listing[]>(() => dataService.getListings());
  const [shortlist, setShortlist] = useState<ShortlistItem[]>(() =>
    dataService.getShortlist(uid)
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    dataService.getCompareIds(uid)
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Switch & merge shortlist/compare cleanly when Google auth user changes
  useEffect(() => {
    if (uid) {
      const userSaved = dataService.getShortlist(uid);
      const guestSaved = dataService.getShortlist(null);
      const mergedShortlist = [...userSaved];
      guestSaved.forEach((g) => {
        if (!mergedShortlist.some((u) => u.listingId === g.listingId)) {
          mergedShortlist.push(g);
        }
      });
      setShortlist(mergedShortlist);

      const userComp = dataService.getCompareIds(uid);
      const guestComp = dataService.getCompareIds(null);
      const mergedComp = Array.from(new Set([...userComp, ...guestComp])).slice(0, 3);
      setCompareIds(mergedComp);
    } else {
      setShortlist(dataService.getShortlist(null));
      setCompareIds(dataService.getCompareIds(null));
    }
  }, [uid]);

  useEffect(() => {
    dataService.saveShortlist(shortlist, uid);
  }, [shortlist, uid]);

  useEffect(() => {
    dataService.saveCompareIds(compareIds, uid);
  }, [compareIds, uid]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastMessage['tone'] = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const isShortlisted = useCallback(
    (listingId: string) => shortlist.some((item) => item.listingId === listingId),
    [shortlist]
  );

  const toggleShortlist = useCallback(
    (listingId: string) => {
      const listing = listings.find((l) => l.id === listingId);
      setShortlist((prev) => {
        const exists = prev.some((item) => item.listingId === listingId);
        if (exists) {
          showToast(
            listing ? `Removed "${listing.name}" from shortlist` : 'Removed from shortlist',
            'info'
          );
          return prev.filter((item) => item.listingId !== listingId);
        }
        showToast(
          listing ? `Saved "${listing.name}" to shortlist` : 'Added to shortlist',
          'success'
        );
        return [
          { listingId, note: '', addedAt: new Date().toISOString() },
          ...prev,
        ];
      });
    },
    [listings, showToast]
  );

  const updateShortlistNote = useCallback((listingId: string, note: string) => {
    setShortlist((prev) =>
      prev.map((item) =>
        item.listingId === listingId ? { ...item, note } : item
      )
    );
  }, []);

  const isCompared = useCallback(
    (listingId: string) => compareIds.includes(listingId),
    [compareIds]
  );

  const toggleCompare = useCallback(
    (listingId: string) => {
      const listing = listings.find((l) => l.id === listingId);
      setCompareIds((prev) => {
        if (prev.includes(listingId)) {
          showToast(
            listing ? `Removed "${listing.name}" from comparison` : 'Removed from comparison',
            'info'
          );
          return prev.filter((id) => id !== listingId);
        }
        if (prev.length >= 3) {
          showToast('You can compare up to 3 listings side by side.', 'warning');
          return prev;
        }
        showToast(
          listing
            ? `Added "${listing.name}" to comparison (${prev.length + 1}/3)`
            : 'Added to comparison',
          'success'
        );
        return [...prev, listingId];
      });
    },
    [listings, showToast]
  );

  const removeCompare = useCallback((listingId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== listingId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const setCompareIdsDirect = useCallback(
    (ids: string[]) => {
      setCompareIds(ids.slice(0, 3));
    },
    []
  );

  const resetAllLocalData = useCallback(() => {
    dataService.clearAllLocalUserData();
    setShortlist([]);
    setCompareIds([]);
    showToast('All local HostelMate browser data has been cleared.', 'info');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        listings,
        shortlist,
        compareIds,
        toasts,
        isShortlisted,
        toggleShortlist,
        updateShortlistNote,
        isCompared,
        toggleCompare,
        removeCompare,
        clearCompare,
        setCompareIdsDirect,
        showToast,
        dismissToast,
        resetAllLocalData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
