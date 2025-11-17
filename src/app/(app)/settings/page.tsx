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
import { Cloud, Smartphone, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
          <CardTitle>AI &amp; Data</CardTitle>
          <CardDescription>
            Manage how your data is processed and control AI features.
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
          <CardTitle>Language &amp; Region</CardTitle>
          <CardDescription>
            Enable cross-lingual transaction categorization and cultural context awareness.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="language-select">Language</Label>
                <Select defaultValue="en">
                    <SelectTrigger id="language-select">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="es">Español (Spanish)</SelectItem>
                        <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                        <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">The AI will interpret transaction details in your chosen language.</p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Auto-Detect Language</Label>
                    <p className="text-sm text-muted-foreground">
                        Detect and handle transactions with code-switching (e.g., Hindi + English).
                    </p>
                </div>
                <Switch defaultChecked />
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
