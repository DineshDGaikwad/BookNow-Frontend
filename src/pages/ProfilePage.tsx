import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { RootState } from '../store'
import { toast } from 'react-toastify'
import { profileService } from '../services/profileService'

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    dateOfBirth: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        dateOfBirth: user.dateOfBirth || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    if (!user) return

    try {
      await profileService.updateProfile(user.userId, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        dateOfBirth: formData.dateOfBirth
      })

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    if (!user) return

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      dateOfBirth: user.dateOfBirth || ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Please log in to view your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left card */}
          <div className="lg:col-span-1">
            <Card className="card-elevated">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-2">
                  {user.role}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right card */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>

                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{user.name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </label>
                    <p>{user.email}</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>
                        {user.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString()
                          : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        User ID
                      </label>
                      <p className="font-mono text-sm">{user.userId}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Account Type
                      </label>
                      <p>{user.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
