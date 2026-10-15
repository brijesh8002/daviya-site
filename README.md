# Daviya Elderly Care Homes — website

Static, single-page site (HTML + CSS + JS). No build step. Open `index.html` or upload the folder to any web host.
Needs an internet connection for Bootstrap, Bootstrap Icons and Google Fonts (loaded from CDNs).

## One thing to do before launch
Open `assets/js/script.js` and fill in the three values at the top:

```js
const DAVIYA = {
  phone:    "919876543210",        // country code + number, digits only
  whatsapp: "919876543210",
  email:    "care@yourdomain.com"
};
```
Until these are filled in, the call / WhatsApp / email buttons stay hidden and the enquiry form tells visitors
the channel is not set up yet. Once filled in, the buttons, footer, floating icons and form all update automatically.

## How the enquiry form works
There is no server. "Send on WhatsApp" opens WhatsApp with the enquiry pre-written; "Send by email" opens the visitor's
email app. If you later want enquiries stored in a dashboard, connect the form to a service such as Formspree or your own API.

## Structure
```
index.html                  page content
assets/css/style.css        header + all sections
assets/css/responsive.css   tablet / phone refinements
assets/js/script.js         contact settings, menu, care guide, form
assets/docs/Daviya_Profile.pdf   downloadable brochure
assets/media/images/        logo, favicon, social-share image
```

## Content to review
Everything about services comes from the Daviya profile and Word document. These parts are my additions and should be
confirmed by your team: the "A day at Daviya" routine, the "Moving in, step by step" process, the comparison table,
the FAQ answers on price and visits, and the visit checklist.

## Images
All pictures are real photographs in `assets/media/images/photos/` (no illustrations). Replace any file there with your own
photo of the same name (JPG, ~1600x1120 px, 10:7) to update it everywhere. Check licences / permissions of every photo before launch.

## Credit
The footer of every page carries "Designed & maintained by Tssg Tech" linking to https://tssgtech.com/.
