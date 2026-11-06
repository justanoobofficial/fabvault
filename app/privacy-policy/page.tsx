import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalShell, type LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy | The Fab Vault",
  description:
    "How The Fab Vault collects, uses and protects the information you share when you buy from the archive.",
};

const sections: LegalSection[] = [
  {
    heading: "What we collect",
    paragraphs: [
      "We only ask for what is needed to sell and deliver a garment. That means a name, an email address, a delivery address and a phone number when you check out.",
      "Payment card details are never seen or stored by us. Transactions run through Paystack, which handles card data under its own security controls.",
    ],
    list: [
      "Contact details supplied at checkout",
      "Order contents, sizes and amounts",
      "Delivery notes you send us on WhatsApp or email",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "Order information is used to confirm your purchase, arrange delivery and handle exchanges. Email addresses are used for receipts and, if you opt in, a short release note when the vault restocks.",
      "We do not sell, rent or trade personal information. We do not build advertising profiles from your data.",
    ],
  },
  {
    heading: "Payments",
    paragraphs: [
      "Card payments are processed by Paystack. When you pay, Paystack receives the amount, your email and a reference for the order. Their privacy policy governs how that payment data is held.",
      "Orders placed over WhatsApp are settled by transfer or on delivery. We keep a record of the payment reference so both sides can trace it.",
    ],
  },
  {
    heading: "Storage and retention",
    paragraphs: [
      "Order records are stored in Google Firebase Firestore. Access is limited to the studio operator and protected by authentication rules.",
      "We keep order records for as long as needed for accounting and dispute resolution. You can ask us to delete your details once an order has been completed and any return window has closed.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "The storefront uses local storage to remember what is in your bag between visits. No third party advertising cookies are set by this site.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask to see the information we hold about you, correct it, or have it removed. Send the request from the email address you used to order and we will respond within a reasonable time.",
      "If you believe your data has been mishandled, contact us first. We will investigate and correct the record where needed.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "The Fab Vault operates from Lagos, Nigeria. Privacy enquiries go to support.fabuyodevs@gmail.com or the WhatsApp line published in the footer.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <LegalShell
        index="Document 01 / Privacy"
        title="Privacy Policy"
        intro="A plain account of the information this store collects, why it is collected, and how you can have it removed."
        updated="November 2026"
        sections={sections}
      />
      <Footer />
    </>
  );
}
