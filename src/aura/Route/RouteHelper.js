({
	/*
	* renderRoute
	* @Description	Create the component associated with this Route and render
	* @param {Object}	routeParam	A route paramater that's parsed from the to
	*								attribute of the Link component. A route parameter
	*								is designated by a colon. <Link to="routepath/:id" ... />
	*/
	renderRoute: function(cmp, e, h, routeParam) {
		var componentName = cmp.get('v.component');
		if(componentName) {
			$A.createComponent(componentName, {}, newComponentHandler);
		} else {
			//TODO: how to handle this error?
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
                if(!$A.util.isUndefined(routeParam)) {
                    var paramStartIndex = path.indexOf(':'),
                    	paramName = path.slice(paramStartIndex + 1);
                    eventPayload.path = path.slice(0, paramStartIndex) + routeParam;
                    newCmp.set('v.' + paramName, routeParam);
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
	}
})
