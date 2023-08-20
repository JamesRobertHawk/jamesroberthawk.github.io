---
layout: post
title:  "Tips for optimising Lua"
date:   2023-06-08 10:20:01 +0000
categories: indiedev update
image: /assets/Images/CoverAAA.jpg
nextpost: "Hawkengine development started"

---

# Introduction
I took the decision to switch my scripting engine to lua from python. This was due to a few reasons outside the scope of this article, however the biggest draw for me was the simplicity of the lua integration.

As I didn't know the full requirements for the scripting engine initially, I just studied enough to replace my scripting engine.

I planned to revisit the implementation once a vertical slice had been reached to analyse to see if optimisations could be achieved.

I decided to document the main changes I made to increase performance. 

I hope that it may be useful for others.

# Contents
1. [Globals vs Locals](#globals-vs-Locals)
2. [Optimising Globals](#optimising-globals)
3. [Conclusion](#conclusion)

## Globals vs Locals
In lua, variables default to global.
Globals are stored in an indexed table.
When a variable is referenced, a lookup is done in the global table for the value.

So

If you have loads of globals, this is going to be slower.

e.g.
```Lua
function example
    x = 5
    y = x + x
end
```
here x is set as a global to 5
y is then set as x + x. This incorporates two individual lookups from the global table of x.
Converting this to c++ makes it more obvious.

```C++
int main()
{
    std::map<std::string, int> globals;
    globals["x"] = 5;
    globals["y"] = globals["x"] + globals["x"];
}
```

But there's more...

When implementing the LUA scripting, I read that garbage collection exists much like the Python implementation I was replacing at the time. I didn't give this much thought then as my full spec was not formed, but kept it in mind.

I now know.

Lua states that it will garbage collect when an item is no longer referenced anywhere.

So referring to the previous example when will x and y be collected?
```Lua
function example
    x = 5
    y = x + x
end
```
Perhaps never, is the answer. They are referenced in the globals table so wont be collected.

What's more you may also get some unexpected results of variables leaking across methods.
```Lua
function example2
    y = x + x
end
```
Calling example2 after example will run no problem, x exists from before. But, call example2 before example and you get an error for referencing a nil value x.

I added LUA memory tracking to my memory metrics and confirmed that my lua memory usage just went up and up as the game progressed through levels.

## The fix
Explicitly state that variables are local.

```Lua
function example3
    local x = 5
    local y = x + x
end
```
The above code does not cause multiple lookups from the globals table.

Lua prioritises the local variables in a scope. So usage of x refer here to the local we declared.

When out of scope the local variables automatically qualify for garbage collection.

These variables no longer leak across methods, therefore odd bugs due to leaking variables across methods are avoided.

To clean up after components in c++ side I had to add to the component destruction code. I set the globals that related to that component to nil on destruction making them qualify for garbage collection.

| ![Affine warping effect on polygons with offscreen vertices](/assets/Images/Blog/LuaArticle/LuaMemoryTracking.jpg){:class="blog-img"} |
|:--:|
| *In editor memory tracking of lua showing data being correctly garbage collected during level transitions.* |

## Optimising Globals
Sometimes, however, we do want globals.

In my engine any component can reference any other component through lua directly.

There is a flat hierarchy for simplicity. e.g. referencing an image called 'img' inside a component block called 'block' is as simple as
```Lua
block_img
```
Each component can have functions and properties e.g.
```Lua
block_img.draw()
block_img.isRenderable:value()
```
One of the engines guiding principles is to break down components as far as possible, no one component will ever do two tasks. Therefore, there are a lot of components.

Adding a global inspector to my metrics to measure globals yielded a number greater that 4000 entries after loading level1.

This meant, each time a component was referenced in the LUA code, the lookup could look through 4000 entries.

Compounding the issue, even custom types can be found in the global table. e.g. in the engine there is a type called HVec3, a vector with size 3.
Typical usage:
```Lua
local hello = HVec.new()
```
and the c++ counterpart to see the problem
```c++
local hello = globals["HVec"].members["new"]
//And remember that globals has over 4000 members in it!
```

I relied on a preprocessing of the LUA scripts to generate variable names from helper macros. instead of having to write the entire name of a component. 
e.g.

```Lua
[BLOCK]texture
```

would expand to

```Lua
someparent_texture.
```

for scripts residing inside the 'someparent' directory.

There are a few problems with this.
1. It is a global lookup each time the script is run and as we saw, the globals base table can be large.
2. Having a preprocessor stops you being able to ship with compiled LUA scripts.

Hang on, compiled? Isn't this interpreted?

Nope. There is a compilation step and you can ship with this. As soon as I heard about it, I wanted it. Mostly just so I wasn't shipping with plain text scripts, but hey if my load speed increased too, well then that's great.

## The fix
I made a base table for components called, yep 'components' which all components would now reside.

So when using Vec3 or print or something, the lookup wouldn't be slowed by thousands of entries for components.

It does however mean that referencing a component is now slower.
First there is a lookup in the global table for 'components' then there is a subsequent lookup in that table for the component you desire.

To deal with this I relied on the fact that in the engine it is a bad pattern to reference another component from a vastly different block structure. In fact the occurrence of this happening is very rare, only a handful.

What is preferred are: 
1. interactions between components in the same block.
2. Interactions between components in a parent block,
3. and interactions between components in a child block. 

interactions between methods and parameters of the same component is probably the most common of all.

To speed all this up, all these lookups were front loaded. 

When a component is constructed in c++, a table is created to represent the component. Subsequent tables are created with references to all components in the block, a reference to the parent block if present, and if the component itself is a block, a reference to all the children it has. Then for usability these values are passed through to the entry functions of the script eg.

```Lua
function component.init(component,block,parent)
```

component here is also set before calling the script so it will reference whatever component is currently active. 

This removed the need for the preprocessor pass which in itself is an efficiency boost to load times, and meant I could now compile the scripts giving even more gains.

Overall the change took 3 weeks of part-time work. I kept both script styles functional during the transition which was absolutely vital due to the size of the changes required.

# Conclusion
Spending the time to go deep on a system that was completely functional to begin with paid off.

The uneasy feeling I had of not fully understanding a technology I was using was vanquished.

The speed boost to the game was huge, it went from around 200fps to near 1000. Keep in mind the title I am running is a retro style running on a gaming laptop.

Memory footprint now clearly rise and fall when levels were loaded and unloaded.

The hardest part of the change is now my game scripting structure is completely different and even though I was the one who re-engineered it, I was really used to the old style. The new style is going to take some time to get used to.




