# Lightning Component Router
A component router for the [Lightning Component Framework](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/intro_framework.htm). This isn't battle tested, so use at your own risk. It borrows heavily from the design of React Router.

Install with [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t50000000EqKD).

## Why?
Routers are an essential tool in building single page applications and it's currently a missing feature with lightning components.

## How Does it Work?
It's pretty simple. You can set up your routes inside a component like this:

```html
<lcr:Router>
    <lcr:Route name="Home" path="/" component="c:home" />
    <lcr:Route name="About" path="/about" component="c:about" />
    <lcr:Route name="Contact" path="/contact" component="c:contact" />
</lcr:Router>
```

The `<lcr:Router>` component represents a connected group of routes. In this example you have three routes: Home, About and Contact. The `component` attribute must be the name of an existing component. The `path` value must be unique.

See how the Home route `path` value is a single forward slash? This is how you set the default Route for a Router. In this scenario, the c:home component will be initially rendered.

At this point there's no way to navigate to other routes. You can do this with the `Link` component:

```html
<ul>
    <li><lcr:Link to="/">Home</lcr:Link>
    <li><lcr:Link to="/about">About</lcr:Link>
    <li><lcr:Link to="/contact">Contact</lcr:Link>
</ul>
```

As you click each link rendered by the Link component, the Routes will render and unrender.

### A Major Drawback: Back/Forward Browser Navigation
Unfortunately the framework prevents you from manipulating the browser history or changing the url for security reasons. If you use the back or forward navigation tools in your browser, it won't honor the navigation history inside of your Router. The Router maintains its own history and provides the tools to manage your own back/forward navigation and breadcrumbs from within the application container component, but that's the best that can be done for now.

This is critical Router functionality, but there's [hope for the future](http://documentation.auraframework.org/auradocs#reference?topic=api:AuraHistoryService).

## Multiple Routers and Nested Routers
You can have multiple routers and nested routers but you have to give the Router a unique name:

```html
<lcr:Router name="nested-router">
```
And you have to include the Router name in the `Route` and `Link` components:
```html
<lcr:Router name="nested-router">
    <lcr:Route name="Nested Route Home" path="nested-router/" component="c:nestedComponent" />
</lcr:Router>

<lcr:Link to="nested-router/">Go to Route</lcr:Link>
```

## Setting Component Attributes
Assume you have a component called c:ContactDetail with an attribute named contactId and you want to set the contactId when you navigate to the Route associated with the c:ContactDetail component:
```html
<lcr:Router>
    <lcr:Route name="Contact Detail" path="/contact/:contactId" component="c:ContactDetail" />
</lcr:Router>

<Link to="/contact/0035000002iiVc4AAE" />
```
This will set contactId to `0035000002iiVc4AAE`, but more than likely you want to do something with it when the value is set. Use the aura:handler component in c:ContactDetail to listen for changes to contactId and perform the necessary actions:
```html
<aura:handler name="change" value="{!v.contactId}" action="{!c.contactIdChangeHandler}"/>
```
## Route Change Animations
It's possible with some custom CSS and a custom renderer on the components associated with your route. I'm thinking about adding support for common route transition animations to the Route component so it doesn't have to be done for each component associated with a Route.

For now you can create some css classes in the style resource:
```css
.THIS.fade {
    transition: .2s opacity linear;
}
.THIS.fade--on {
    opacity: 0;
}
```
And add a custom renderer:
```javascript
({
    afterRender: function(cmp, h) {
        this.superAfterRender();
        var TRANSITION_CLASS = 'fade--on';
        window.setTimeout(function() {
            $A.util.toggleClass(cmp, TRANSITION_CLASS);        
        }, 0);

    }
})
```
Then in your outermost element in the component:
```html
<aura:component>
    <div class="fade fade--on">
        <!-- your component stuff here -->
    </div>
</aura:component>
```
Now this component will fade in!

## Managing Router History & Navigation
There are some events you can fire and listen to in order to manage history and navigation inside your application.

### The routeNavBack and routeNavForward Events
Fire the `routeNavBack`  and `routeNavForward` events to navigate back and forward, respectively. Indicate in your component that it will fire the events:
```html
<aura:registerEvent name="routeNavBack" type="lcr:routeNavBack" />
<aura:registerEvent name="routeNavBack" type="lcr:routeNavForward" />
```
From your controller or helper resource, fire the event:
```javascript
handleBackButtonPress: function(cmp, e, h) {
	var routeNavBackEvent = $A.get('e.lcr:routeNavBack');
    routeNavBackEvent.setParams({routerName: 'router-name'});
    routeNavBackEvent.fire();
},
handleForwardButtonPress: function(cmp, e, h) {
    var routeNavForwardEvent = $A.get('e.lcr:routeNavForward');
    routeNavForwardEvent.setParams({routerName: 'router-name'});
    routeNavForwardEvent.fire();
},
```
### Listening to the routeHistoryChangeSuccess Event
The `routeHistoryChangeSuccess` event is fired when the Router history changes. It includes the Router name, an Array of objects where each object represents a Route in the Router's history and a history index value representing the active index of the history array. For example, if the history Array has 5 items and the history index is 4, then active Route in the history array is the last item. If you fired the `routeNavBack` event, the routeHistoryChangeSuccess event would send a new payload with the history index value as 3.

The information provided from the routeHistoryChangeSuccess event can be used to set a conditional active class in your navigation or to build a breadcrumbs component.
