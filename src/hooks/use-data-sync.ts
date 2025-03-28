
import { useState, useEffect, useCallback } from 'react';
import { getLastModified, refreshData } from '@/lib/data';

/**
 * A hook that forces a component to re-render when data changes
 * by listening to the dataUpdate event and checking for updates very frequently.
 * It ensures near real-time synchronization across different users and browsers.
 */
export const useDataSync = () => {
  const [lastUpdate, setLastUpdate] = useState(getLastModified());
  
  // Function to check for updates
  const checkForUpdates = useCallback(() => {
    // Always force refresh data to ensure we have the latest from "server"
    refreshData();
    
    const currentLastModified = getLastModified();
    
    // Update timestamp if needed
    if (currentLastModified !== lastUpdate) {
      setLastUpdate(currentLastModified);
    }
  }, [lastUpdate]);
  
  useEffect(() => {
    // Update when the dataUpdate event is triggered
    const handleDataUpdate = () => {
      refreshData(); // Always refresh data when event is triggered
      setLastUpdate(getLastModified());
    };
    
    // Listen for dataUpdate events (from this tab)
    window.addEventListener('dataUpdate', handleDataUpdate);
    
    // Check for updates very frequently (200ms) to better simulate real-time
    const intervalId = setInterval(checkForUpdates, 200);
    
    // Check immediately on mount
    checkForUpdates();
    
    // Listen for storage events from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('slay-donghua-')) {
        refreshData();
        setLastUpdate(Date.now()); // Force update
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('dataUpdate', handleDataUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [checkForUpdates]);
  
  return lastUpdate;
};
