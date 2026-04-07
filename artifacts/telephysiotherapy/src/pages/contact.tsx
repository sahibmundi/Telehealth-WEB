import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateEnquiry } from "@workspace/api-client-react";
import { CheckCircle2, Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    type: "general" as "general" | "online_session" | "appointment"
  });

  const createEnquiry = useCreateEnquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    createEnquiry.mutate(
      {
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim(),
          type: form.type,
        }
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast({ title: "Message sent", description: "We will be in touch within 24 hours." });
        },
        onError: () => {
          toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have a question? We'd love to hear from you. Send us a message and we will respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Get in touch</h2>
              <div className="space-y-6 mb-12">
                {[
                  {
                    icon: <Phone className="w-5 h-5 text-primary" />,
                    label: "Phone",
                    value: "+1 (555) 123-4567"
                  },
                  {
                    icon: <Mail className="w-5 h-5 text-primary" />,
                    label: "Email",
                    value: "hello@telephysio.com"
                  },
                  {
                    icon: <MapPin className="w-5 h-5 text-primary" />,
                    label: "Address",
                    value: "123 Health Ave, Suite 400\nMedical District, MD 10001"
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-primary" />,
                    label: "Hours",
                    value: "Mon–Fri: 8am–7pm\nSat: 9am–4pm"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">{item.label}</p>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-card-border rounded-3xl p-10">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent</h3>
                  <p className="text-muted-foreground">
                    Thank you, {form.name}. We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name" className="mb-2 block text-sm font-medium">Full Name</Label>
                      <Input
                        id="contact-name"
                        data-testid="input-contact-name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone" className="mb-2 block text-sm font-medium">Phone (optional)</Label>
                      <Input
                        id="contact-phone"
                        data-testid="input-contact-phone"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-email" className="mb-2 block text-sm font-medium">Email Address</Label>
                    <Input
                      id="contact-email"
                      data-testid="input-contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-type" className="mb-2 block text-sm font-medium">Enquiry Type</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm(f => ({ ...f, type: v as typeof form.type }))}
                    >
                      <SelectTrigger id="contact-type" data-testid="select-contact-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Enquiry</SelectItem>
                        <SelectItem value="online_session">Online Session Enquiry</SelectItem>
                        <SelectItem value="appointment">Book Appointment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contact-message" className="mb-2 block text-sm font-medium">Message</Label>
                    <Textarea
                      id="contact-message"
                      data-testid="textarea-contact-message"
                      placeholder="Tell us about your condition or question..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={createEnquiry.isPending}
                    data-testid="button-contact-submit"
                  >
                    {createEnquiry.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
