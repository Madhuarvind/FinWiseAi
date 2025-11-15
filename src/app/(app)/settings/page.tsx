'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Cloud, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();
  const [isCloudEnabled, setIsCloudEnabled] = React.useState(true);

  const handleSaveChanges = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been successfully saved.',
    });
  };

  const handleCloudToggle = (checked: boolean) => {
    setIsCloudEnabled(checked);
    toast({
        title: checked ? 'Cloud AI Enabled' : 'On-Device AI Active',
        description: checked 
            ? 'The full suite of advanced cloud AI features is now active.'
            : 'Using basic, privacy-first on-device categorization. Advanced features are disabled.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is your public display name and email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" defaultValue={user?.displayName || 'User'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage how your data is processed and control your privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                        {isCloudEnabled ? <Cloud className="text-primary"/> : <Smartphone />}
                        {isCloudEnabled ? 'Cloud-Powered AI Intelligence' : 'On-Device Shadow Categorizer'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        {isCloudEnabled 
                            ? 'Enables advanced insights, XAI, and predictive features. Your data is processed securely in the cloud.'
                            : 'Basic categorization runs locally on your device for maximum privacy. Advanced AI features are disabled.'
                        }
                    </p>
                </div>
                <Switch checked={isCloudEnabled} onCheckedChange={handleCloudToggle}/>
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive weekly summaries and important account alerts.
                    </p>
                </div>
                <Switch defaultChecked/>
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Get real-time alerts for flagged transactions on your mobile device.
                    </p>
                </div>
                <Switch />
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
