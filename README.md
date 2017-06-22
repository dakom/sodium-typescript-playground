# Sodium-Typescript Playground

[![Build Status](https://travis-ci.org/dakom/sodium-typescript-playground.svg?branch=master)](https://travis-ci.org/dakom/sodium-typescript-playground)

[Live demo here](https://dakom.github.io/sodium-typescript-playground)

[Learning notes here](Notes.md)

This is a testing repo for learning sodium-typescript. There may be purposefully broken code to highlight things I'm still figuring out, for example, but all in all if the travis build is passing then it's probably fine to clone and tinker or whatever :)

As of right now, here's what the different modules are for:

## Simple

Moves a ball back and forth across the screen.
Creates a `Cell` via a snapshot of the ticker, and listens to that directly for render changes

## Bunnies

Conceptually it's the extension of Simple (and based on the PIXI Bunnymark).
Driving the bunnies the way it was done in Simple did _not_ work (there's a branch called bunnies-alt which still has some of that code). Speed slowed down _drastically_

However, sodium/frp could still be used to handle the main logic perfectly and the only real point of departure was storing the Motion data somewhere associated with each bunny. For the sake of convenience, it's stored on the bunny itself, but the update and render are pure and the motion data could easily be moved to some persistant lookup table.

Overall it's a win - the lesson learned is more about how to use each tool for the job rather than abandoning one for the other.

More related info and discoveries are in the "Architecture" section of the [Learning notes](Notes.md)

----

# TODO


## Switch

Demonstrating the use of switch with a visual example

## Draw

Test for drawing via PIXI rendertexture

## Select

Drag different items

## Draw + Select

Switch between drawing and selecting simultaneously

----

(note, the boilerplate webpack, typescript, etc. code is cloned from [here](https://github.com/dakom/html5-boilerplate/tree/barebones))