// src/stripe.js
import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51R3g0PPIOXtwUtHjReDv7CzGBk8IIG6xRXTPDGCMG16AG3BRFXB9RsaUjYlJ5QZjwoV2v0jSGpAcvDvRdxb7eyqB00vlOBxjrf"
);
