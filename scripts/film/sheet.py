"""Contact sheet: python sheet.py <frames.json> <out.png> [cols] [scale] [x y w h]  (crop in page px)"""
import json, sys
from PIL import Image, ImageDraw
frames = json.load(open(sys.argv[1]))
out = sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.3
crop = tuple(int(v) for v in sys.argv[5:9]) if len(sys.argv) > 8 else None
imgs = []
for f, ms in frames:
    im = Image.open(f).convert('RGB')
    if crop:
        x, y, w, h = crop
        im = im.crop((x, y, x + w, y + h))
    im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 46, 14], fill=(0, 0, 0))
    d.text((2, 1), f'{ms}ms', fill=(255, 255, 0))
    imgs.append(im)
w, h = imgs[0].size
rows = (len(imgs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + 4), rows * (h + 4)), (40, 40, 40))
for i, im in enumerate(imgs):
    sheet.paste(im, ((i % cols) * (w + 4), (i // cols) * (h + 4)))
sheet.save(out)
print(out, sheet.size)
