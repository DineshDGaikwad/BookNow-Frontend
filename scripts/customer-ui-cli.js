#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class CustomerUICLI {
  constructor() {
    this.templatePath = '/Users/dineshgaikwad/Desktop/Boooknow/CustomerUI';
    this.outputBasePath = '/Users/dineshgaikwad/Desktop/Boooknow/customer-instances';
  }

  async createCustomerUI(customerId, customerName, options = {}) {
    const customerFolderPath = path.join(this.outputBasePath, `customer-${customerId}`);
    
    try {
      console.log(`Creating customer UI for ${customerName}...`);
      
      await fs.mkdir(this.outputBasePath, { recursive: true });
      await this.copyDirectory(this.templatePath, customerFolderPath);
      await this.customizeUI(customerFolderPath, { customerId, customerName, ...options });
      
      if (options.install) {
        console.log('Installing dependencies...');
        process.chdir(customerFolderPath);
        execSync('npm install', { stdio: 'inherit' });
      }
      
      console.log(`✅ Customer UI created at: ${customerFolderPath}`);
      return customerFolderPath;
    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }

  async removeCustomerUI(customerId) {
    const customerFolderPath = path.join(this.outputBasePath, `customer-${customerId}`);
    
    try {
      await fs.rm(customerFolderPath, { recursive: true, force: true });
      console.log(`✅ Removed customer UI: ${customerId}`);
    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }

  async listCustomerUIs() {
    try {
      const entries = await fs.readdir(this.outputBasePath, { withFileTypes: true });
      const customers = entries
        .filter(entry => entry.isDirectory() && entry.name.startsWith('customer-'))
        .map(entry => entry.name.replace('customer-', ''));
      
      if (customers.length === 0) {
        console.log('No customer UIs found.');
        return [];
      }
      
      console.log('📋 Customer UIs:');
      customers.forEach((id, index) => {
        console.log(`  ${index + 1}. ${id}`);
      });
      
      return customers;
    } catch (error) {
      console.log('No customer UIs found.');
      return [];
    }
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async customizeUI(customerPath, config) {
    const packageJsonPath = path.join(customerPath, 'package.json');
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      packageJson.name = `customer-ui-${config.customerId}`;
      packageJson.description = `Custom UI for ${config.customerName}`;
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.warn('Could not update package.json');
    }

    const configPath = path.join(customerPath, 'src', 'config', 'customer.json');
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }
}

async function main() {
  const cli = new CustomerUICLI();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node customer-ui-cli.js <create|remove|list> [args]');
    return;
  }

  const command = args[0];
  
  try {
    switch (command) {
      case 'create':
        if (args.length < 3) {
          console.error('Usage: create <customerId> <customerName>');
          return;
        }
        const options = { install: args.includes('--install') };
        await cli.createCustomerUI(args[1], args[2], options);
        break;
        
      case 'remove':
        if (args.length < 2) {
          console.error('Usage: remove <customerId>');
          return;
        }
        await cli.removeCustomerUI(args[1]);
        break;
        
      case 'list':
        await cli.listCustomerUIs();
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CustomerUICLI;