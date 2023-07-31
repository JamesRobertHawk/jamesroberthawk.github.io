---
layout: post
title:  "Tips for optimising Lua"
date:   2023-06-08 10:20:01 +0000
categories: indiedev update
image: /assets/Images/CoverAAA.jpg
nextpost: "Hawkengine development started"

---

# Introduction
For my current project I took the decision to switch my scripting engine to us lua. 

Prior to this project I had no exposure to lua. While making the engine I didn't spend much time learning best practices for optimisation.

I decided to document the main changes I made to increase performance as it may be useful for others.

# Contents
1. [Globals vs Locals](#motivation)
2. [Optimising Globals](#textures)
3. [Conclusion](#polygons)

## Globals vs Locals
In lua, variables default to global.
Globals are stored in an indexed table.
When a variable is referenced, a lookup is done in the global table for the value.
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

When implementing the LUA scripting I read that garbage collection exists much like the Python implantation I was replacing at the time. So I didn't give this much thought.

Lua states that it will garbage collect when an item is no longer referenced anywhere.

So when will x and y be collected in the below example?
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

Lua prioritises the local variables in a scope. So usage of x also refer here to the local we declared.

When out of scope the local variables automatically qualify for garbage collection.

These variables no longer leak across methods therefore removing odd bugs arising.

To clean up after components in c++ side I had to add to the component destruction code to set the globals that related to that component to nil. This allows for garbage collection.

## Optimising Globals
Sometimes however we do want globals.

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
One of the engines guiding principles is to break down components as far as possible, no one component will ever do two tasks. Therefore there are a lot of components.

Adding a global inspector to my metrics to measure globals after loading level1 yielded a number greater that 4000 entries.

This meant, each time a component was referenced in the LUA code, the lookup has to look through 4000 odd entries.

Compounding the issue even custom types can be found in the global table. e.g. in the engine there is a type called HVec3, a vector with size 3.
Typical usage:
```Lua
local hello = HVec.new()
```
and the c++ counterpart to see the problem
```Lua
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

for scripts residing inside the someparent directory.

There are a few problems with this.
1. It is a global lookup each time the script is run and as we saw the globals base table can be large.
2. Having a preprocessor stops you being able to ship with compiled LUA scripts.

Hang on, compiled? Isn't this interpreted?

Nope. There is a compilation step and you can ship with this, it was news to me, but as soon as I heard about it, I wanted it. Mostly just so I wasn't shipping with plain text scripts, but hey if my load speed increased too, well then that's great.

## The fix
I made a base table for components called, yep 'components' which all components would now reside.

So when using Vec3 or print or something the lookup wouldn't be slowed by thousands of entries for components.

It does however mean that referencing a component is now slower.
First there is a lookup in the global table for 'components' then there is a subsequent lookup in that table for the component you desire.

To deal with this I relied on the fact that in the engine it is a bad pattern to reference another component from a vastly different block structure. In fact the occurrence of this happening is very rare, only a handful.

What is preferred is interactions between components in the same block. Interactions between components in a parent block, and interactions between components in a child block. interactions between methods and parameters of the same component is probably the most common of all.

To speed all this up all these lookups were front loaded. When a component is constructed in c++ a table is created to represent the component. Subsequent tables are created with references to all components in the block, a reference to the parent block if present and if the component itself is a block a reference to all the children it has. Then for usability these values are passed through to the entry functions of the script eg.

function component.init(component,block,parent)

component here is also set before calling the script so it will reference whatever component is currently set. This removed the need for the preprocessor pass which in itself is an efficiency boost to load times, and meant I could now compile the scripts giving even more gains.

Overall the change took 3 weeks of part-time work. I kept both script styles functional during the transition which was absolutely vital due to the size of the changes required.

# Conclusion
The speed boost to the game was huge I was starting to hit 1000fps during a level1.

Memory footprint now clearly rose and fell when levels were loaded and unloaded.

An uneasy feeling I had of not fully understanding a technology I was using was gone.
