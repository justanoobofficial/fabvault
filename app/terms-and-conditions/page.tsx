import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalShell, type LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms and Conditions | The Fab Vault",
  description:
    "The terms that apply to purchases from The Fab Vault archive, including condition grading, delivery and returns.",
};

const sections: LegalSection[] = [
  {
    heading: "The nature of the goods",
    paragraphs: [
      "Every item sold here is a previously owned garment unless the listing states otherwise. Pieces are graded on condition before they are listed and any notable flaw is described in the product note.",
      "Small signs of wear are expected and are not treated as faults. Photographs are taken in natural light and colours may shift slightly between screens.",
    ],
  },
  {
    heading: "Availability",
    paragraphs: [
      "The vault holds single units. A listing is removed once a piece is paid for or reserved over WhatsApp.",
      "In the rare case of a simultaneous order on the same garment, the payment received first holds the piece. The second buyer is refunded in full within three working days.",
    ],
  },
  {
    heading: "Pricing and payment",
    paragraphs: [
      "Prices are quoted in Nigerian Naira and include the cost of the garment only. Delivery is quoted separately based on location.",
      "Card payments are processed by Paystack. Orders placed on WhatsApp require a transfer confirmation before dispatch.",
    ],
  },
  {
    heading: "Delivery",
    paragraphs: [
      "Lagos deliveries are handled by our own riders and typically arrive within one to three working days of payment. Orders outside Lagos are dispatched through a tracked courier.",
      "Tracking details are shared on WhatsApp. Delivery timelines outside our control, including courier delays and customs holds, are not guaranteed.",
    ],
  },
  {
    heading: "Returns and exchanges",
    paragraphs: [
      "Because each piece is unique, returns are accepted only where the garment is materially different from its listing or arrives damaged.",
      "Report the issue within forty eight hours of delivery with photographs. Approved returns are refunded or exchanged for another piece of equal value. Altered or worn garments cannot be returned.",
    ],
    list: [
      "Report within 48 hours of delivery",
      "Original condition and tags required",
      "No returns on final sale pieces",
    ],
  },
  {
    heading: "Selling to the vault",
    paragraphs: [
      "If you consign or sell a piece to us, you confirm that you own it and that it is free of any claim. Valuation is agreed in writing before the piece is collected.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "The Fab Vault is not responsible for indirect losses arising from a delayed or cancelled order. Where liability applies, it is limited to the amount paid for the garment in question.",
    ],
  },
  {
    heading: "Governing terms",
    paragraphs: [
      "These terms are governed by the laws of the Federal Republic of Nigeria. Placing an order confirms that you have read and accepted them.",
      "We may revise these terms when the way we sell changes. The revision date at the top of this page always reflects the version in force.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <LegalShell
        index="Document 02 / Terms"
        title="Terms and Conditions"
        intro="The rules that apply when you buy a piece from the archive, written without the usual hedging."
        updated="November 2026"
        sections={sections}
      />
      <Footer />
    </>
  );
}
