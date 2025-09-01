
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SetupAdminRolePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSetup = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to perform this action.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Instead of calling a function, we write to a specific doc.
      // Firestore rules will secure this operation.
      const roleRequestRef = doc(db, 'admin_role_requests', user.uid);
      await setDoc(roleRequestRef, { email: user.email, uid: user.uid, requestedAt: new Date() });

      toast({
        title: "Request Sent!",
        description: "Your request to become Super Admin has been recorded. Please contact support to have the role manually assigned.",
      });
      
      // For now, we guide the user to a manual step, as the final claim assignment
      // requires a backend process which is currently blocked.
      // This change at least removes the 'internal' error.

    } catch (error: any) {
      console.error("Error sending role request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while sending your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline">Super Admin Setup</CardTitle>
          <CardDescription>
            Click the button below to request Super Admin privileges for your account ({user?.email}).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important Next Step</AlertTitle>
            <AlertDescription>
              Due to persistent backend issues, clicking the button will log your request. An administrator must then manually assign the 'superadmin' custom claim to your user in the Firebase console to finalize the process.
            </AlertDescription>
          </Alert>
          <Button onClick={handleSetup} disabled={isLoading || !user} className="w-full mt-4">
            {isLoading ? 'Processing...' : 'Request Super Admin Role'}
          </Button>
        </CardContent>
      </Card>
  );
}
