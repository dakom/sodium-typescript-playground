# Listen and Send

## Listen is the end - and it's really for side-effects

This is a major paradigm shift compared to how `listen()` plays a role in typical event-driven architectures.

In frp, listen() is _not_ where you start the processing - it's where you listen to the final result of the processing, and then do something with the results (e.g. cause side-effects).

This is a crucial distinction and starting with this in mind can save a lot of pain in learning to think about frp the right way (e.g. there should ideally be no frp _inside_ of listen())

At the same time, since listen() is usually for side effects and fp says that side effects are "bad", one can become unsure about whether or not they should be using listen() at all!

Think of it this way - listen is an absolute requirement, it's the flip-side of send() (see next section). The point here is only that _`listen()` should be called at the end of the frp pipeline for a given `send()`_. It's kindof like forEach in vanilla js, in a way.

See Steve's helpful analogy here: [http://sodium.nz/t/understanding-listen/171/2](http://sodium.nz/t/understanding-listen/171/2)

## Listeners need management

Two rules:

1. send() requires that a listen() exist
2. listen() is not automatically cleaned up if you start deleting references

This means the following:

1. store a unlisten() when you create the listen() (it's the result of calling listen()), and make sure to unlisten() when you dispose things
2. when you call unlisten(), if it's the last listener for the associated sink, make sure that the sink isn't going to send anymore
3. "dummy listeners" can be useful in certain scenarios, but it might be good to avoid that as a way of forcing better management

# Switch

## Switch is more of a flatten() than a way to change things

Changing things is inherent in frp itself. i.e. a changing menu screen might be represented just fine by a `Cell<Menu>` and be triggered by a `Stream<MenuChoice>`.

It's tempting to think of making the menu object itself into some kind of cell or stream so that it can be changed via switch(), but this is needless complication.

Use switch where you need changes of changes

# Cells

## Updating a cell based on a stream

There are two ways to do this:

1. Define the cell as a hold() of the stream
2. Snapshot the cell when the stream triggers - and update the value via snapshot() itself

There is a potential gotcha here where one might think that snapshot() will update the cell automatically.

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

This fails because sUpdate is not actually being updated anywhere.

Either of these approaches could work instead:

```
//Success - outputs updates (cell is updated via snapshot stream)
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
//Success - outputs updates (cell is updated inherently via hold)
Transaction.run((): void => {
    let stream = new StreamSink<number>();
    let cell = stream.hold(0);

    cell.listen(n => console.log(n));

    setInterval(() => stream.send(Date.now()), 100);
});
```

# Architecture

## Automatic IO and side effects

We want everything to fit neatly into a clear framework where IO is dealt with in one place and everything else in another - but my numerous attempts to abstract this failed to provide the benefits one might imagine.

For a specific example, I thought maybe there should be an immutable Transform class that can be derived from a PIXI DisplayObject, and contain a pointer to that object (or reference to an id which can be looked up in a hash table), and then the Transform goes through the fp/frp pipeline until its done and then gets applied - all through common utilities and clear boundry lines.

In practice, this basically _is_ a good approach - but not as a generic abstracted set of utilities. Rather, it typically makes more sense to treat this more as an _architectural approach_ than a specific set of classes. The idea of getting an immutable object, manipulating that, and then applying it at the end is good - but the application is typically better handled via custom code that follows certain patterns rather than abstract base classes and such.

The pattern I'm landing on so far is basically like this, where these classes are mutable containers and not referentially transparent (other types of classes can be used in the frp logic part, of course, and they are analogous to "immutable data from anything"):

```
constructor()
    setup ui
    start transaction
        create immutable data from anything
        pipe it through frp logic (send, snapshot, map, etc.)
        this.unlisten = listen()
                side effects, create new classes, add them as children, etc.
dispose()
    children.dispose()
    stop this.*.send() triggers
    this.unlisten()
```

Since this is still early on and I haven't built a large-scale application with this approach yet, it might need adaptation- but it's working so far :D