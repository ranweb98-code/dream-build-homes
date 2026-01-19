import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Loader2, CheckCircle } from 'lucide-react';

const schema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const propertyId = searchParams.get('propertyId');
  const propertyTitle = searchParams.get('propertyTitle');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      message: propertyTitle ? `I'm interested in "${propertyTitle}" (ID: ${propertyId}).` : '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: responseData, error } = await supabase.functions.invoke('submit-inquiry', {
        body: {
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          propertyId: propertyId,
          propertyTitle: propertyTitle,
        },
      });

      setIsSubmitting(false);

      if (error) {
        console.error('Failed to submit inquiry:', error);
        toast.error('Failed to send message. Please try again.');
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

      setIsSuccess(true);
      reset();
      toast.success('Message sent successfully!');
    } catch (err) {
      setIsSubmitting(false);
      console.error('Failed to submit inquiry:', err);
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h1 className="font-display text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Ready to find your dream property? Get in touch with our team.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8 animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4"><Mail className="h-5 w-5 text-primary mt-1" /><div><p className="font-medium">Email</p><p className="text-muted-foreground">info@prestigeestates.com</p></div></div>
                  <div className="flex items-start gap-4"><MapPin className="h-5 w-5 text-primary mt-1" /><div><p className="font-medium">Office</p><p className="text-muted-foreground">123 Luxury Lane, Beverly Hills, CA 90210</p></div></div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border animate-fade-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground">Thanks! Your inquiry was sent successfully. We will get back to you by email shortly.</p>
                </div>
              ) : (
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
                      rows={4} 
                      placeholder="Tell us about your interest..."
                      {...register('message')} 
                      className={errors.message ? 'border-destructive' : ''} 
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
