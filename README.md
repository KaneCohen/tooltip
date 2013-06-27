# Tooltip

## Tiny simplistic tooltip plugin for jquery

Demo: <http://jsfiddle.net/DNPTx/2/>

In order for tooltip to show, you must have a class "tip" on the element AND an attribute data-tip=""
which will contain you actual tooltip text:

````html
<span class="tip" data-tip="This is a question">What?</span>
````

Now that we have an HTML, we initialize plugin:

````javascript
$().tip();
````
-----

## Options

`showTime: 200` (default) in milliseconds. Control timing when tooltip shows after mouse cursor enters an element.
This behavious works only first time, then tooltip has to go through cooldown period. So, if you move your cursor very fast
to the other element with tooltip, tip will show without any delay.

`hideTime: 1000` (default) in milliseconds. This is our cooldown period. When tooltip is in "chill" mode, it won't show
as soon as your mouse enters element. First, it'll have to go through `showTime` timer.

`aside: true || false` (default). Show tooltip to the left or to the right of the element. 
`data-tip-aside="true"` - attribute on tipped element to force aside behavior.

`position: 'auto' || 'left' || 'right' || 'top' || 'bottom'`. Force tooltip psoition. 
`data-tip-position="left"`. Force tooltip position on this element.

`follow: 'x' || 'y' || 'xy' || false`. Tooltip will follow mouse on move based on one or boths axis. 
`data-tip-follow="x"`. Force tooltip to follow mouse on this element.

Use as follows:

````javascript
$('.tip').tip({
	showTime: 200,
	hideTime: 1000,
});

// Or
$().tip();
````


-----

## Styling

Nothing in options. Use css.

-----

## Extra

You don't have to reinitialize plugin every time you add new elements with tooltips to the DOM.
This plugin binds its listeners to document, so everything will work just fine. However it may be a negative if you want multiple
running instances with different options.
