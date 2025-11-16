import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, Briefcase, Building2, MapPin, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  phone: z.string().optional(),
  role: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, updateUserProfile } = useUser();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      role: user.role,
      department: user.department,
      bio: user.bio,
      location: user.location,
    },
  });

  const department = watch('department');

  const onSubmit = (data: ProfileFormData) => {
    updateUserProfile(data);
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved successfully',
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleAvatarChange = (avatarUrl: string) => {
    updateUserProfile({ avatar: avatarUrl });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
              {/* Profile Picture Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload
                    currentAvatar={user.avatar}
                    userName={user.name}
                    onAvatarChange={handleAvatarChange}
                  />
                </CardContent>
              </Card>

              {/* Profile Information Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          <User className="inline h-4 w-4 mr-1" />
                          Full Name *
                        </Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="inline h-4 w-4 mr-1" />
                          Email Address
                        </Label>
                        <Input id="email" value={user.email} disabled className="bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="inline h-4 w-4 mr-1" />
                          Phone Number
                        </Label>
                        <Input id="phone" type="tel" {...register('phone')} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">
                          <Briefcase className="inline h-4 w-4 mr-1" />
                          Role/Position
                        </Label>
                        <Input id="role" {...register('role')} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">
                          <Building2 className="inline h-4 w-4 mr-1" />
                          Department *
                        </Label>
                        <Select value={department} onValueChange={(value) => setValue('department', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Warehouse">Warehouse</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.department && (
                          <p className="text-sm text-destructive">{errors.department.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          Location
                        </Label>
                        <Input id="location" {...register('location')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio/Description</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        placeholder="Tell us about yourself..."
                        {...register('bio')}
                      />
                      {errors.bio && (
                        <p className="text-sm text-destructive">{errors.bio.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {watch('bio')?.length || 0}/200 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Date Joined
                      </Label>
                      <Input value={formatDate(user.dateJoined)} disabled className="bg-muted" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button type="submit" disabled={!isDirty}>
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="sm:ml-auto"
                      >
                        Change Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
    </div>
  );
};

export default Profile;
