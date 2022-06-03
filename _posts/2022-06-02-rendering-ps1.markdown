---
layout: post
title:  "Rendering in Playstation 1 style in OpenGL"
date:   2022-06-02 18:45:19 +0000
categories: indiedev update
image: /assets/Images/PlaystationRenderingArticleCover.jpg
nextpost: "Vertical slice postmortem for Chaos the devil."
---

This article outlines the techniques I used to emulate a PS1-style game in OpenGL. I use my own engine for this article, but if you are using one of the popular game engines you will still find the information useful.


# Introduction

When creating a brand new Hello World OpenGL project, you will have in front of you a far superior render than the days of Virtual Fighter and Crash Bandicoot. Things have moved on a great deal. Where the developers of old spent effort making their games look as good as possible, we now must spend effort to recreate the simpler aesthetic of these old games.

# Contents
1. [Motivation](#motivation)
2. [Textures](#textures)
3. [Polygons](#polygons)
4. [Rendering](#rendering)
5. [Conclusion](#conclusion)

# Motivation
I am developing an old-school 3D platformer [Chaos The Devil]({% post_url 2021-08-11-chaos-the-devil-announcement %}). 

The idea is to recreate the look and feel of PS1 greats like Crash Bandicoot and Spyro The Dragon.

I aim to do this by applying techniques to create renders which emulate these titles. I am **NOT** going to restrict myself to the technical limitations of the day.

While researching this topic online, I found a wealth of forum posts and Reddit threads suggesting how to achieve this look. However, implementation proofs of these theories were lacking. This article will therefore highlight the issues I had when implementating these techniques in a real world game dev environment.

# Textures
## Resolution and Depth

Textures in PS1 games have a distinct look, more like pixel art than true representations. 

| ![Tomb Raider 1 Texture resolution](/assets/Images/Blog/PS1Article/Tomb_Raider1_Low_Texture_Resolution_PS1.jpg){:class="blog-img"} |
|:--:|
| *Tomb Raider 1 low texture resolution examples* |

**Why doesn't this happen anymore?**

OpenGL allows you to plaster any image of your choosing into a graphics scene. Performance-wise, we can really wack up texture sizes these days. The richness in colour of the images we can use as textures is far greater, and we can have full, smooth, transparent sections.

**So how do we get it back?**

We need to work inside the technical limits of the PS1.

* Mode 4: 4-bit CLUT (16 colors)
* Mode 8: 8-bit CLUT (256 colors)
* Mode 15: 15-bit direct (32,768 colors)
* Mode 24: 24-bit (16,777,216 colors)

[Source: PS1 technical specification](https://en.wikipedia.org/wiki/PlayStation_technical_specifications)

From reading whatever I could find about this on the net, it is suggested that the high colour depths were mainly used for static images, and the lower depths were used for in-game polygons.

The approach I took was more artistic than scientific. I studied the textures used in PS1 games and tried to match their look, limiting colour pallets to suit.

It is often suggested that you could get textures to gain this look in the shader by posterising. However, the PS1 supported colour lookup tables (CLUT), and posterising would actually alter colours.

| ![Posterisation example changing source colours vs colour pallette](/assets/Images/Blog/PS1Article/PS1_Style_Posterise_Comparison.jpg){:class="blog-img"} |
|:--:|
| *Left: Original source texture. Right: Reduced colours. Centre: Effect of posterising which introduces undesirable colours* |

The PS1 was capable of pushing 90k-180k textured polygons a second. However, it was able to push 360k when un-textured [see technical Spec](https://en.wikipedia.org/wiki/PlayStation_technical_specifications). This use of un-textured polygons was often used in conjunction with vertex colouring to increase efficiency. The Crash Bandicoot model was mostly un-textured and, with this in mind, I redesigned my main character to use vertex colouring rather than texture mapping. I also heavily reduced the polygon count to 512 triangles, which was tougher than imagined.

| ![Chaos the devil hi vertex resolution vs low vertex resolution](/assets/Images/Blog/CharacterDetail.jpg){:class="blog-img"} |
|:--:|
| *Left, hi-poly character coloured with texture mapping. Right, low poly PS1-style character coloured using vertex colouring* |

## Texture Rendering
The textures of the PS1 are unmistakable- they are blocky, colourful, sparsely-pixelated and appear to have a personality themselves.

| ![Tomb Raider 1 showing warped affine textures](/assets/Images/Blog/PS1Article/PS1_Affine_Texure_Mapping_Effect_In_Tomb_Raider.jpg){:class="blog-img"} |
|:--:|
| *Tomb Raider 1 on PS1 showing warped textures* |

**What's going on?**

Textures being applied to triangles (texture mapping) put in very simple terms work by storing a texture map coordinate for each vertex. These coordinates are then interpolated across the triangle and used to deform the image so that it appears to be on the triangle.

We look up which is the closest pixel to the calculated lookup point and that is the colour chosen for that part of the triangle. Ultimately this is transformed to pixels.

With this approach you would expect a few issues.

1. When the texture is close to the viewer, the pixels can become very large.

2. When the texture is far away, shimmering becomes an issue as the calculation tries to frantically decide which tiny pixel to display from the texture.

3. If the texture is applied to a surface that is not perpendicular to the viewer, it gains a warping effect.

**Why doesn't this happen anymore?**

It does, but most example code found on the internet includes settings to mitigate or remove these issues.

1. Textures have interpolation settings in OpenGL.  ```GL_NEAREST```  for example, has the effect of interpolating pixel colour where appropriate, which leads to smoothing of the texture.

2. Likewise, shimmering is solved with a combination of this pixel interpolation and the addition of mipmaps. See ```GL_GENERATE_MIPMAP```

3. The way the PS1 handles textures is quite basic- it simply projects the texture onto the polygon (affine). It does not take perspective into account. Perspective correction is now default for OpenGL, which solves the warping.

**So how do we get it back?**

1. To get that pixelated look back, we need to turn interpolation mode to ```GL_LINEAR``` in our textures.

2. To gain shimmering textures, we can turn off mipmap generation.
```glTexParameteri(GL_TEXTURE_2D, GL_GENERATE_MIPMAP, GL_FALSE);```

3. To turn off perspective correction on textures, we can use noperspective in our shader. 
```noperspective vec2 UV;```

The largest impact was the change to affine interpolation of textures. This is most noticeable on faces which are near to the camera.

I did encounter an issue I wasn't expecting. Triangles which had offscreen vertices didn't work well with affine texturing. This is probably due to the fact that the clip stage alters the geometry, breaking down faces so they fit onscreen. Affine texture mapping goes crazy when this happens. 

| ![Affine warping effect on polygons with offscreen vertices](/assets/Images/Blog/PS1Article/PS1_Affine_Texture_Mapping_Warp_With_Offscreen_Vertices.gif){:class="blog-img"} |
|:--:|
| *Affine warping effect on polygons which contain offscreen vertices* |


