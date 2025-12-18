import { mockCustomerUIAPI } from './mockCustomerUIAPI';

export interface CustomerUIConfig {
  customerId: string;
  customerName: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    brandLogo?: string;
  };
  features?: string[];
}

export class CustomerUIManager {
  async createCustomerUI(config: CustomerUIConfig): Promise<string> {
    try {
      const result = await mockCustomerUIAPI.createCustomerUI(config);
      console.log(`Customer UI created for ${config.customerName}`);
      return result.path;
    } catch (error) {
      console.error('Error creating customer UI:', error);
      throw error;
    }
  }

  async removeCustomerUI(customerId: string): Promise<void> {
    try {
      await mockCustomerUIAPI.removeCustomerUI(customerId);
      console.log(`Customer UI removed for customer: ${customerId}`);
    } catch (error) {
      console.error('Error removing customer UI:', error);
      throw error;
    }
  }

  async listCustomerUIs(): Promise<string[]> {
    try {
      const result = await mockCustomerUIAPI.listCustomerUIs();
      return result.customers || [];
    } catch (error) {
      return [];
    }
  }
}

export const customerUIManager = new CustomerUIManager();