"""Genera con Python nubes originales para la transición del video a la invitación.
Requiere Pillow, NumPy y OpenCV solo para regenerar los recursos. El sitio web
funciona sin Python, sin paquetes JS y sin conexión a Internet.
"""
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageFilter

OUT = Path(__file__).resolve().parents[1] / 'assets' / 'clouds'
OUT.mkdir(parents=True, exist_ok=True)
W, H = 700, 430
Y, X = np.mgrid[0:H, 0:W].astype(np.float32)
X = X / W
Y = Y / H


def noise(rng, shape, w=W, h=H):
    nw, nh = shape
    base = rng.random((nh, nw), dtype=np.float32)
    image = cv2.resize(base, (w, h), interpolation=cv2.INTER_CUBIC)
    return (image - image.mean()) / (image.std() + 1e-6)


def cloud(index):
    rng = np.random.default_rng(78312 + index * 121)
    envelope = np.zeros((H, W), dtype=np.float32)
    # Several drifting lobes; low centers create the billowing silhouette.
    for j in range(18):
        center_x = .5 + rng.normal(0, .24)
        center_y = .52 + rng.normal(0, .14)
        radius_x = rng.uniform(.10, .24)
        radius_y = rng.uniform(.15, .29)
        lobe = np.exp(-(((X - center_x) / radius_x)**2 + ((Y - center_y) / radius_y)**2) * rng.uniform(.7, 1.6))
        envelope = np.maximum(envelope, (lobe * rng.uniform(.77, 1)).astype(np.float32))
    n1 = noise(rng, (9, 6))
    n2 = noise(rng, (32, 16))
    n3 = noise(rng, (94, 53))
    density = np.clip((envelope + .12*n1 + .054*n2 + .025*n3 - .12) / .64, 0, 1)
    alpha = density*density*(3-2*density)
    alpha = alpha ** 1.08
    # Diffuse cloud interior with rose and cool-grey lowlights; bright upper edge.
    light = np.clip(.54 - .34*(Y-.48) + .11*n1 + .07*n2, 0, 1)
    arr = np.zeros((H, W, 4), dtype=np.uint8)
    arr[..., 0] = np.uint8(np.clip(212 + 40*light + 5*n2, 0, 255))
    arr[..., 1] = np.uint8(np.clip(202 + 51*light + 6*n2, 0, 255))
    arr[..., 2] = np.uint8(np.clip(215 + 41*light + 5*n2, 0, 255))
    arr[..., 3] = np.uint8(np.clip(alpha * (0.84 + .15*light) * 247, 0, 240))
    image = Image.fromarray(arr, 'RGBA').filter(ImageFilter.GaussianBlur(1.35))
    out = OUT/f'nube_{index:02d}.png'
    image.save(out, optimize=True)
    print(out.name, out.stat().st_size)


for index in range(1, 7):
    cloud(index)

# Fully covering cloudy mist: this conceals the scene swap and then fades out.
N_W, N_H = 1152, 720
rng = np.random.default_rng(20261512)
large = np.zeros((N_H, N_W), dtype=np.float32)
for (rw, rh, weight) in [(8, 5, .45), (19, 11, .25), (49, 28, .18), (115, 64, .12)]:
    large += weight * noise(rng, (rw, rh), N_W, N_H)
large = np.clip(large * .18, -.26, .26)
y = np.arange(N_H, dtype=np.float32)[:, None] / N_H
x = np.arange(N_W, dtype=np.float32)[None, :] / N_W
glow = np.exp(-((x-.57)/.58)**2 - ((y-.38)/.68)**2)
red = 239+large*31+glow*11
blue = 241+large*20+glow*2
green = 230+large*26+glow*9
rgb = np.stack([red, green, blue],axis=-1)
image = Image.fromarray(np.uint8(np.clip(rgb,0,255)), 'RGB').filter(ImageFilter.GaussianBlur(2))
out = OUT/'neblina_completa.webp'
image.save(out, 'WEBP', quality=86, method=5)
print(out.name, out.stat().st_size)
