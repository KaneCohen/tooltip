# Tooltip

## Tiny simplistic tooltip plugin for jquery

Demo: <http://jsfiddle.net/DNPTx/>

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

Use as follows:

````javascript
$().tip({
	showTime: 200,
	hideTime: 1000,
});
````


-----

## Styling

Nothing in options. Use css.

-----

## Extra

You don't have to reinitialize plugin every time you add new elements with tooltips to the DOM.
This plugin binds it's listeners to document, so everything will work just fine. However it may be a negative if you want multiple
running instances with different options.
