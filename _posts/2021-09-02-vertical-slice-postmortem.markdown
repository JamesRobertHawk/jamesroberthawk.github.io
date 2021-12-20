---
layout: post
title:  "Vertical slice postmortem for Chaos the devil."
date:   2021-09-02 10:45:19 +0000
categories: indiedev update
image: /assets/Images/ChaosTheDevilCover.jpg
---

![Chaos the devil vertical slice screens](/assets/Images/Blog/VerticalSlice.jpg){:class="blog-img"}

It is done, the game has reached vertical slice. The journey to this point was relatively smooth, but there were lots of design changes along the way.

I will present my journey here in the style of problems and solutions, hopefully it may be of use to somebody in a similar gamedev journey.

# Problem
**The physics look great!**

![Chaos the devil pre alpha physics](/assets/Images/Blog/PhysicsTooGood.jpg){:class="blog-img"}

Using Bullet Physics[1] for my physics implementation gave great results. The player could run around with good looking momentum, kick down doors which would rebound slightly on impact and kick down walls of cubes which would dance around the screen. It was quite fun running around that little physics scene. Just one problem, physics like this doesn't belong in a PS1 style game.

# Solution
This was my first experience of Bullet Physics[1] and to be honest I got a little carried away. Before I knew it I had ended up deviating quite far from the type of game I set out to do. I didn't want to change the aim and come up with a new idea such as.

*'A modern take on the old PS1 style game!'*

So there was only one thing for it, ripping out the games physics implementation.

I fully backed out of simulated physics altogether and instead went back to basics just using colliders and rays for collision. Physics simulation maths now resides in the games lua scripts rather than internal to the engine using Bullet. What's more, it's super simple physics. As soon as this change was in the game started to feel much more akin to a 90s platformer. It also had the added bonus of being really easy to manage and tweak.

# Problem

**The character looks great**
![Chaos the devil hi-res vs low res](/assets/Images/Blog/CharacterDetail.jpg){:class="blog-img"}

A similar problem to above, however this time it was due to the character already being something I had created before the project. I always knew that the little critter was far far too complicated to be used without a very serious redesign.

# Solution

I needed a reference point to work to here, and using the power of the internet I found that the original Crash Bandicoot model was just 512 polygons[2].

I challenged myself to reduce my character to 512 polygons in Blender. This is much harder than you may think. in order to keep the character essence intact I had to deliberate over each polygon. The face was the most important part here, I needed to keep those expressive eyes, but everything else got brutally reduced in detail.

Crash Bandicoot had to deal with serious hardware limitations which lead the devs to use a vertex animation style to achieve the cartoonish animation quality[3]. I am hoping to gain some development ground here by relying on the fact I am not running on a PS1, it just has to look PS1 like. So I had another consideration, there needed to be enough vertex info around the joints to not give terrible creasing.

The last issue of texturing the character also took from Crash Bandicoot. Originally the model I used was textured using the standard approach of diffusemap, normalmap and materialmap. All these were thrown out and simple vertex colouring was used. This had a few wins:
1. In my opinion it hit the desired aesthetic right on the nose.
2. Creating assets that are vertex coloured rather than texturemapped is so much quicker.


# Problem
**Graphics looking nice and crisp!**
![Chaos the devil pre alpha hi res](/assets/Images/Blog/Hi-res-dev.jpg){:class="blog-img"}

Sort of counterintuitively, it takes effort to render badly these days. Textures look interpolate pretty nicely, resolutions even without AA look pretty good, vertex position interpolation is great, depthbuffer does a great job of displaying only pixels visible to the player. This was not the case in PS1 days, so it all has to change.

# Solution
![Chaos the devil pre alpha low res](/assets/Images/Blog/Low-res-dev.jpg){:class="blog-img"}
I was always aware this was going to be the case, and I am going to write a blog post solely on the techniques I used to achieve a similar look to PS1. Again, just as before, my aim was not to match the techniques of the PS1, which would obviously give me that PS1 style, but to still use more modern techniques to fake it. I am not trying to make my life too hard, this is a big project and I need to make up some ground in places.

### References
[1]Bullet Physics
[2]Crash 512 polys
[3]Crash dev story vid