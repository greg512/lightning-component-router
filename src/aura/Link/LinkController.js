({
	/*
	* linkClickHandler
	* @Description	Click handler for the anchor element in the Link component.
	*				This will fire the routeChangeAttempt event. Any existing Routers
	*				will listen for this event and determine if action should be taken.
	*/
	linkClickHandler: function(cmp, e, h) {
        e.preventDefault();
		var routeChangeEvent = $A.get('e.c:routeChangeAttempt'),
			to = cmp.get('v.to'),
			label = cmp.get('v.label'),
            routerName = to.indexOf('/') > 0 ? to.split('/')[0] : '';
        routeChangeEvent.setParams({routerName: routerName, path: to, label: label});
		routeChangeEvent.fire();
	}
})
