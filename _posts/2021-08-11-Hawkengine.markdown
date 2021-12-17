---
layout: post
title:  "Hawkengine development started"
date:   2021-05-11 10:20:01 +0000
categories: indiedev update
image: /assets/Images/Blog/ChaosHeroScreen.jpg
---

It is time to do something that I have been wanting to do for ages, make some fundamental changes to my engine. 

I am not one for small tech demos, I don't find it too interesting to see a single rendered room with some fabric flying around. 

*A single room rendered a game does not make.*

I will be developing a game along side the development of the new engine tech, to prove the systems as they are created.

# Quick overview of last tech

My last engine went through quite a few design changes and experiments while it moved through development. Some ideas worked well, other ideas not.

### Things that worked well
On the whole I was happy with what I achieved with the previous generation of engine. The main drawbacks came from legacy decisions when the project had different focuses. Originally the first lines of code were created for a specific commissioned project which eventually never saw the light of day. 
1. Component lead system. Everything had the same base which made things nice to work with in the engine. This is easier said than done with the vast differences in components required to make a game, but a good balance was found.
2. Block system kept components grouped in a logical order and made it simple to bring in entire sections from other game implementations built using the engine.
3. Script support for components was added late but eventually became central to everything.
4. Completely flexible video buffer support which allowed total control of graphics pipeline.

### Things that didn't work so well
1. The shader system was initially too inflexible, as a later addition I started to open this up which lead to some messy implementation in order to keep other projects working.
2. Python as a scripting engine was a pain! I found myself dealing with Python more and more when switching systems, operating systems and especially when porting over to mobile devices. What's more I didn't need the power it gave me.
3. Authoring tool was written in c#. Firstly annoying when I developed on Linux at times. Secondly annoying as the engine is written to be completely cross platform in c++.
4. Single threaded. Not entirely true, there were parts of the engine which used threads, but they were not central to the design of the engine, just standalone async implementations within components.
5. UI built into the engine. Worked well but I think it belongs outside of the engine scope to keep the engine manageable.
6. Coding everything from scratch is unnecessary and too hard to manage. Initially this was a good idea to get a deep understanding of how lots of things worked, but now it is just reinventing the wheel and keeping this code maintained was a time drain.


# What will be the biggest changes
1. Scripting will be central to all engine components, rather than optional.
2. Python is out, Lua is in. Much easier to manage.
3. XML out, files in. This sounds a bit odd but here is a quick explanation. Each component will now be represented a script file just stored in a folder in dev mode.
4. External libs will be used as much as possible for the implementation of interfaces. This will allow me to keep focus on engine design.
5. Resources will be optimised and loaded differently in deployment mode. Using external libs for data loading will lead to the data being in inefficient structures. This will probably be good for debugging and so will be used in a dev mode, but a deployment version of the assets will be created for the deployed game.
6. Engine will be substantially different and so requires a full authoring rewrite, this time QT will be used using an open source model. As the tool will be then in C++ it will be simple to add much more analytic functionality into it which was seriously lacking previously.
7. The engine already lends itself to an async structure, this threaded approach will be central and built into the core of the engine.
8. The previous engine had a graphics implementation of OpenGL which worked really well, but with the focus on async I really would like to offer a Vulkan path too. It is also something that I really want to play with in more than a demo situation.

# What makes this engine different?
This engine is very verbose, it doesn't even create a window for you unless you specify that a window manager component is required.

The engine doesn't have an editor UI built in. I will create a basic UI to go along with the engine that will be able to interface and embed the engine render output, however, this is not part of the engine project itself, the engine is standalone to keep a manageable focused project. The idea is that each project will probably create a bespoke editor solution designed for the specific purpose, rather than a general purpose frontend. Small projects for example may not even require a frontend, they may not even need to display anything in a window and require a vastly different style UI.

The idea is to totally divorce between engine and tools, this engine is more designed for engine programmers specifically, and offers a clear demarcation between the worlds of engine and tools. 