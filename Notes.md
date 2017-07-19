# Prerequisites

The book Functional Reactive Programming by Stephen Blackheath and Anthony Jones is required reading. You'll use it both to understand sodium in particular and frp in general. Buy it here: [https://www.manning.com/books/functional-reactive-programming](https://www.manning.com/books/functional-reactive-programming)

However, the book has not been updated to cover the typescript port (even though Stephen wrote that as well) and the code samples are often not directly translatable to typescript for various reasons (heavy use of `Optional`, for example). The sections on IO and gaming are also not totally portable to a pixi/web framework. Nevertheless, the book serves as both a great introduction/explanation to sodium+frp and also a direct reference for looking up primitives and how to use them, even for the typescript port.

It's also worth mentioning that there are useful comments in the [sodium-typescript repo](https://github.com/SodiumFRP/sodium-typescript/tree/master/src/lib) directly. No doubt these will be exported to proper api docs at some point, but for now it's worth looking at them for usage guidelines.

# Architecture

## IO and side effects

_Short version:_

To quote [Avi Block](http://github.com/blocka), sometimes it's not about total purity - but rather about "pushing side effects to the edge".

This is a very helpful direction to keep in mind. Side effects are unavoidable, ultimately, and when doing highly interactive things it can be tricky to keep them away from polluting the core logic. The goal is often not about elimination, but compartmentalization.

Specifically, it's usually about compartmentalizing to the edges. You tend to have an interactive sandwhich with frp in the middle. Scratch that, it's more like a burrito. The point is though that you need the containers and bridge to the outside world, but they shouldn't be mixed in with the juicy stuff.

_Longer version:_

We want everything to fit neatly into a clear framework where IO is dealt with in one place and everything else in another - but my numerous attempts to abstract and wrangle this in a universal way failed to provide the benefits one might imagine.

This basically broke down in a few areas:
1. Trying to fit everything into frp
2. Trying to abstract everything into reusable components
3. Trying to mix frp with other patterns that didn't mesh well
4. Unnecessary fear of mixing fp/frp with other approaches that _do_ fit well.
5. Wanting to use non-frp third-party frameworks (PIXI)

To give an example that seemed good at first and then broke down (_feel free to glance over this, it's just to illustrate a point_): I thought maybe there should be an immutable Transform class that can be derived from a PIXI DisplayObject, and contain a pointer to that object (or reference to an id which can be looked up in a hash table), and then the Transform goes through the fp/frp pipeline until it's done and then gets applied - all through common utilities and clear boundry lines.

Sounds good, right?

This worked beautifully at first, and then had numerous issues when things started expanding. It was cleaner to just use local typed objects to describe the particular types of transforms or motions needed for the local logic since there was no real global overlap. Abstracting did not help in any way. Maintaining a hash table might be useful in some scenarios - but not as a global way of applying things.

What _did_ help was using interfaces and classes as containers, and being able to selectively choose non-frp constructs where needed - and even _gasp_ mutable variables where it made sense. 

That should be taken with a grain of salt though. I found that keeping things neat took an extra step of thinking where to place those - and it was usually about keeping them right at initial setup or the end of a listen. That extra effort really paid off to let frp shine as a great way to drive the core logic.

In practice, I think this basically _is_ a good approach - but not as a generic abstracted set of utilities. Rather, it typically makes more sense to treat this more as an _architectural approach_ than a specific set of classes. I wouldn't even call it a pattern, it's more like a headspace.

Still, there are patterns that seem to sortof emerge from this, so...

## A reusable pattern

I'm landing on so far on something basically like this pseudocode:

```

interfaces (to pass around data as js objects - which should be frozen)

export class (with _simple_ inheritence - e.g. a base class that automatically calls dispose() when necessary- and that's it!) 
    constructor()
        setup i/o
        setup required data structs (all const and/or private)
        start transactions
            create immutable data from anything
            pipe it through frp logic (send, snapshot, map, etc.)
            this.unlistens = listen()
                side effects
                create new classes, add them as children, etc.
    dispose()
        children.dispose()
        stop send triggers
        cleanup private data
        this.unlistens()
```

Since this is still early on and I haven't built a large-scale application with this approach yet, it might need adaptation- but it's working so far :D

# Listen

## Listen is the end - and it's really for side-effects

This is a major paradigm shift compared to how `listen()` plays a role in typical oop event-driven architectures.

In frp, listen() is _not_ where you start the processing - it's where you listen to the final result of the processing, and then do something with the results (e.g. cause side-effects).

This is a crucial distinction and starting with this in mind can save a lot of pain in learning to think about frp the right way (e.g. there should ideally be no frp _inside_ of listen())

At the same time, since listen() is usually for side effects and fp says that side effects are "bad", one can become unsure about whether or not they should be using listen() at all!

Think of it this way - listen is often a requirement, it's the flip-side of send() (see next section). The point here is only that _`listen()` should be called at the end of the frp pipeline for a given `send()`_. It's kindof like forEach in vanilla js, in a way.

See Steve's helpful analogy here: [http://sodium.nz/t/understanding-listen/171/2](http://sodium.nz/t/understanding-listen/171/2)

## Listeners need management

Two rules:

1. send() requires that a listen() exist at the end of the pipeline
2. listen() is not automatically cleaned up if you start deleting references

This means the following:

1. store a unlisten() when you create the listen() (it's the result of calling listen()), and make sure to unlisten() when you dispose things
2. when you call unlisten(), if it's the last listener for the associated sink, make sure that the sink isn't going to send anymore
3. "dummy listeners" can be useful in certain scenarios, but it might be good to avoid that as a way of forcing better management
4. Pipeline is important. You only need to listen() at the end - so if the stream is feeding into more frp you do not need to listen on that stream, only where it ends up.

# Switch

## Switch is more of a flatten() than a way to change things, usually

Changing things is inherent in frp itself. i.e. a changing menu screen might be represented just fine by a `Cell<Menu>` and be triggered by a `Stream<MenuChoice>`.

Use switch where you need changes of changes. That's inherently complicated and the use-case switch is designed for. When you do need it, it is awesome!

# Cells

Even though Cells are very basic, I felt I needed some reminders of how to use them

## Updating a cell based on a stream

There are two ways to do this:

1. Define the cell as a hold() of the stream
2. Snapshot the cell when the stream triggers - and update the value via snapshot() itself

There is a potential gotcha here where one might think that snapshot1(), instead of snapshot(), will update the cell automatically.

Consider this example:

```
//Failure - only outputs 0
Transaction.run((): void => {
    let stream = new StreamSink<number>();
    let cell = new CellLoop<number>();
    let sUpdate = stream.snapshot1(cell);

    cell.loop(sUpdate.hold(0));

    cell.listen(n => console.log(n));

    setInterval(() => stream.send(Date.now()), 100);
});
```

This fails because sUpdate is not actually having its values changed anywhere.

Either of these approaches could work instead:

```
//Success - outputs updates
Transaction.run((): void => {
    let stream = new StreamSink<number>();
    let cell = new CellLoop<number>();
    let sUpdate = stream.snapshot(cell, (a, b) => a);

    cell.loop(sUpdate.hold(0));

    cell.listen(n => console.log(n));

    setInterval(() => stream.send(Date.now()), 100);
});
```

```
//Success - outputs updates
Transaction.run((): void => {
    let stream = new StreamSink<number>();
    let cell = stream.hold(0);

    cell.listen(n => console.log(n));

    setInterval(() => stream.send(Date.now()), 100);
});
```

## hold is at the end of a transaction

This is a gotcha than can cause some headache when relying on cells for gate() for example.

See [this test](src/tests/sodium/gate/GateTest.ts) where `filter` gets the correct value, but `gate` is getting the stale value