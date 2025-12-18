import { useState, useEffect, useCallback } from 'react';
import { customerUIManager, CustomerUIConfig } from '../services/customerUIManager';

interface CustomerUIInstance {
  id: string;
  name: string;
  path: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export const useCustomerUI = () => {
  const [instances, setInstances] = useState<CustomerUIInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const customerIds = await customerUIManager.listCustomerUIs();
      const instanceList: CustomerUIInstance[] = customerIds.map(id => ({
        id,
        name: `Customer ${id}`,
        path: `/customer-instances/customer-${id}`,
        status: 'active' as const,
        createdAt: new Date()
      }));
      
      setInstances(instanceList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load instances');
    } finally {
      setLoading(false);
    }
  }, []);

  const createInstance = useCallback(async (config: CustomerUIConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      await customerUIManager.createCustomerUI(config);
      await loadInstances();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create instance');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadInstances]);

  const removeInstance = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await customerUIManager.removeCustomerUI(customerId);
      await loadInstances();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove instance');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadInstances]);

  useEffect(() => {
    loadInstances();
  }, [loadInstances]);

  return {
    instances,
    loading,
    error,
    createInstance,
    removeInstance,
    refreshInstances: loadInstances
  };
};