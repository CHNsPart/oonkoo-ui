import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/pricing-cards";

export const metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for OonkooUI",
};

const comparisonFeatures = [
  { name: "Free components", free: true, pro: true },
  { name: "CLI installation", free: true, pro: true },
  { name: "Community support", free: true, pro: true },
  { name: "MIT License", free: true, pro: true },
  { name: "Premium components (30+)", free: false, pro: true },
  { name: "Priority support", free: false, pro: true },
  { name: "Early access to new components", free: false, pro: true },
  { name: "Advanced animations", free: false, pro: true },
  { name: "Dashboard templates", free: false, pro: true },
  { name: "Commercial license", free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with our free tier and upgrade when you need premium features.
            No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-20">
          <PricingCards />
        </div>

        {/* Feature Comparison */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Feature</th>
                  <th className="text-center p-4 font-medium">Free</th>
                  <th className="text-center p-4 font-medium">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={index !== comparisonFeatures.length - 1 ? "border-b" : ""}
                  >
                    <td className="p-4 text-sm">{feature.name}</td>
                    <td className="p-4 text-center">
                      {feature.free ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {feature.pro ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I use free components in commercial projects?"
              answer="Yes! All free components are available under the MIT license, which allows commercial use."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards through Stripe. We also support PayPal for annual subscriptions."
            />
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Absolutely. You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period."
            />
            <FAQItem
              question="Do I get updates for Pro components?"
              answer="Yes, all Pro subscribers receive free updates and new components as they're released."
            />
            <FAQItem
              question="Is there a team/enterprise plan?"
              answer="We're working on team plans. Contact us at hello@oonkoo.com for enterprise inquiries."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="font-medium mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}
