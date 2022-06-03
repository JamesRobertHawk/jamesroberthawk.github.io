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

I also faced a problem that was much more anticipated. Affine textures are most noticeable when textures contain straight lines. This was an issue that the PS1 developers also had to contend with, so it looks like we are on the right track.

I mitigated both these issues by adding geometry to the scene. I decided to add the extra polygons on load- this way I can more successfully adjust each scene section to work as well as possible. Tesselation could also be done in the shader, however, dynamically changing the tesselation level is noticeable due to the affine texture mapping.

At this point I thought I was done, but then I found [another discussion](https://retrocomputing.stackexchange.com/questions/5019/why-do-3d-models-on-the-playstation-1-wobble-so-much) regarding how the PS1 handled clipping. Apparently, the PS1 clipped entire polygons and the developer had to deal with this. This explains why the strange affine warping didn't occur on the PS1- there are no polygons which contain vertices outside the view.

Apparently, to deal with this, the developer would have to subdivide polygons to minimise the problem and ultimately force the remaining points into view.

As geometry is added to the surface, the affine texture-mapping improves so there is a very visible snap occurring in the polygons which require clipping. This is a curious effect that I witnessed in Tomb Raider.

To recreate this effect, I first tried to use the techniques required to subdivide triangles requiring clipping in the shader and then forcing all vertices into view, and it sort of worked.

The problem with this approach is that some of my meshes are not closed, but next to one another as level blocks, so forcing vertices around made visible holes appear. The other issue was that this approach required substantial changes to my pipeline which I decided was not worth it.

Instead I went with faking the effect, which is well within my brief.

I passed two versions of vec2 UV to the fragment shader, one with perspective correction and the other without for affine. I also passed through a flag which indicated when all vertices of the polygon being rendered were within the view frustrum. If they were, I used the affine UV vector, and if not I used the perspective-corrected vector for UVs.

So when the camera gets close to a polygon there is a visible jump in interpolation quality, which I think gives a good approximation.

| ![Example of combining depth buffer and painter algorithm to achieve false tesselation snapping for polygons with offscreen vertices](/assets/Images/Blog/PS1Article/PS1_Style_False_Tesselation.gif){:class="blog-img"} |
|:--:|
| *Left, full affine texture-mapped render. Middle, blue highlights showing polygons which contain offscreen vertices. Right, result of combining perspective texture mapping for polygons with offscreen vertices and affine texture mapping for polygons which reside completely inside view frustrum.* |

# Polygons
## Jittering

Triangles that make up the 3D shapes in a PS1 game, as well as popping [(see popping triangles section)](#popping-triangles) appear to dance all over place.

**What's going on?**

The PS1 doesn't support sub-pixel precision when presenting to the frame buffer. This means that when a vertex position is calculated, it snaps to the nearest pixel. The low frame resolutions compound this issue, so the snapping is quite noticeable.

| ![Tomb Raider 1 and Croc showing vertex jitter](/assets/Images/Blog/PS1Article/PS1_Low_Vertex_Precision.gif){:class="blog-img"} |
|:--:|
| *Jittering present in Tomb Raider 1 and Croc Legend of the Gobbos* |

**Why doesn't this happen anymore?**

We can now have subpixel vertex precision and anti-aliasing means even greater precision. This means that our polygons end up exactly where we expect them to be.

**So how do we get it back?**

Reduce the precision, which can be done in the vertex shader.

```c++
//position is post MVP translation of vertex
vec4 to_low_precision(vec4 position,vec2 resolution)
{
	//Perform perspective divide
	vec3 perspective_divide = position.xyz / vec3(position.w);
	
	//Convert to screenspace coordinates
	vec2 screen_coords = (perspective_divide.xy + vec2(1.0,1.0)) * vec2(resolution.x,resolution.y) * 0.5;

	//Truncate to integer
	vec2 screen_coords_truncated = vec2(int(screen_coords.x),int(screen_coords.y));
	
	//Convert back to clip range -1 to 1
	vec2 reconverted_xy = ((screen_coords_truncated * vec2(2,2)) / vec2(resolution.x,resolution.y)) - vec2(1,1);

	//Construct return value
	vec4 ps1_pos = vec4(reconverted_xy.x,reconverted_xy.y,perspective_divide.z,position.w);
	ps1_pos.xyz = ps1_pos.xyz * vec3(position.w,position.w,position.w);

	return ps1_pos;

}
```

When applying this to a real game context, I noticed a side effect that I haven't seen discussed elsewhere.

When using this method we are adding a slight offset to the vertex positions, so the shape of the polygon is slightly altered. This works great, as long as all the vertices are aligned exactly.

However, if you have two shapes that are supposed to be together, but with vertices that are not aligned, seams can appear.

| ![Image illustrating seams appearing between polygons which are not closed meshes when applying low vertex precision technique](/assets/Images/Blog/PS1Article/PS1_Low_Vertex_Precision_Causing_Splitting_Explanation.jpg){:class="blog-img"} |
|:--:|
| *Left, desired objects rendered together. Right, result of applying a slight rotation with low vertex position precision causing visible gap between objects A and B* |

It is easiest to illustrate by example. Referring to the above image, on the left the two squares A and B are together as desired, on the right the two shapes have been rotated slightly and snapped to a grid. As you can see a gap appears between polygon A and B.

The best way to fix this is to have fully closed meshes. No doubt this was the approach used by PS1 games, however I need to keep some flexibility in my authoring as I need to keep the complexity of the project as low as possible.

Some fixes:

1. Skybox background which contains similar colours to the main floor, wall and sky works quite well, but limits the level design too much. I want to be able to move between different floor colours during the level.
2. Either pragmatically or manually add vertices to the geometry to ensure all vertices match up. This is a bit of a pain to implement.
3. Not clearing the colour buffer between draws and accumulating the render. Holes in geometry now are filled with similar colour from previous render. This does quite a good job- most seams are hard to see. The problem is now that the scene cannot rely on clear colours.

I went with the approach of trying to keep my geometry lined up as much as possible, but where this is not possible I fall back to the third approach to cover seams.

| ![Seams created by low vertex precision causing sparkles](/assets/Images/Blog/PS1Article/PS1_Style_Low_Vertex_Precision_Seams_Sparkles.gif){:class="blog-img"} |
|:--:|
| *Left, untreated render showing black sparkles caused by seams appearing due to low vertex precision. Right, result of not clearing colour buffer between frames, making seams harder to see* |

After tackling this issue, I noticed the same thing occurring in Tomb Raider 1, which also uses a block system for level building. So, not fixing the issue is also acceptable.

| ![Tomb Raider 1 showing seams caused by low vertex precision](/assets/Images/Blog/PS1Article/Low_Vertex_Precision_Causing_Seams_In_Tomb_Raider_PS1.jpg){:class="blog-img"} |
|:--:|
| *Seam between level blocks visible in Tomb Raider 1 on PS1* |


