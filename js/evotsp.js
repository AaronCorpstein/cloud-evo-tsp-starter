(function evoTSPwrapper($) {

    // You'll need to replace this with the URL you get when you
    // deploy your API Gateway.
    const baseUrl = 'https://y7n4d21u35.execute-api.us-east-1.amazonaws.com/prod'
    console.log(`The base URL is ${baseUrl}.`);

    // Set up the functions to be called when the user clicks on any
    // of the three buttons in our (very simple) user interface.
    // We provided `randomRoutes()` for you, but you have to implement
    // `getBestRoutes()` and `getRouteById()`.
    $(function onDocReady() {
        $('#generate-random-routes').click(randomRoutes);
        $('#get-best-routes').click(bestRoutes);
        $('#get-route-by-id').click(routeById);
    });

    // This generates a single random route by POSTing the
    // runId and generation to the `/routes` endpoint.
    // It's asynchronous (like requests across the network
    // typically are), and the showRoute() function is called
    // when the request response comes in.
    function randomRoute(runId, generation) {
        $.ajax({
            method: 'POST',
            url: baseUrl + '/routes',
            data: JSON.stringify({
                runId: runId,
                generation: generation
            }),
            contentType: 'application/json',
            // When a request completes, call `showRoute()` to display the
            // route on the web page.
            success: showRoute,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error(
                    'Error generating random route: ', 
                    textStatus, 
                    ', Details: ', 
                    errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when creating a random route:\n' + jqXHR.responseText);
            }
        })
    }

    // Generates a collection of new routes, where the number to generate
    // (and the runId and generation) are specified in the HTML text
    // fields. Note that we don't do any kind of sanity checking here, when
    // it would make sense to at least ensure that `numToGenerate` is a
    // non-negative number.
    //
    // This uses the `async` library (https://caolan.github.io/async/v3/docs.html)
    // to place the requests asynchronously, so we can benefit from parallel
    // computation on the AWS end. You can get burned, though, if you set
    // numToGenerate too high as there are a host of AWS capacity limits that
    // you might exceed, leading to a failed HTTP requests. I've had no trouble
    // with up to 500 at a time, but 1,000 regularly breaks things.
    //
    // We never do anything with the `event` argument because we know what
    // button was clicked and don't care about anything else.
    function randomRoutes(event) {
        const runId = $('#runId-text-field').val();
        const generation = $('#generation-text-field').val();
        const numToGenerate =$('#num-to-generate').val(); // Global feild
        // Reset the contents of `#new-route-list` so that it's ready for
        // `showRoute()` to "fill" it with the incoming new routes. 
        $('#new-route-list').text('');
        // 
        async.times(numToGenerate, () => randomRoute(runId, generation));
    }
	
	function bestRoutes(event) {
		const runId = $('#runId-text-field').val();
        const generation = $('#generation-text-field').val();
        const numToReturn =$('#num-best-to-get').val();
         
        $('#get-best-routes').text('');
        
        async.times(numToReturn, () => getBestRoutes(runId, generation, numToReturn));
    }
	
	function routeById(event) {
		//const runId = $('#runId-text-field').val();
        //const generation = $('#generation-text-field').val();
        //const numToReturn =$('#num-to-generate').val();
         
        $('#get-route-by-id').text('');
        
        async.times(1, () => getRouteById());
    }

    // When a request for a new route is completed, add an `<li>…</li>` element
    // to `#new-route-list` with that routes information.
    function showRoute(result) {
        console.log('New route received from API: ', result);
        const routeId = result.routeId;
        const length = result.length;
        $('#new-route-list').append(`<li>We generated route ${routeId} with length ${length}.</li>`);
    }

	function showBestRoutes(result){
		console.log('New route received from API: ', result);
		result.forEach(element => {
			const {routeId, length} = element;
			$('#best-route-list').append(`<li>We found the best route ${routeId} with length ${length}.</li>`);
		})
	}
	
	function showRouteById(result) {
        console.log('Found route received from API: ', result);
        const routeId = result.routeId;
        const length = result.length;
        $('#route-by-id-elements').append(`<li>We found route ${routeId} with length ${length}.</li>`);
	}
    // Make a `GET` request that gets the K best routes.
    // The form of the `GET` request is:
    //   …/best?runId=…&generation=…&numToReturn=…
    // This request will return an array of
    //    { length: …, routeId: …}
    // You should add each of these to `#best-route-list`
    // (after clearing it first).
	
    function getBestRoutes(runId, generation, numToReturn) {
        //alert('You need to implement getBestRoutes()');
		
		$.ajax({
            method: 'GET',
            url: baseUrl + `/best?runId=${runId}&generation=${generation}&numToReturn=${numToReturn}`,
            // When a request completes, call `showRoute()` to display the
            // route on the web page.
            success: showBestRoutes,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error(
                    'Error finding best route: ', 
                    textStatus, 
                    ', Details: ', 
                    errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when finding the best route:\n' + jqXHR.responseText);
            }
        })
    }

    // Make a `GET` request that gets all the route information
    // for the given `routeId`.
    // The form of the `GET` request is:
    //   …/routes/:routeId
    // This request will return a complete route JSON object.
    // You should display the returned information in 
    // `#route-by-id-elements` (after clearing it first).
    function getRouteById() {
        //alert('You need to implement getRouteById()');
		const routeId = $('#route-ID').val();
		
		$.ajax({
            method: 'GET',
            url: baseUrl + '/routes' + `/${routeId}`,
            // When a request completes, call `showRoute()` to display the
            // route on the web page.
            success: showRouteById,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error(
                    'Error getting route by ID: ', 
                    textStatus, 
                    ', Details: ', 
                    errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when requesting a route by its ID:\n' + jqXHR.responseText);
            }
        })
    }

}(jQuery));
