({
	/*
	* fireRouteChangeStartEvent
	* @description	This will invoke the fireRouteChangeStartEvent and passes along
	*				the necesarry details to render the intended Route.
	* @param {String}	routerName		Name of the router the intended route
	*									belongs to
	* @param {String}	historyIndex	Index value of the intended Route in
	*									history Array
	*/
	fireRouteChangeStartEvent: function(cmp, e, h, routerName, historyIndex) {
        var routeChangeStartEvent = $A.get('e.c:routeChangeStart'),
            path = cmp.get('v.history')[historyIndex].path;
        routeChangeStartEvent.setParams({routerName: routerName, historyIndex: historyIndex, path: path});
        routeChangeStartEvent.fire();
	}
})
