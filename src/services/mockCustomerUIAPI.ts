// Mock API for development - replace with actual backend calls
export class MockCustomerUIAPI {
  private customers: Set<string> = new Set();

  async createCustomerUI(config: any): Promise<{ path: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.customers.add(config.customerId);
    
    return {
      path: `/customer-instances/customer-${config.customerId}`
    };
  }

  async removeCustomerUI(customerId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.customers.delete(customerId);
  }

  async listCustomerUIs(): Promise<{ customers: string[] }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      customers: Array.from(this.customers)
    };
  }
}

export const mockCustomerUIAPI = new MockCustomerUIAPI();