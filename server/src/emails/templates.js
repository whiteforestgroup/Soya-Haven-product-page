import { business } from "../../../src/data/business.js";
import { unsubscribeUrl } from "../lib/unsubscribe.js";

const SITE_URL = `https://${business.domain}`;

function wrapper({ to, preheader, bodyHtml, ctaLabel, ctaUrl }) {
  return `<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#F6F1E7; font-family: Georgia, 'Times New Roman', serif;">
    <span style="display:none; max-height:0; overflow:hidden;">${preheader || ""}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E7; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 520px; background:#FFFDF9; border-radius: 12px; overflow: hidden;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 36px 36px 28px; text-align: center; border-bottom: 1px solid #E9E1D1;">
                <span style="font-family: Georgia, serif; font-size: 22px; letter-spacing: 0.02em; color: #52623F;">Soya Haven Co.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 36px; font-size: 15px; line-height: 1.65; color: #2A241D;">
                ${bodyHtml}
                ${
                  ctaLabel
                    ? `<div style="text-align:center; margin: 28px 0 8px;">
                        <a href="${ctaUrl}" style="background:#52623F; color:#FFFDF9; text-decoration:none; padding: 14px 28px; border-radius: 6px; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; display:inline-block;">${ctaLabel}</a>
                      </div>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 36px 32px; border-top: 1px solid #E9E1D1; font-size: 12px; color: #6B6154; text-align: center; line-height: 1.6;">
                Soya Haven Co. &middot; ${business.mailingAddress}<br />
                <a href="${unsubscribeUrl(to)}" style="color:#6B6154;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function p(text) {
  return `<p style="margin: 0 0 16px;">${text}</p>`;
}

// ---------------------------------------------------------------------------
// Order confirmation — sent immediately on a completed purchase, separate
// from the (intentionally delayed) Post-Purchase flow below. This is a
// transactional receipt, not a marketing send.
// ---------------------------------------------------------------------------
export function orderConfirmationEmail(to, { items, totalAmount }) {
  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 6px 0; border-bottom: 1px solid #E9E1D1;">${item.scent} (${item.size}) &times; ${item.quantity}</td>
          <td style="padding: 6px 0; border-bottom: 1px solid #E9E1D1; text-align: right;">$${(item.unitPrice * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return {
    subject: "Your Soya Haven Co. order is confirmed! 🌿",
    html: wrapper({
      to,
      preheader: "Thank you for your order — here's a quick summary.",
      bodyHtml:
        p("Hi,") +
        p("Thank you for your order! It's already being handcrafted with care here in Fredericksburg, Virginia.") +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0; font-size: 14px;">
          ${itemRows}
          <tr>
            <td style="padding: 10px 0 0; font-weight: bold;">Total</td>
            <td style="padding: 10px 0 0; font-weight: bold; text-align: right;">$${totalAmount.toFixed(2)}</td>
          </tr>
        </table>` +
        p("You'll get another email from us once it ships. Questions in the meantime? Just reply — a real person reads these."),
    }),
  };
}

// ---------------------------------------------------------------------------
// Flow 1 — Abandoned Checkout
// ---------------------------------------------------------------------------
export function abandonedCheckoutEmail(step, to, { scent } = {}) {
  if (step === 1) {
    return {
      subject: "You left something in your cart 🌿",
      html: wrapper({
        to,
        preheader: `Your ${scent || "order"} is still here whenever you're ready.`,
        bodyHtml:
          p("Hi there,") +
          p("Looks like you were putting together a Soya Haven order and got pulled away &mdash; it happens to all of us.") +
          p("Your cart is still saved, exactly how you left it. Whenever you're ready, it'll only take a minute to finish.") +
          p("Every order ships with a free sample of another scent, on us &mdash; no strings attached.") +
          p("Warmly,<br />The Soya Haven Co. team"),
        ctaLabel: "Finish Your Order",
        ctaUrl: SITE_URL,
      }),
    };
  }
  if (step === 2) {
    return {
      subject: "A few things people ask before ordering",
      html: wrapper({
        to,
        preheader: "Handmade, natural, and made to last.",
        bodyHtml:
          p("Hi again,") +
          p("If you're still deciding, here's what makes Soya Haven a little different:") +
          `<ul style="margin: 0 0 16px; padding-left: 20px;">
            <li style="margin-bottom: 6px;">Made with 100% pure essential oils, not synthetic fragrance oil</li>
            <li style="margin-bottom: 6px;">No parabens, phthalates, dyes, or fillers</li>
            <li style="margin-bottom: 6px;">Handcrafted in small batches in Fredericksburg, Virginia</li>
            <li style="margin-bottom: 6px;">A 4 oz bottle typically lasts 6&ndash;9 months</li>
            <li>No flames, plugs, or electricity &mdash; just spray and go</li>
          </ul>` +
          p("And if you add a second bottle, shipping's on us.") +
          p("Questions before you order? Just reply &mdash; a real person reads these."),
        ctaLabel: "Finish Your Order",
        ctaUrl: SITE_URL,
      }),
    };
  }
  return {
    subject: "Still thinking it over?",
    html: wrapper({
      to,
      preheader: "We saved your cart — no rush.",
      bodyHtml:
        p("Hi,") +
        p("We won't keep bugging you about this &mdash; just didn't want your cart to disappear without one last check-in.") +
        p("If something held you back &mdash; price, a question about a scent, anything &mdash; just hit reply. We'd genuinely like to know.") +
        p("The Soya Haven Co. team"),
      ctaLabel: "Finish Your Order",
      ctaUrl: SITE_URL,
    }),
  };
}

// ---------------------------------------------------------------------------
// Flow 2 — Welcome
// ---------------------------------------------------------------------------
export function welcomeEmail(step, to) {
  if (step === 1) {
    return {
      subject: "Welcome to Soya Haven Co. 🌿",
      html: wrapper({
        to,
        preheader: "Handmade, natural room sprays from Fredericksburg, VA.",
        bodyHtml:
          p("Hi, and welcome!") +
          p("Soya Haven Co. started with a simple idea: home fragrance shouldn't mean synthetic chemicals, open flames, or something plugged into the wall. Just a real, natural scent you can spray anywhere, anytime.") +
          p("Every bottle is handmade in small batches, made with pure essential oils, and bottled in reusable amber glass.") +
          p("Glad you're here."),
        ctaLabel: "Explore Our Scents",
        ctaUrl: SITE_URL,
      }),
    };
  }
  if (step === 2) {
    return {
      subject: "Why we skip fragrance oil entirely",
      html: wrapper({
        to,
        preheader: 'The difference between "smells nice" and actually natural.',
        bodyHtml:
          p("A lot of room sprays use fragrance oil &mdash; synthetic, cheaper, and often mixed with things you can't pronounce.") +
          p("We use essential oils. Full stop. That means every scent &mdash; from Lemongrass to Bergamot Vanilla &mdash; is the real plant, not a lab copy of it.") +
          p("It also means our sprays don't just mask odors, they neutralize them."),
        ctaLabel: "See All Scents",
        ctaUrl: SITE_URL,
      }),
    };
  }
  return {
    subject: "Your free sample is waiting",
    html: wrapper({
      to,
      preheader: "Free shipping on 2 bottles. A free sample with every order.",
      bodyHtml:
        p("Ready to bring one home?") +
        p("Every order includes a free sample of another scent, so you get to try something new without committing to a full bottle. And if you grab two bottles, shipping's free.") +
        p("Most people start with Lemongrass or Peppermint &mdash; both are crowd favorites."),
      ctaLabel: "Shop Now",
      ctaUrl: SITE_URL,
    }),
  };
}

// ---------------------------------------------------------------------------
// Flow 3 — Post-Purchase
// ---------------------------------------------------------------------------
export function postPurchaseEmail(step, to) {
  if (step === 1) {
    return {
      subject: "Your order is on its way! 📦",
      html: wrapper({
        to,
        preheader: "Handmade with care, on its way to you.",
        bodyHtml:
          p("Good news &mdash; your order is being handcrafted and packed with care here in Fredericksburg, Virginia!") +
          p("A couple tips for once it arrives: 2&ndash;3 sprays is usually plenty for an average room, and it works great on fabrics too &mdash; bedding, curtains, towels.") +
          p("Enjoy!"),
      }),
    };
  }
  if (step === 2) {
    return {
      subject: "How's your new room spray?",
      html: wrapper({
        to,
        preheader: "We'd love to hear what you think.",
        bodyHtml:
          p("Hi again,") +
          p("You've had a little time with your Soya Haven order now &mdash; how's it going?") +
          p("If you have a minute, we'd really appreciate hearing your honest thoughts. It helps us and helps other people deciding what to try &mdash; just reply to this email.") +
          p("Thank you for supporting a small, handmade business."),
      }),
    };
  }
  return {
    subject: "Running low? We've got you.",
    html: wrapper({
      to,
      preheader: "New scents, or more of your favorite.",
      bodyHtml:
        p("A 4 oz bottle usually lasts 6&ndash;9 months, so no rush &mdash; but if you're getting low, or ready to try something new, we're here.") +
        p("Haven't tried Tea Tree or Frankincense yet? A lot of repeat customers end up collecting a few.") +
        p(`We also sell candles and wax melts on <a href="${business.etsyUrl}" style="color:#52623F;">Etsy</a>, if you want to round things out.`),
      ctaLabel: "Shop Room Sprays",
      ctaUrl: SITE_URL,
    }),
  };
}

// ---------------------------------------------------------------------------
// Flow 4 — Winback
// ---------------------------------------------------------------------------
export function winbackEmail(step, to) {
  if (step === 1) {
    return {
      subject: "It's been a while 🌿",
      html: wrapper({
        to,
        preheader: "A few new scents since you last checked in.",
        bodyHtml:
          p("Hi,") +
          p("It's been a bit since we've seen you &mdash; no worries either way, just wanted to say hello.") +
          p("Since you last visited, we've added a few new scents to the lineup, and every order still comes with a free sample."),
        ctaLabel: "See What's New",
        ctaUrl: SITE_URL,
      }),
    };
  }
  return {
    subject: "Should we keep in touch?",
    html: wrapper({
      to,
      preheader: "Totally your call.",
      bodyHtml:
        p("If you'd like to keep hearing from us, no action needed &mdash; you'll keep getting the occasional email.") +
        p("If it's not for you right now, no hard feelings &mdash; you can unsubscribe anytime below, and you're always welcome back.") +
        p("Either way, thank you for giving Soya Haven a try."),
    }),
  };
}
