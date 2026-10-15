"""
Daviya photo helper.
1. Put your photos in the folder  my-photos/  and name them exactly like below
   (any format: .jpg .jpeg .png .webp), e.g.  hero-home.png , svc-meals.webp
2. Run:  python make_photos.py
3. Resized 10:7 JPGs are written to assets/media/images/photos/ and the site uses them automatically.
Needs:  pip install pillow
"""
import os
from PIL import Image, ImageOps

NAMES = ["hero-home","about-care","scene-lounge","scene-garden","scene-kitchen","scene-meditation",
         "scene-celebration","scene-visit","scene-reading","svc-living","svc-yoga","svc-daily",
         "svc-meals","svc-mobility","svc-medical","svc-value"]
SRC, OUT, SIZE = "my-photos", "assets/media/images/photos", (1600, 1120)
os.makedirs(SRC, exist_ok=True); os.makedirs(OUT, exist_ok=True)
files = {os.path.splitext(f)[0].lower(): f for f in os.listdir(SRC)}
done, missing = 0, []
for n in NAMES:
    if n in files:
        im = Image.open(os.path.join(SRC, files[n])).convert("RGB")
        ImageOps.fit(im, SIZE, Image.LANCZOS).save(os.path.join(OUT, n + ".jpg"), quality=90)
        print("OK ", n); done += 1
    else:
        missing.append(n)
print(f"\n{done} done, {len(missing)} still missing:", ", ".join(missing) or "none")
