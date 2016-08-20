({
	/*
	* handleRouteChangeAttempt
	* @description	Invoked when routeChangeAttempt is fired. If the router name
	*				from the event payload matches the current Router's name, the Router
	*				will fire the routeChangeStartEvent.
	*/
	handleRouteChangeAttempt: function(cmp, e, h) {
        var routerName = cmp.get('v.name'),
            eventRouterName = e.getParam('routerName'),
			newRoutePath = e.getParam('path');
        if(routerName === eventRouterName) {
			var routeChangeStartEvent = $A.get('e.c:routeChangeStart');
            routeChangeStartEvent.setParams({path: newRoutePath, routerName: routerName});
            routeChangeStartEvent.fire();
        }
	},
	/*
	* handleRouteChangeSuccess
	* @description	Invoked when routeChangeSuccess is fired. The primary
	*				purpose is to update the navigation history and fire the
	*				routeHistoryChangeSuccess event.
	*/
    handleRouteChangeSuccess: function(cmp, e, h) {
        var path = e.getParam('path'),
            routerName = path.indexOf('/') > 0 ? path.split('/')[0] : '',
            newHistoryIndex = e.getParam('historyIndex'),
            updateHistory = $A.util.isUndefined(newHistoryIndex);
        if(routerName === cmp.get('v.name')) {
            var routeHistoryChangeSuccessEvent = $A.get('e.c:routeHistoryChangeSuccess');
            if(updateHistory) {
                var historyItem = {name: e.getParam('name'), path: e.getParam('path')},
                    history = cmp.get('v.history'),
                    currentHistoryIndex = cmp.get('v.historyIndex'),
                    lastIndexValue = history.length - 1;
                if(currentHistoryIndex !== lastIndexValue) {
                    //This is the scenario where a user has clicked back at least once and then selects a Link Route
                    //This emulates standard browser behavior where you lose forward history
                    //and it gets replaced with the new Route
                    history.splice(currentHistoryIndex + 1);
                }
                history.push(historyItem);
                cmp.set('v.history', history);
                cmp.set('v.historyIndex', history.length - 1);
            } else {
                cmp.set('v.historyIndex', newHistoryIndex);
            }
            routeHistoryChangeSuccessEvent.setParams({
                history: cmp.get('v.history'),
                historyIndex: cmp.get('v.historyIndex'),
                routerName: cmp.get('v.name')
            });
            routeHistoryChangeSuccessEvent.fire();
        }
    },
	/*
	* handleRouteNavBack
	* @description	Invoked when routeNavBack is fired. This will invoke
	*				the fireRouteChangeStartEvent from the helper resource
	*				which ultimately fires the routeChangeStartEvent intended
	*				for the target Route.
	*/
    handleRouteNavBack: function(cmp, e, h) {
        var routerName = cmp.get('v.name'),
            eventRouterName = e.getParam('routerName') || '';
        if(routerName === eventRouterName) {
            var newHistoryIndex = cmp.get('v.historyIndex') - 1;
            if(newHistoryIndex > -1) h.fireRouteChangeStartEvent(cmp, e, h, routerName, newHistoryIndex);
        }
    },
	/*
	* handleRouteNavForward
	* @description	Invoked when routeNavForward is fired. This will invoke
	*				the fireRouteChangeStartEvent from the helper resource
	*				which ultimately fires the routeChangeStartEvent intended
	*				for the target Route.
	*/
    handleRouteNavForward: function(cmp, e, h) {
        var routerName = cmp.get('v.name'),
            eventRouterName = e.getParam('routerName') || '';
        if(routerName === eventRouterName) {
            var newHistoryIndex = cmp.get('v.historyIndex') + 1,
                historyLength = cmp.get('v.history').length;
            if(newHistoryIndex !== historyLength) h.fireRouteChangeStartEvent(cmp, e, h, routerName, newHistoryIndex);
        }
    },
	/*
	* handleRouteHistoryChange
	* @description	Invoked when routeHistoryChange is fired. The routeHistoryChange
	*				event includes the new history index to navigate to. This will invoke
	*				the fireRouteChangeStartEvent from the helper resource
	*				which ultimately fires the routeChangeStartEvent intended
	*				for the target Route.
	*/
    handleRouteHistoryChange: function(cmp, e, h) {
        var routerName = cmp.get('v.name'),
            eventRouterName = e.getParam('routerName');
        if(routerName === eventRouterName) {
            var newHistoryIndex = e.getParam('historyIndex');
            h.fireRouteChangeStartEvent(cmp, e, h, routerName, newHistoryIndex);
        }
    },
})
