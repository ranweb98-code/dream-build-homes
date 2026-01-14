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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Phone, Mail, MapPin, Loader2, CheckCircle } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().max(255),
  message: z.string().min(10).max(1000),
  preferredContact: z.enum(['phone', 'email', 'either']),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const propertyId = searchParams.get('propertyId');
  const propertyTitle = searchParams.get('propertyTitle');

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: propertyTitle ? `I'm interested in "${propertyTitle}" (ID: ${propertyId}).` : '',
      preferredContact: 'either',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('inquiries')
      .insert({
        property_id: propertyId,
        property_title: propertyTitle,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        preferred_contact: data.preferredContact,
      });

    setIsSubmitting(false);

    if (error) {
      console.error('Failed to submit inquiry:', error);
      toast.error('Failed to send message. Please try again.');
      return;
    }

    setIsSuccess(true);
    reset();
    toast.success('Message sent successfully!');
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
                  <div className="flex items-start gap-4"><Phone className="h-5 w-5 text-primary mt-1" /><div><p className="font-medium">Phone</p><p className="text-muted-foreground">+1 (555) 123-4567</p></div></div>
                  <div className="flex items-start gap-4"><Mail className="h-5 w-5 text-primary mt-1" /><div><p className="font-medium">Email</p><p className="text-muted-foreground">info@prestigeestates.com</p></div></div>
                  <div className="flex items-start gap-4"><MapPin className="h-5 w-5 text-primary mt-1" /><div><p className="font-medium">Office</p><p className="text-muted-foreground">123 Luxury Lane, Beverly Hills, CA 90210</p></div></div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border animate-fade-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {isSuccess ? (
                <div className="text-center py-12"><CheckCircle className="h-16 w-16 text-success mx-auto mb-4" /><h3 className="text-xl font-semibold">Message Sent!</h3><p className="text-muted-foreground">We'll get back to you soon.</p></div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div><Label>Full Name *</Label><Input {...register('fullName')} className={errors.fullName ? 'border-destructive' : ''} /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Phone *</Label><Input type="tel" {...register('phone')} /></div>
                    <div><Label>Email *</Label><Input type="email" {...register('email')} /></div>
                  </div>
                  <div><Label>Message *</Label><Textarea rows={4} {...register('message')} /></div>
                  <div>
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup value={watch('preferredContact')} onValueChange={(v) => setValue('preferredContact', v as 'phone' | 'email' | 'either')} className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2"><RadioGroupItem value="phone" id="p" /><Label htmlFor="p">Phone</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="email" id="e" /><Label htmlFor="e">Email</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="either" id="ei" /><Label htmlFor="ei">Either</Label></div>
                    </RadioGroup>
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
