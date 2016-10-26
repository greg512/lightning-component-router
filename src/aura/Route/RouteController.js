({
	/*
	* initHandler
	* @Description	Handler for the component init event. If this Route is the
	*				default for Router (meaning the path ends with /), this Route
	*				will be rendered initially.
	*/
	initHandler: function(cmp, e, h) {
		var isDefaultPath = cmp.get('v.path').lastIndexOf('/') === cmp.get('v.path').length - 1;
		if(isDefaultPath) h.renderRoute(cmp, e, h);
	},
	/*
	* handleRouteChangeStart
	* @Description	Handler for the routeChangeStart event. Depending on the routeChangeStart
	*				payload, it will parse out route paramters and render this route, unrender
	*				the Route, or do nothing if event is intended for a different Router. in the
	*				application.
	*/
	handleRouteChangeStart: function(cmp, e, h) {
		var newPath = e.getParam('path'),
			routePath = cmp.get('v.path'),
			label = e.getParam('label'),
            newPathRouterName = e.getParam('routerName'),
            routeRouterName = routePath.indexOf('/') > 0 ? routePath.split('/')[0] : '',
            hasRouteParam = routePath.indexOf(':') > 0,
            routeParams = [];
		cmp.set('v.label', label);
        if(hasRouteParam) {
			routeParams = h.getRouteParams(routePath, newPath);
            newPath = newPath.slice(0, routePath.indexOf(':'));
            routePath = routePath.slice(0, routePath.indexOf(':'));
        }
		if(newPath === routePath) {
			h.renderRoute(cmp, e, h, e.getParam('path'), routeParams);
		} else if(newPathRouterName === routeRouterName) {
			h.unrenderRoute(cmp, e, h);
		}
	}
})
