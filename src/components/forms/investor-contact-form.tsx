"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvestorContactFormProps {
  compact?: boolean;
}

export function InvestorContactForm({ compact = false }: InvestorContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    investorType: "",
    budgetRange: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-8 text-center space-y-3">
          <CheckCircle className="h-12 w-12 text-success mx-auto" />
          <h3 className="text-lg font-serif font-bold text-foreground">Thank you!</h3>
          <p className="text-sm text-muted-foreground">
            We&apos;ll be in touch within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="font-serif font-bold text-primary">
          Start Your Investment Journey
        </CardTitle>
        <CardDescription>
          Get personalized guidance from our South Florida investment specialists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="fullName"
              type="text"
              required
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Investor Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Investor Type <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.investorType}
              onValueChange={(value) => handleChange("investorType", value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select investor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Individual Investor">Individual Investor</SelectItem>
                  <SelectItem value="Canadian E2 Visa Seeker">Canadian E2 Visa Seeker</SelectItem>
                  <SelectItem value="International Investor">International Investor</SelectItem>
                  <SelectItem value="Business Relocation">Business Relocation</SelectItem>
                  <SelectItem value="Property Management">Property Management</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Budget Range <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.budgetRange}
              onValueChange={(value) => handleChange("budgetRange", value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Under $200K">Under $200K</SelectItem>
                  <SelectItem value="$200K - $500K">$200K - $500K</SelectItem>
                  <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                  <SelectItem value="$1M+">$1M+</SelectItem>
                  <SelectItem value="Not Sure Yet">Not Sure Yet</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Message - hidden in compact mode */}
          {!compact && (
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Tell us about your investment goals..."
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 resize-none"
              />
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Get Investment Guidance"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
