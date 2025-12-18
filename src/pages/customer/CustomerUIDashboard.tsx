import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Settings, Users, Folder } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { customerUIManager, CustomerUIConfig } from '../../services/customerUIManager';

interface CustomerInstance {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}

const CustomerUIDashboard: React.FC = () => {
  const [customerInstances, setCustomerInstances] = useState<CustomerInstance[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerId: '',
    customerName: '',
    primaryColor: '#3b82f6',
    features: [] as string[]
  });

  useEffect(() => {
    loadCustomerInstances();
  }, []);

  const loadCustomerInstances = async () => {
    try {
      const customerIds = await customerUIManager.listCustomerUIs();
      const instances: CustomerInstance[] = customerIds.map(id => ({
        id,
        name: `Customer ${id}`,
        path: `/customer-instances/customer-${id}`,
        createdAt: new Date(),
        status: 'active' as const
      }));
      setCustomerInstances(instances);
    } catch (error) {
      console.error('Error loading customer instances:', error);
    }
  };

  const handleCreateCustomerUI = async () => {
    if (!newCustomer.customerId || !newCustomer.customerName) return;

    setIsCreating(true);
    try {
      const config: CustomerUIConfig = {
        customerId: newCustomer.customerId,
        customerName: newCustomer.customerName,
        theme: {
          primaryColor: newCustomer.primaryColor
        },
        features: newCustomer.features
      };

      await customerUIManager.createCustomerUI(config);
      await loadCustomerInstances();
      
      setShowCreateForm(false);
      setNewCustomer({
        customerId: '',
        customerName: '',
        primaryColor: '#3b82f6',
        features: []
      });
    } catch (error) {
      console.error('Error creating customer UI:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveCustomerUI = async (customerId: string) => {
    if (!window.confirm(`Are you sure you want to remove customer UI for ${customerId}?`)) return;

    try {
      await customerUIManager.removeCustomerUI(customerId);
      await loadCustomerInstances();
    } catch (error) {
      console.error('Error removing customer UI:', error);
    }
  };

  const availableFeatures = [
    'booking-system',
    'event-management',
    'payment-gateway',
    'notifications',
    'reviews',
    'analytics'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer UI Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage dynamic customer UI instances</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Customer UI
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Instances</p>
                  <p className="text-2xl font-bold">{customerInstances.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Folder className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold">
                    {customerInstances.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Template Based</p>
                  <p className="text-2xl font-bold">CustomerUI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Create New Customer UI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer ID</label>
                  <input
                    type="text"
                    value={newCustomer.customerId}
                    onChange={(e) => setNewCustomer({...newCustomer, customerId: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., customer-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newCustomer.customerName}
                    onChange={(e) => setNewCustomer({...newCustomer, customerName: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={newCustomer.primaryColor}
                    onChange={(e) => setNewCustomer({...newCustomer, primaryColor: e.target.value})}
                    className="w-full p-2 border rounded-lg h-10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFeatures.map(feature => (
                      <label key={feature} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newCustomer.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCustomer({
                                ...newCustomer,
                                features: [...newCustomer.features, feature]
                              });
                            } else {
                              setNewCustomer({
                                ...newCustomer,
                                features: newCustomer.features.filter(f => f !== feature)
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateCustomerUI}
                    disabled={isCreating || !newCustomer.customerId || !newCustomer.customerName}
                    className="flex-1"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer Instances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerInstances.map((instance) => (
            <Card key={instance.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{instance.name}</CardTitle>
                  <Badge variant={instance.status === 'active' ? 'default' : 'secondary'}>
                    {instance.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">ID: {instance.id}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p>Path: {instance.path}</p>
                    <p>Created: {instance.createdAt.toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Config
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRemoveCustomerUI(instance.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {customerInstances.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer UIs</h3>
            <p className="text-gray-600 mb-4">Create your first customer UI instance to get started</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Customer UI
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerUIDashboard;