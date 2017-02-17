({
	/*
	* renderRoute
	* @Description	Create the component associated with this Route and render
	* @param {String}	routePath	Route path value. Used in routeChangeSuccessEvent payoad.
	* @param {Object}	routeParam	A route paramater that's parsed from the to
	*								attribute of the Link component. A route parameter
	*								is designated by a colon. <Link to="routepath/:id" ... />
	*/
	renderRoute: function(cmp, e, h, routePath, routeParams) {
		var componentName = cmp.get('v.component'),
			hasRouteParams = cmp.get('v.hasRouteParams');
		if(!routeParams) routeParams = {};
		if(componentName) {
			$A.createComponent(componentName, routeParams, newComponentHandler);
		} else {
			//TODO: how to handle this error?
			console.log('heres the error');
			throw new Error('ERROR');
		}

		function newComponentHandler(newCmp) {
			if(cmp.isValid()) {
				var body = cmp.get('v.body'),
                    routeChangeSuccessEvent = $A.get('e.c:routeChangeSuccess'),
                    path = cmp.get('v.path'),
                    name = cmp.get('v.name'),
					label = cmp.get('v.label'),
                    historyIndex = e.getParam('historyIndex'),
                    eventPayload = {path: path, name: name, label: label},
                    componentAttrs = cmp.get('v.componentAttributes');
                if(componentAttrs !== '{}') {
                    for(var attr in componentAttrs) {
                        newCmp.set('v.' + attr, componentAttrs[attr]);
                    }
                }

                if(hasRouteParams) {
                    eventPayload.path = routePath;
                }
                if(historyIndex > -1) eventPayload.historyIndex = historyIndex;
                routeChangeSuccessEvent.setParams(eventPayload);
				body = [newCmp];
				cmp.set('v.body', body);
                routeChangeSuccessEvent.fire();
                /*var TRANSITION_CLASS = 'fade--on';
                window.setTimeout(function() {
                    $A.util.toggleClass(cmp, TRANSITION_CLASS);
                }, 0);*/
			}
		}

	},
	/*
	* unrenderRoute
	* @Description	Unrender the previously rendered component
	*/
	unrenderRoute: function(cmp, e, h) {
        var routeCmp = cmp.get('v.body').length > 0 ? cmp.get('v.body')[0] : undefined;
        if(routeCmp) {
            /*var TRANSITION_CLASS = 'fade--on';
            window.setTimeout(function() {
                $A.util.toggleClass(cmp, TRANSITION_CLASS);
            }, 0);*/
            cmp.set('v.body', []);
        }
	},
	/*
	* getRouteParams
	* @Description	constructs and returns an object represeting route parameters as key value pairs
	* @Param	{String}	routePath	The path for this route. Includes parameter names (/route/path/:param1/:param2)
	* @Param	{String}	pathWithParams	Path with param values (/route/path/1234/5678)
	*/
	getRouteParams: function(routePath, pathWithParams) {
		var routeParamNames = routePath.split('/:'),
			routeParamValues,
			routeParams,
			routeParam;
			routeParamNames.shift();
		routeParamValues = pathWithParams.split('/');
		if(routeParamValues[routeParamValues.length - 1] === '') routeParamValues.pop();
		routeParamValues.splice(0, routeParamValues.length - routeParamNames.length);
		routeParams = routeParamNames.reduce(function(curVal, prevVal, i) {
			curVal[routeParamNames[i].replace('/', '')] = routeParamValues[i];
			return curVal;
		}, {});
		return routeParams;
	}
})
