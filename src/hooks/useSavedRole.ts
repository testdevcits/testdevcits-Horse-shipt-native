import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'customer' | 'shipper' | 'driver' | null;

const ROLE_KEY = '@user_role';

export const useSavedRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  // 1. Fetch Role from storage
  const getSavedRole = useCallback(async (): Promise<UserRole> => {
    try {
      const storedRole = await AsyncStorage.getItem(ROLE_KEY);
      
      // Sanitize: Handle actual null, undefined, or the string "null"
      if (!storedRole || storedRole === "null" || storedRole === "") {
        return null;
      }
      
      return storedRole as UserRole;
    } catch (error) {
      console.error("Error reading role from storage", error);
      return null;
    }
  }, []);

  // 2. Save Role to storage
  const saveRole = async (newRole: UserRole) => {
    try {
      if (newRole) {
        await AsyncStorage.setItem(ROLE_KEY, newRole);
      } else {
        await AsyncStorage.removeItem(ROLE_KEY);
      }
      setRole(newRole);
    } catch (error) {
      console.error("Error saving role", error);
    }
  };

  // 3. Clear Role (for Logout/Reset)
  const clearRole = async () => {
    await saveRole(null);
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      const stored = await getSavedRole();
      setRole(stored);
      setIsLoadingRole(false);
    };
    init();
  }, [getSavedRole]);

  return { role, saveRole, clearRole, isLoadingRole, refreshRole: getSavedRole };
};