import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Property } from '@/types/property';
import { Loader2, CheckCircle } from 'lucide-react';

const contactSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface InquiryModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryModal({ property, isOpen, onClose }: InquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: property
        ? `I am interested in the property: "${property.title}" (ID: ${property.id}). Please contact me with more information.`
        : '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: responseData, error } = await supabase.functions.invoke('submit-inquiry', {
        body: {
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          propertyId: property?.id,
          propertyTitle: property?.title,
        },
      });

      setIsSubmitting(false);

      if (error) {
        console.error('Failed to submit inquiry:', error);
        toast.error('Failed to send inquiry. Please try again.');
        return;
      }
      
      // Check for rate limit error
      if (responseData?.error) {
        if (responseData.error.includes('Too many requests')) {
          toast.error('Too many requests. Please try again later.');
        } else {
          toast.error(responseData.error);
        }
        return;
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Failed to submit inquiry:', err);
      toast.error('Failed to send inquiry. Please try again.');
      return;
    }

    setIsSuccess(true);
    
    setTimeout(() => {
      toast.success('Inquiry sent successfully! We will contact you soon.');
      reset();
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {isSuccess ? (
          <div className="py-12 text-center animate-scale-in">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inquiry Sent!</h3>
            <p className="text-muted-foreground">
              Thanks! Your inquiry was sent successfully. We will get back to you by email shortly.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Inquire About This Property</DialogTitle>
              <DialogDescription>
                {property
                  ? `Interested in "${property.title}"? Fill out the form below.`
                  : 'Fill out the form to get in touch with us.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  {...register('fullName')}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your interest in this property..."
                  rows={4}
                  {...register('message')}
                  className={errors.message ? 'border-destructive' : ''}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
