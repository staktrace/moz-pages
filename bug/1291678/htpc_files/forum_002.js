window.Responsive && Responsive.addBehaviour((function()
{
	/**
	 * Make the collapsible reaction/new topic fields collapsible in, new topic, new reply and update_message
	 *
	 * TODO: We can improve the performance and only do this on the 3 pages where it's' actually needed
	 * but to do that we need to creater another responsive behaviour class and only add that behavious
	 * on the needed pages. I don't think it's really needed now, but we can do this in the future
	 */
	var initCollapsibleReactionFields = function()
	{
		var toggleFunc = function(e)
		{
			toggleClass(this.parentNode, 'visible');

			// prevent toggling checkbox
			var input = e.target.htmlFor && getById(e.target.htmlFor);
			if (input && input.type == 'checkbox')
			{
				e.preventDefault();
			}
		};

		Selector('.collapsible > td.label > label').forEach(
			function(label)
			{
				addEvent(label.parentNode, 'click', toggleFunc);

				// It's a bit awkward to have '> Smilies:' collapsible, so make it '> Smilies', we don't revert
				// this in the update() as I think it doesn't matters that much
				label.firstChild.nodeValue = label.firstChild.nodeValue.replace(/:$/, '');
			}
		);
	},

	/**
	 * Make the folders in the bookmarks/pm's etc expandable and collapsable
	 */
	makeFoldersExpandable = function()
	{
		var folderHeader = Selector('#folders h4')[0];
		if (folderHeader)
			addEvent(folderHeader, 'click', toggleClass.bind(null, folderHeader.parentNode, 'expanded'));
	},

	/**
	 * Additional message behaviours
	 */
	responsiveMessageBehaviourHandler = function(el)
	{
		Selector('.message_actions', el).forEach(
			function(el)
			{
				Responsive.generateDropDownList(el, '', 'Acties:');
			}
		);
	};

	return {
		/**
		 * Triggered when setting up the page
		 */
		init: function()
		{
			var currentDeviceGrade = Responsive.getCurrentDeviceGrade();

			// perform updates
			this.update({from: 'A', to: currentDeviceGrade});

			// make dropdown list of forum actions list
			Responsive.generateDropDownList(Selector('#forumheading .quicklinks')[0], '', 'Quicklinks:');

			// make dropdown list of message actions lists
			if (window.messageBehaviourHandler && messageBehaviourHandler.getSettings())
			{
				messageBehaviourHandler.addHandler(responsiveMessageBehaviourHandler);

				// call for all already existing messages
				responsiveMessageBehaviourHandler();
			}

			// Misc init functions
			makeFoldersExpandable();
			initCollapsibleReactionFields();

			// set up collapsing of the relationbox
			var relationBox = getById('tweakbase_relations');
			if (relationBox)
			{
				addClass(relationBox, 'collapsed');
				addEvent(Selector('h2', relationBox)[0], 'click', toggleClass.bind(null, relationBox, 'collapsed'));
			}
		},

		/**
		 * Triggered on device grade change
		 */
		update: function(e)
		{
		}
	}
}()));
