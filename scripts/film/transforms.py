"""Finds elements whose position would be wiped out by a CSS transform.

A CSS rule that sets `transform` (directly, in an animation's keyframes, through a transition, or
on :active/:hover) REPLACES an SVG element's transform="..." attribute and any inline
style transform. Lists every JSX element that has such a class plus a transform attribute or an
inline style transform. Also lists SVG-only classes animating rotate/scale without transform-box.
(An animation that only moves translate/scale/rotate adds to an HTML element's own inline transform,
around the element's centre, so that pair is fine; on SVG they pivot around the parent's origin.)
"""
import os
import re
import sys

ROOT = sys.argv[1]
css = open(os.path.join(ROOT, 'src', 'styles.css'), encoding='utf8').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)

# keyframes that touch transform (kf_sets: the ones that set `transform` itself)
kf_transform, kf_sets = set(), set()
for m in re.finditer(r'@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)[^{}]*\}', css):
    if 'transform' in m.group(2) or 'translate' in m.group(2) or 'scale' in m.group(2) or 'rotate' in m.group(2):
        kf_transform.add(m.group(1))
    if re.search(r'(^|[;{\s])transform\s*:', m.group(2)):
        kf_sets.add(m.group(1))

# rules (skip keyframes bodies)
body = re.sub(r'@keyframes\s+[\w-]+\s*\{((?:[^{}]*\{[^{}]*\})*)[^{}]*\}', '', css)
body = re.sub(r'@media[^{]*\{', '', body)
rules = re.findall(r'([^{}]+)\{([^{}]*)\}', body)
cls_rules = {}
cls_replace = set()  # classes with a rule that sets `transform` itself (replaces an inline one too)
for sel, decl in rules:
    touches = replaces = False
    why = []
    if re.search(r'(^|;)\s*transform\s*:', decl):
        touches = replaces = True
        why += ['transform']
    for am in re.finditer(r'animation(?:-name)?\s*:\s*([^;]+)', decl):
        for name in re.findall(r'[\w-]+', am.group(1)):
            if name in kf_transform:
                touches, why = True, why + [f'animation {name}']
                replaces = replaces or name in kf_sets
    if re.search(r'transition\s*:[^;]*(transform|all)', decl):
        touches = replaces = True
        why += ['transition']
    if not touches:
        continue
    for s in sel.split(','):
        s = s.strip()
        last = re.split(r'\s+|>|\+|~', s)[-1]
        for c in re.findall(r'\.([\w-]+)', last):
            cls_rules.setdefault(c, set()).add(f'{s} -> {", ".join(why)}')
            if replaces:
                cls_replace.add(c)

# JSX elements
SVG_TAGS = {'g', 'path', 'ellipse', 'circle', 'rect', 'text', 'svg', 'use', 'image', 'polygon', 'polyline', 'line', 'tspan'}
found = []
for dirpath, _, files in os.walk(os.path.join(ROOT, 'src')):
    for f in files:
        if not f.endswith('.tsx'):
            continue
        p = os.path.join(dirpath, f)
        src = open(p, encoding='utf8').read()
        i = 0
        while True:
            m = re.compile(r'<([a-zA-Z][\w.]*)\b').search(src, i)
            if not m:
                break
            tag = m.group(1)
            j = m.end()
            depth = 0
            quote = None
            while j < len(src):
                ch = src[j]
                if quote:
                    if ch == quote:
                        quote = None
                elif ch in '"\'`' and depth == 0:
                    quote = ch
                elif ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                elif ch == '>' and depth == 0:
                    break
                j += 1
            attrs = src[m.end():j]
            i = m.end()
            cm = re.search(r'className=(\{`[^`]*`\}|"[^"]*"|\{[^}]*\})', attrs)
            if not cm:
                continue
            classes = set(re.findall(r'[\w-]+', cm.group(1)))
            has_attr = re.search(r'\btransform=', attrs) is not None
            has_style_tf = re.search(r'style=\{\{[^}]*transform', attrs) is not None
            hit = classes & (set(cls_rules) if has_attr or tag in SVG_TAGS else cls_replace)
            if not hit:
                continue
            if has_attr or has_style_tf:
                line = src.count('\n', 0, m.start()) + 1
                found.append((os.path.relpath(p, ROOT), line, tag, sorted(hit), 'transform attr' if has_attr else 'inline style transform', attrs.strip()[:140].replace('\n', ' ')))

for r in found:
    print(f'{r[0]}:{r[1]} <{r[2]}> classes={r[3]} has {r[4]}')
    print('    ', r[5])
    for c in r[3]:
        for why in sorted(cls_rules[c]):
            print('       css:', why)
print(len(found), 'conflicts')
