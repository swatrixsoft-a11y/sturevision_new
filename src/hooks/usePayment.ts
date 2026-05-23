"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { authedFetch } from "@/lib/authedFetch";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export type PlanId =
  | "pro_monthly"
  | "pro_yearly"
  | "premium_monthly"
  | "premium_yearly";

interface UsePaymentOptions {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function usePayment({ onSuccess, onError }: UsePaymentOptions = {}) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  async function pay(planId: PlanId, userEmail?: string, userName?: string) {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay SDK failed to load. Check your internet connection.");

      // Create order on server
      const res = await authedFetch(getToken, "/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Payment error (${res.status})`);
      }
      const order = await res.json();

      // Open Razorpay modal — UPI shown first
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Sturevision",
        description: order.description,
        order_id: order.orderId,
        image: "/logo.png",
        prefill: {
          email: userEmail || "",
          name: userName || "",
        },
        // ── UPI-first configuration ──────────────────────
        config: {
          display: {
            blocks: {
              upi_block: {
                name: "Pay with UPI",
                instruments: [
                  { method: "upi", flows: ["qr", "collect", "intent"] },
                ],
              },
              other: {
                name: "Other payment options",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet", wallets: ["paytm"] },
                ],
              },
            },
            sequence: ["block.upi_block", "block.other"],
            preferences: { show_default_blocks: false },
          },
        },
        // ────────────────────────────────────────────────
        theme: { color: "#6366f1", backdrop_color: "rgba(0,0,0,0.6)" },
        modal: { backdropclose: false, escape: false },
        handler: async (response: any) => {
          // Payment captured — webhook will activate subscription
          // Optionally verify on client side too
          try {
            await authedFetch(getToken, "/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              }),
            });
          } catch (_) {
            // Non-critical — webhook is the source of truth
          }
          onSuccess?.();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        onError?.(resp.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err: any) {
      onError?.(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return { pay, loading };
}
