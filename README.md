# Sodium-Typescript Playground

[![Build Status](https://travis-ci.org/dakom/sodium-typescript-playground.svg?branch=master)](https://travis-ci.org/dakom/sodium-typescript-playground)

[Live demo here](https://dakom.github.io/sodium-typescript-playground)

This is my testing repo for learning and kicking the tires around [sodium-typescript](https://github.com/SodiumFRP/sodium-typescript). There may be purposefully broken code and some modules might disappear or be replaced over time... but feel free to clone and tinker or whatever!

I'm keeping some loose [Architectural / learning notes](Notes.md) for reference. In there you'll find some generic points as well as specifics on how to use the different primitives. If, like me, you're new to frp and are hitting some gotchas, I'd suggest giving those a glance.

# First Impressions

Sodium-frp should be much more famous. The idea behind it has led to other famous technologies, and is highly related to some very hot trends (functional programming on one side, reactive programming on the other). The fact that a stable typescript port exists is incredible.

However, the community is tiny. Literally, as of right now, there's only a few people actively involved on the discussion board and git repos, and when limiting to Typescript it gets even smaller, which to be honest was initially a cause for concern.

From building this real world test suite though - I am extremely impressed. My game-development background is coming from Flash/as3 and Unity/c#. Being forced to think more declaratively has been challenging but the end result is, indeed, much easier to "reason about" (to borrow a popular term from fp/react/etc.)

The coolest thing about all this is a bit hard to describe, but it's the same experience I had when I started writing Go. When something isn't elegant or idiomatic, you inherently get this gut feeling like you're not doing it right, and that there _is_ an elegant solution. Then, when you refactor to solve that, a big giant mess suddenly starts all working together and all these lines of code go out the window. See the sections on listen and architecture in the [learning notes](Notes.md) to get some clues about how to get that gut feeling.

Skeptics might read that and say that it's true for any programming platform... and I wouldn't debate it, but it's a different type of problem solving. It's a bit more like soduku and less like asteroids. I don't mean that in terms of fun, but I mean in terms of problem solving with code... I feel like with frp I'm spending _much_ more time refactoring carefully and thinking about the problem rather than blasting my way through a bunch of code till it just works (and then moving on).

Give it a try and you might have the same experience :)

# Modules

The meat of the code is generally in [src/app/modules](src/app/modules)

As of right now, here's what the different modules are for:

## Simple

Moves a ball back and forth across the screen.
Creates a `Cell` via a snapshot of the ticker, and listens to that directly for render changes

## Bunnies

Conceptually it's the extension of Simple (and based on the PIXI Bunnymark).
Driving the bunnies the way it was done in Simple did _not_ work. Speed slowed down _drastically_

See [Steve's post](http://sodium.nz/t/understanding-listen/171/5?u=dakom) for further discussion.

However, this should not be taken to mean that frp is broken or can't be used in situations like this. Rather, it means that a little bit of mutability sprinkled in at the end might be the right tool for the job - or perhaps one of Steve's other solutions

## Switch

Each character has its frame index updated, and the displayed texture is driven by a switch of the character+frame (cell of a cell)

This is rather elegant imho - ultimately the logic is driven by just a few lines of code.

## Draw

Drawing via PIXI rendertexture. This is an example of separating not just frp vs. ui, but separating the input out as well in a purer way.

## Move

Moving different items around where state is handled by the parent container (allowing for setting the other inactive items as well)

## Move + Draw (todo)

Combinding move and draw

# Future

----

There are some more simple modules I'd like to add that would be nice illustrations of how to use frp... not sure if I'll get to them

* Drum Machine / Sequencer (ticker driven by stream, samples driven by cells)

# Misc

The boilerplate webpack, typescript, etc. code is cloned from [here](https://github.com/dakom/html5-boilerplate/tree/barebones)