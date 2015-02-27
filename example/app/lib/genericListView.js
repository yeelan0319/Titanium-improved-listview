/**
 * Create a native listview object
 *
 * @module lib/genericListView
 * @author <a href="mailto:yiranmao@gmail.com">Yiran Mao</a>
 * @version 1.0.0
 *  
 */

 /**
  * @typedef {object} module:lib/genericListView~listSectionItemTemplate
  * @property {string | object} display="oneColumn" - The display view of listItem. Range: ["oneColumn", "twoColumns", "twoColumnsWithSubtitle"], 
  * or user may define customized template object as long as it is comformed to {@link http://docs.appcelerator.com/titanium/3.0/#!/api/ItemTemplate ItemTemplate}
  * @property {boolean} swipable=false - The flag indicates whether the listItem support swipe show operation feature
  * @property {boolean} editable=true - The flag indicates whether user can see edit button on operation layer
  * @property {boolean} hasCheckbox=false - The flag indicates whether user can see checkbox to the left of listItem name and multi-select them
  * @property {string | false} hasIcon=false -  The flag indicates whether icon will show to the left of nameLabel
  * @property {string | object} rightComponent - The right component of the display view. Range: ["label", "switchButton"]
  * 
  */
 /**
  * @typedef {object} module:lib/genericListView~listItemEventHandler
  * @property {function} onSingletap - Action on singletap. "apply to checkbox" is only valid when itemTemplate set hasCheckbox = true.
  * @property {function} onEditClick - Action on edit clicked.
  * @property {function} onDeleteClick - Action on delete clicked.
  * @property {function} onSwitchChange - Action on switch state changed
  * @property {Array<object>} actionOnMultipleItems -  Define the button shown on navigation bar and corresponding action
  * @property {string} actionOnMultipleItems.title - <Platform: Android> Title show for the action
  * @property {Ti.UI.Button} actionOnMultipleItems.button - <Platform: iOS> Button show for the action
  * @property {function} actionOnMultipleItems.fn - Action when the button/title is clicked
  * 
  */
  /**
  * @typedef {object} module:lib/genericListView~listItemData
  * @property {string} idLabel - The value will be passed to the eventHandler function, so choose value that can uniquely identifier the object. Format {text: string}
  * @property {string} iconImageView - The path to listItem icon resource. Format {image: path}
  * @property {string} nameLabel - ListItem title. Format {text: string}
  * @property {string} subtitleLabel - ListItem subtitle. It will be shown in smaller grey font under title. Format {text: string}
  * @property {string} statusLabel - ListItem right label. Only will be displayed when rightComponent is set to "label". Format {text: string}
  * @property {boolean} switchButton -  ListItem default state for switch. Only will be displayed when rightComponent is set to "switchButton". Format {value: boolean}
  *
  */
 var MAXLISTLENGTHWITHOUTSEARCHBAR = 10;
 var OPERATIONBUTTONWIDTH = 60;
 var templates = {
	// Get the corresponding subtemplate within template with bindId. Template is just object with predefined requested field
	findbyBindId: function(template, bindId){
		var item = "";
		
		function findByBindIdHelper(template, bindId){
			if(template.bindId !== bindId){
				_.each(template.childTemplates, function(template){
					findByBindIdHelper(template, bindId);
				});
			}
			else{
				item = template;
			}
		}
		findByBindIdHelper(template, bindId);
		return item;
	},
	
	baseTemplate: {
		bindId: "item",
		type: "Ti.UI.View",
		properties:{
			width: Ti.UI.FILL,
			height: Ti.UI.FILL
		},
		events:{
			//no event
		},
	    childTemplates: [
	    	{   
	    		bindId: 'idLabel',                          
	            type: 'Ti.UI.Label',           
	            properties: {
	            	visible: false,
	            	font: {
						fontSize: "13dp"
					},
					color: "#333"
	            }
	        },
	        {                            
	            type: 'Ti.UI.View',
	            bindId: 'itemDisplay',
	            properties: {
	            	width: OS_IOS?Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformWidth/Ti.Platform.displayCaps.logicalDensityFactor,
					height: Ti.UI.FILL,
					layout: "horizontal",
					backgroundColor: "white"
	            },
	            events: {
	            	//onSingletap
	            	//onSwipe if swipable
	            },
	            childTemplates: []
	        }
	    ]
	},
	operationLayer: {
		bindId: "itemOperation",
		type: "Ti.UI.View",
		properties:{
			width: Ti.UI.SIZE,
			height: Ti.UI.FILL,
			layout: "horizontal",
			right: 0
		},
		events:{
			//no event 
		},
	    childTemplates: []
	},
	operation:{                           
        type: "Ti.UI.View",
		properties:{
			left: 0,
			width: OPERATIONBUTTONWIDTH,
			height: Ti.UI.FILL,
			backgroundColor: "#aaa"	
		},
		events:{
			//on operation click
		},
	    childTemplates: [
	    	{   
	    		type: 'Ti.UI.Label',
	            properties: {
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					font: {
						fontSize: "13dp"
					},
					color: "white"
	            }
	        }
	    ]
    },
	editOperation:{                           
        bindId: "itemEditOperation",
		type: "Ti.UI.View",
		properties:{
			left: 0,
			width: Ti.UI.SIZE,
			height: Ti.UI.FILL,
			backgroundColor: "#aaa"	
		},
		events:{
			//onEditClick
		},
	    childTemplates: [
	    	{   
	    		bindId: 'itemEditLabel',                       
	            type: 'Ti.UI.Label',
	            properties: {
	            	left: "10dp",
					right: "10dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					text: "Edit",
					font: {
						fontSize: "13dp"
					},
					color: "white"
	            }
	        }
	    ]
    },
    deleteOperation:{
        bindId: "itemDeleteOperation",
		type: "Ti.UI.View",
		properties:{
			left: 0,
			width: Ti.UI.SIZE,
			height: Ti.UI.FILL,
			backgroundColor: "#f00"
		},
		events:{
			//onDeleteClick
		},
	    childTemplates: [
	    	{    
	    		bindId: 'itemDeleteLabel',                      
	            type: 'Ti.UI.Label',      
	            properties: {
	            	left: "10dp",
					right: "10dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					text: "Delete",
					font: {
						fontSize: "13dp"
					},
					color: "white"
	            }
	        }
	    ]
    },
	oneColumn: { 
		bindId: "itemContainer",
		type: "Ti.UI.View",
		properties:{
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			touchEnabled: false
		},
		events:{
			//no event
		},
	    childTemplates: [
	    	{
	    		bindId: "itemDisplayMain",
				type: "Ti.UI.View",
				properties:{
					left: "15dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					touchEnabled: false
				},
				events:{
					//no event
				},
			    childTemplates: [
			    	{
			    		bindId: 'nameLabel',
			            type: 'Ti.UI.Label', 
			            properties: {
			            	font: {
								fontSize: "13dp"
							},
							color: "#333",
							touchEnabled: false
			            }
			        }
			    ]
	        }
	    ]
	},
	twoColumns: {
		bindId: "itemContainer",
		type: "Ti.UI.View",
		properties:{
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			touchEnabled: false
		},
		events:{
			//no event
		},
		childTemplates: [
	    	{
	    		bindId: "itemDisplayLeft",
				type: "Ti.UI.View",
				properties:{
					left: "15dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					touchEnabled: false
				},
				events:{
					//no event
				},
				childTemplates:[
					{
						bindId: 'nameLabel',
			            type: 'Ti.UI.Label',
			            properties: {
			            	font: {
								fontSize: "13dp"
							},
							color: "#333",
							touchEnabled: false
			            }
					}
				]
	       },
	       {
	    		bindId: "itemDisplayRight",
				type: "Ti.UI.View",
				properties:{
					right: "15dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					touchEnabled: false
				},
				events:{
					//no event
				},
				childTemplates:[]
	        }
	    ]
	},
	twoColumnsWithSubtitle: {
		bindId: "itemContainer",
		type: "Ti.UI.View",
		properties:{
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			touchEnabled: false
		},
		events:{
			//no event
		},
		childTemplates: [
	    	{
	    		bindId: "itemDisplayLeft",
				type: "Ti.UI.View",
				properties:{
					left: "15dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					layout: "vertical",
					touchEnabled: false
				},
				events:{
					//no event
				},
				childTemplates:[
					{
						bindId: 'nameLabel',
			            type: 'Ti.UI.Label',
			            properties: {
			            	left: 5,
							height: 27,
			            	font: {
								fontSize: "13dp"
							},
							color: "#333",
							verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
							touchEnabled: false	
			            }
					},
					{
						bindId: 'subtitleLabel',
			            type: 'Ti.UI.Label',
			            properties: {
			            	left: 5,
							height: 20,
			            	font: {
								fontSize: "11dp"
							},
							color: "#aaa",
							verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
							touchEnabled: false
			            }
					}
				]
	       },
	       {
	    		bindId: "itemDisplayRight",
				type: "Ti.UI.View",
				properties:{
					right: "15dp",
					width: Ti.UI.SIZE,
					height: Ti.UI.FILL,
					touchEnabled: false
				},
				events:{
					//no event
				},
				childTemplates:[]
	        }
	    ]
	},
	//left size components
	icon:{
		bindId: "itemIcon",
		type: "Ti.UI.View",
		properties: {
			width: 50,
			height: Ti.UI.FILL,
			touchEnabled: false
		},
		events: {
			//no event
		},
		childTemplates: [
			{
				bindId: "iconImageView",
				type: "Ti.UI.ImageView",
				properties: {
					left: 0,
					height: Ti.UI.FILL
				},
				touchEnabled: false
			}
		]
	},
	checkbox: {
		bindId: "itemCheckboxTouch",
		type: "Ti.UI.View",
		properties:{
			left:0,
			width: "25dp",
			height: Ti.UI.FILL,
		},
		events:{
			//onSingletap for toggle check status
		},
	    childTemplates: [
	    	{                           
	            bindId: "itemCheckbox",
				type: "Ti.UI.View",
				properties:{
					left: "15dp",
					width:"10dp",
					height:"10dp",
					borderWidth: "1dp",
					borderColor: "#bbb",
					backgroundColor: "white",
					touchEnabled: false
				},
				events:{
					//no event
				},
			    childTemplates: [
			    	{   
			    		bindId: 'itemCheckMark',                       
			            type: 'Ti.UI.ImageView',
			            properties: {
			            	width: Ti.UI.FILL,
							height: Ti.UI.FILL,
							visible: false,
							image: "/checkmark.png",
							touchEnabled: false
			            }
			        }
			    ]
	        }
	     ]
	},
	
	//right side components(for multiple columns only)
	label: {
		bindId: 'statusLabel',                       
        type: 'Ti.UI.Label',
        properties: {
			font: {
				fontSize: "13dp"
			},
			color: "#333",
			touchEnabled: false
        }
	},	
	switchButton: {
		bindId: 'switchButton',
        type: 'Ti.UI.Switch', 
		events: {
			// onChange for switch button
		}
	}
};
 /**
  * @alias module:lib/genericListView
  * @param {object} opts - The configuration parameter for genericListView
  * @param {Ti.UI.View | Ti.UI.Window} opts.window - The container for genericListView. See Titanium documentation for 
  * {@link http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.Window Ti.UI.Window} and {@link http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.View Ti.UI.View}
  * This must be specified since interaction with navigation and title is required when multiple selection action is defined.
  * @param {boolean} [opts.windowHasSlidingMenu = false] - The flag indentify whether the container has a button that can open sliding menu. 
  * When set to true, it will ban all interaction with the genericListView when slidingMenu is opened.
  * @param {boolean} [opts.hasSearchBar] - The flag indentifiy whether the genericListView content is searchable.  
  * If you sepecify the value, it will equal to that value no matter how long the data is; otherwise, it depends on the data length of the listview.
  * @param {object} [opts.orderBy = false] - Specify the sorting order for the sections. If not defined, it will just show as the original data order.
  * @param {string} [opts.orderBy.name] - Specify what you what
  * @param {Arrray<object>} opts.sections - The definition of each section contained by the listview
  * @param {string} opts.sections.id - The unique identifier for each section to retrieve the section object
  * @param {Array<listItemData>} opts.sections.data - The data source of each section, preprocessed to bindID: value format. See {@link module:lib/genericListView~listItemData}
  * @param {string} [opts.sections.title] - The human readable title displayed on headerView. If empty, the section will show without headerView
  * @param {boolean} [opts.sections.collapsable = true] - The flag indicates whether the section is collapsable and expandable when headerView is clicked
  * @param {listSectionItemTemplate} [opts.sections.itemTemplate = {@link baseTemplate}] - The listItem template each section should use. See {@link module:lib/genericListView~listSectionItemTemplate}
  * @param {listItemEventHandler} [opts.sections.eventHandler = defaultEventHandler] -  The action carries out when user interact with listItem. See {@link module:lib/genericListView~listItemEventHandler}
  * @param {object} [opts.defaultTemplate] - The default template will serve as the template when individual section itemTemplate is not provided.
  * @param {listSectionItemTemplate} [opts.defaultTemplate.itemTemplate = {@link baseTemplate}] - See {@link module:lib/genericListView~listSectionItemTemplate}. When not provided, baseTemplate will be use instead.
  * @param {listItemEventHandler} [opts.defaultTemplate.eventHandler = defaultEventHandler] - See {@link module:lib/genericListView~listItemEventHandler}.
  * @returns {genericListView} The listView contains all method provide by {@link http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.ListView Ti.UI.ListView} and extended update method
  * 
  */
function GenericListView(opts){
	var window = opts.window;
	var sections = opts.sections;	
	var hasSearchBar = !_.isUndefined(opts.hasSearchBar)? opts.hasSearchBar :  _.reduce(sections, function(dataLength, section){return dataLength + section.data.length;}, 0) > MAXLISTLENGTHWITHOUTSEARCHBAR;
	var orderBy = opts.orderBy || false;
	
	// Check the validity of the template, including field correctness and eventHandler
	function parseTemplateOpts(template, eventHandler){
		template = template || {};
		/**
		 * Default template options for section instances. Changing these options may affects many
	 	 * genericListView instances.
		 * @namespace
		 */
		var baseTemplate = {
			/** ListItem only shows nameLabel by default */
			display: "oneColumn",
			/** You cannot swipe the listItem to show operations by default */
			swipable: false,
			/** The edit operation is shown by default when user can swipe on the item */
			editable: true,
			/** You cannot multi-select listItems by default */
			hasCheckbox: false,
			/** There is no icon for listItem by default */
			hasIcon: false
		};
		// Only take minimal itemplate definition in the first step to prevent malicious user from invalid template defination 
		var itemTemplate = _.extend({}, baseTemplate, _.pick(template, "display", "swipable", "editable", "hasCheckbox", "hasIcon"));
		var itemEventHandler = _.extend({}, eventHandler);
		// Add additional field which rely on some precondition only if the condition is satisfied
		// 1. Take rightComponent only when itemDisplay is indeed defined as twoColumns
		if(itemTemplate.display.indexOf("twoColumns") != -1){
			itemTemplate.rightComponent = template.rightComponent;
		}
		// 2. Over write singletap function when user try to set singletap apply to a listItem without checkbox
		if(!itemTemplate.hasCheckbox && itemEventHandler && itemEventHandler.onSingletap === "apply to checkbox"){
			itemEventHandler.onSingletap = function(){console.log("Damn you cheater!!!");};
		}
		if(itemTemplate.swipable === true){
			if(itemTemplate.editable === true){
				itemTemplate.swipable = ["Edit", "Delete"];
			}
			else{
				itemTemplate.swipable = ["Delete"];
			}
		}
		return {
			itemTemplate: itemTemplate,
			eventHandler: itemEventHandler
		};
	}
	
	// Generate ListItem template
	function _listItemTemplateGenerator(opts, eventManager){
		var template = JSON.parse(JSON.stringify(templates.baseTemplate));
		
		//display layer
		var itemDisplay = templates.findbyBindId(template, "itemDisplay");
		if(opts.hasCheckbox){
			var checkboxTemplate = JSON.parse(JSON.stringify(templates.checkbox));
			checkboxTemplate.events.singletap = eventManager.getEventByName("toggleSelectStatus");
			itemDisplay.childTemplates.push(checkboxTemplate);
		}
		if(opts.hasIcon){
			var iconTemplate = JSON.parse(JSON.stringify(templates.icon));
			itemDisplay.childTemplates.push(iconTemplate);
		}
		if(typeof opts.display === "object"){ //which means user defined their own template
			var displayTemplate = opts.display;
		}
		else{
			if(!templates[opts.display]){
				opts.display = "oneColumn";
			}
			var displayTemplate = JSON.parse(JSON.stringify(templates[opts.display]));
			itemDisplay.events.singletap = eventManager.getEventByName("singletapHandler");
			if(opts.display.indexOf("twoColumns") != -1 && templates[opts.rightComponent]){
				var rightComponentTemplate = JSON.parse(JSON.stringify(templates[opts.rightComponent]));
				if(opts.rightComponent === "switchButton"){
					templates.findbyBindId(rightComponentTemplate, "switchButton").events.change = eventManager.getEventByName("switchChangeHandler");
				}
				templates.findbyBindId(displayTemplate, "itemDisplayRight").childTemplates.push(rightComponentTemplate);	
			}
		}
		itemDisplay.childTemplates.push(displayTemplate);
		
		if(opts.swipable){
			var operationTemplate = JSON.parse(JSON.stringify(templates.operationLayer));
			itemDisplay.events.touchstart = eventManager.getEventByName("touchstartHandler");
			itemDisplay.events.touchmove = eventManager.getEventByName("touchmoveHandler");
			itemDisplay.events.touchend = eventManager.getEventByName("touchendHandler");
			if(OS_ANDROID){
				itemDisplay.events.touchcancel = eventManager.getEventByName("touchendHandler");
			}
			_.each(opts.swipable, function(op){
				var operationEventHandler = eventManager.getEventByName(op.toLowerCase() + "Handler");
				if(operationEventHandler){
					var itemOperation = JSON.parse(JSON.stringify(templates.operation));
					itemOperation.bindId = "item" + op + "Operation";
					itemOperation.events.click = operationEventHandler;
					itemOperation.childTemplates[0].bindId = 'item' + op + 'Label';
					itemOperation.childTemplates[0].properties.text = op;
					if(op === "Delete"){
						itemOperation.properties.backgroundColor = "#f00";
					}
					operationTemplate.childTemplates.push(itemOperation);
				}
			});
			operationTemplate.properties.maxWidth = OPERATIONBUTTONWIDTH * opts.swipable.length;
			templates.findbyBindId(template, "item").childTemplates.unshift(operationTemplate);
		}
		
		return template;
	}

	// Define user interaction with the listItems
	function EventManager(eventHandler){
		var self = this;
		
		//default events handler
		var defaultEventHandler = {
			onSingletap: function(){
				console.log("singletapped");
			},
			onEditClick: function(){
				console.log("edit clicked");
			},
			onDeleteClick: function(){
				console.log("delete clicked");
			},
			onSwitchChange: function(){
				console.log("switch value changed");
			},
			actionsOnMultipleItems: []
		};
		var eventHandler = _.extend({}, defaultEventHandler, eventHandler);
		
		// For implementation pitfall note:
		// Using section.getItemAt will return a copy of current value for the listItem, so changing of that won't really be applied to listItem until you explicitly call updateItemAt
		self.eventHandler = { 
			switchChangeHandler: function(e){
				var id = e.section.getItemAt(e.itemIndex).idLabel.text;
				var value = e.source.getValue();
				eventHandler.onSwitchChange(id, value);
			},
			singletapHandler: function(e){
				window.fireEvent("singletap");
				//console.log("singletap")
				// Apply singletap event to toggle select event if user are currently in selectMode. 
				if(window.selectMode){
					if(eventHandler.actionsOnMultipleItems.length){
						self.eventHandler.toggleSelectStatus(e);
					}	
					return;
				}
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				
				// Skip singletap event if item currently disabled singletap functionality
				// The reason for using a singletap lock is because if the operation layer is closed by touchstart, 
				// singletap shouldn't be able trigger event bind on it, user need at least to lift their finger up from the screen once
				// For example, if you use source.left !== 0 to block event that originally should be carried out by singletap
				// source.left === 0 may be result from touchstart moving it back to the close position. 
				if(selectedItem.singletapable){
					// Priority 1: If operation layer currently shown, close operation layer
					// We believe operation layer is shown unless display layer left is 0
					var source = e.source;
					if(selectedItem.itemDisplay.left !== 0){
						 if(!selectedItem.animating){
						 	var animation = Titanium.UI.createAnimation();
							var TIMEFORUNITDISTANCE = 5;
					
							selectedItem.draggable = false;
							selectedItem.animating = true;
							animation.left = 0;
						 	animation.duration = source.left * TIMEFORUNITDISTANCE * -1;
						 	section.updateItemAt(index, selectedItem);
							source.animate(animation, function(){
								selectedItem.itemDisplay.left = animation.left;
								selectedItem.animating = false;
								section.updateItemAt(index, selectedItem);
							});
						}		
					}
					// Priority 2: If singletap event is applied to checkbox, toggle select status
					else if(eventHandler.onSingletap === "apply to checkbox"){
						self.eventHandler.toggleSelectStatus(e);
					}
					// Priority 3: trigger singletap handler passed in and use idLabel content as its parameter
					else{
						var id = selectedItem.idLabel.text;
						eventHandler.onSingletap(id);
					}
				}		
			},
			editHandler: function(e){
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				var id = selectedItem.idLabel.text;
				eventHandler.onEditClick(id);
				
				selectedItem.itemDisplay.left = 0;
				section.updateItemAt(index, selectedItem);
			},
			deleteHandler: function(e){
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				var id = selectedItem.idLabel.text;
				eventHandler.onDeleteClick(id);
				
				selectedItem.itemDisplay.left = 0;
				section.updateItemAt(index, selectedItem);
			},
			touchstartHandler: function(e){
				//console.log("start")
				e.cancelBubble = true;
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				// TouchStart enabled draggable
				// The reason for using draggable lock here is because if the operation layer is closed by singletap/touchstart, 
				// touchmove shouldn't be able to open it again during this "touch", user need at least to lift their finger up from the screen once
				selectedItem.draggable = true;
				section.updateItemAt(index, selectedItem);
				if(!selectedItem.animating){
					var operationLayerWidth = section.operationLayerWidth * -1;
					var source = e.source;
					if(selectedItem.itemDisplay.left === operationLayerWidth){
						var animation = Titanium.UI.createAnimation();
						var TIMEFORUNITDISTANCE = 5;
						animation.left = 0;
						animation.duration = operationLayerWidth * TIMEFORUNITDISTANCE * -1;
						
						selectedItem.animating = true;
						selectedItem.draggable = false;
						selectedItem.singletapable = false;
						section.updateItemAt(index, selectedItem);
						if(OS_IOS){
							listView.setCanScroll(false);
						}
						source.animate(animation, function(){
							selectedItem.itemDisplay.left = 0;
							selectedItem.animating = false;
							section.updateItemAt(index, selectedItem);
						});
					}
				}	
			},
			touchmoveHandler: function(e){  //range of move 0 to operationLayerWidth
				//console.log("move")
				e.cancelBubble = true;
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				
				// Start swipe if it is currently draggable
				if(selectedItem.draggable){
					if(selectedItem.itemDisplay.left != 0 && OS_IOS){
						listView.setCanScroll(false);
					}
					var operationLayerWidth = section.operationLayerWidth * -1;
					var delta = selectedItem.previous? e.x - selectedItem.previous : 0;
					selectedItem.itemDisplay.left += delta;
					if(selectedItem.itemDisplay.left < operationLayerWidth){
						selectedItem.itemDisplay.left = operationLayerWidth;
					}
					else if(selectedItem.itemDisplay.left > 0){
						selectedItem.itemDisplay.left = 0;
					}
					selectedItem.previous = e.x;
					section.updateItemAt(index, selectedItem);
				}
			},
			touchendHandler: function(e){
				//console.log("end")
				e.cancelBubble = true;
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				
				selectedItem.singletapable = true;
				section.updateItemAt(index, selectedItem);
				if(OS_IOS){
					listView.setCanScroll(true);
				}
				
				if(!selectedItem.animating){
					var operationLayerWidth = section.operationLayerWidth * -1;
					var source = e.source;
					if(selectedItem.itemDisplay.left !== 0 || selectedItem.itemDisplay.left !== operationLayerWidth){
						var animation = Titanium.UI.createAnimation();
						var TIMEFORUNITDISTANCE = 5;
						var position = selectedItem.itemDisplay.left / operationLayerWidth;  //should open when greater than 0.2, close when less than 0.2
						animation.left = position >= 0.2? operationLayerWidth : 0;
						animation.duration = operationLayerWidth * TIMEFORUNITDISTANCE * (position > 0.2?(1 - position) : position) * -1;
						selectedItem.animating = true;
						section.updateItemAt(index, selectedItem);
						
						source.animate(animation, function(){
							selectedItem.itemDisplay.left = animation.left;
							selectedItem.animating = false;
							section.updateItemAt(index, selectedItem);
						});
					}
				}
			},
			toggleSelectStatus: function(e){
				e.cancelBubble = true;	
				var index = e.itemIndex;
				var section = e.section;
				var selectedItem = section.getItemAt(index);
				selectedItem.section = section;
				selectedItem.index = index;
				if(!selectedItem.hasChecked){
					selectItem(selectedItem);
				}
				else{
					deselectItem(selectedItem);
				}
				updateNavBarOnToggleSelectStatus();
				
				function selectItem(selectedItem){
					selectedItems.push(selectedItem);
					selectedItem.hasChecked = true;
					selectedItem.itemCheckMark.visible = true;
					selectedItem.section.updateItemAt(selectedItem.index, selectedItem);
				}
				
				function deselectItem(selectedItem){
					// Find the index of the selectedItem, _.indexOf cannot be used here since condition is an object
					var index;
					_.each(selectedItems, function(item, i){
						if(item.section.id === selectedItem.section.id && item.index === selectedItem.index){
							index = i;
						}
					});
					selectedItems.splice(index, 1);
					// Workaround(1): only visually deselect those sections which is currently visible
					if(!sectionMap[selectedItem.section.id].collapsed){
						selectedItem.hasChecked = false;
						selectedItem.itemCheckMark.visible = false;
						selectedItem.section.updateItemAt(selectedItem.index, selectedItem);
					}
				}
				function deselectAllItems(){
					var reRenderedSection = [];
					while(selectedItems.length){
						var selectedItem = selectedItems[0];
						deselectItem(selectedItem);
						// Workaround(2): re-render those sections which is currently collapsed.
						// This workaround is because sectionObj.renderedData individual item cannot be reassigned to other value.
						if(sectionMap[selectedItem.section.id].collapsed && _.indexOf(reRenderedSection, selectedItem.section.id)){
							var sectionObj = sectionMap[selectedItem.section.id];
							sectionObj.renderedData = _renderData(sectionObj.rawData, sectionObj.template, [sectionObj.title], sectionObj.orderBy);
							reRenderedSection.push(selectedItem.section.id);
						}
					}
					updateNavBarOnToggleSelectStatus();
				}
				function updateNavBarOnToggleSelectStatus(){	
					if(!window.selectMode && selectedItems.length > 0){
						window.selectMode = true;
						window.cacheTitle = window.title;
						window.setTitle(selectedItems.length + " item selected..");
						if(OS_IOS){
							//cache nav button
							window.cacheLeftNavBtn = window.leftNavButton;
							window.cacheRightNavBtns = window.rightNavButtons;
							
							var opts = {};
							opts.systemButton = Ti.UI.iPhone.SystemButton.CANCEL;
							var cancelButton = Ti.UI.createButton(opts);
							var rightNavButtons = [];
							_.each(eventHandler.actionsOnMultipleItems, function(action){
								rightNavButtons.push(action.button);
							});
							
							setTimeout(function(){
								cancelButton.addEventListener("click", deselectAllItems);
								if(!eventHandler.actionsOnMultipleItems.listenerBinded){
									_.each(eventHandler.actionsOnMultipleItems, function(action){
										action.button.addEventListener("click", function(){
											var ids = _.map(selectedItems, function(selectedItem){
												return selectedItem.idLabel.text;
											});
											deselectAllItems();
											action.fn(ids);
										});
									});
									eventHandler.actionsOnMultipleItems.listenerBinded = true;
								}
							}, 500);
							window.setLeftNavButton(cancelButton);
							window.setRightNavButtons(rightNavButtons);	
						}
						if(OS_ANDROID){
							////TODO: Hope to support contextual menu here someday
							var activity = window.activity;
							activity.onCreateOptionsMenu = function(e) {
								var menu = e.menu;
								var cancelMenuButton = menu.add({
									title: "Cancel"
								});
								cancelMenuButton.addEventListener("click", deselectAllItems);	
								_.each(eventHandler.actionsOnMultipleItems, function(action){
									var actionMenuButton = menu.add({
										title: action.title
									});
									actionMenuButton.addEventListener("click", function(){
										var ids = _.map(selectedItems, function(selectedItem){
											return selectedItem.idLabel.text;
										});
										deselectAllItems();
										action.fn(ids);
									});
								});
							};
							activity.invalidateOptionsMenu();
							window.addEventListener("androidback", deselectAllItems);
						}
					}
					else if(selectedItems.length == 0 && window.selectMode){
						window.selectMode = false;
						window.setTitle(window.cacheTitle);
						if(OS_IOS){
							window.setLeftNavButton(window.cacheLeftNavBtn);
							window.setRightNavButtons(window.cacheRightNavBtns);
						}
						if(OS_ANDROID){
							var activity = window.activity;
							activity.onCreateOptionsMenu = null;
							activity.invalidateOptionsMenu();
							window.removeEventListener("androidback", deselectAllItems);
						}
						listView.fireEvent("exitSelectMode");
					}
					else if(selectedItems.length > 0){
						window.setTitle(selectedItems.length + (selectedItems.length == 1?  " item" : " items") + " selected..");
					}
				}
			}
		};		
	}
	EventManager.prototype.getEventByName = function(name){
		return this.eventHandler[name];
	};
	
	function createSection(section, hasOwnTemplate){
		var sectionObj = Ti.UI.createListSection();
		// Basic attributes
		sectionObj.id = section.id;
		sectionObj.rawData = section.data;
		sectionObj.orderBy = section.orderBy;
		sectionObj.orderValue = section.orderValue;
		
		// Render headerView and set proper collapse feature to the section
		if(section.title){
			sectionObj.title = section.title;
	
			var headerView = _HeaderViewGenerator(sectionObj.title);
			if(section.collapsable !== false){
				headerView.addEventListener("singletap", function(){
					if(sectionObj.collapsed){
						sectionObj.setItems(sectionObj.renderedData);
						sectionObj.collapsed = false;
					}
					else{
						sectionObj.renderedData = sectionObj.getItems();
						sectionObj.setItems([]);
						sectionObj.collapsed = true;
					}
				});
			}
			sectionObj.setHeaderView(headerView);
		}
		// Render section with corresponding template and data
		if(hasOwnTemplate){
			sectionObj.template = section.id;
		}
		
		sectionObj.setItems(_renderData(sectionObj.rawData, sectionObj.template, [sectionObj.title], sectionObj.orderBy));
		
		// Workaround: attach operation layer information to the section
		var operationLayer = templates.findbyBindId(listviewTemplates[section.id] || listviewTemplates["defaultTemplate"], "itemOperation");
		if(operationLayer){
			sectionObj.operationLayerWidth = operationLayer.properties.maxWidth;
		}
		return sectionObj;
	}
	
	function _renderSections(){
		var renderedSections = _.values(sectionMap);
		if(orderBy){
			// If user trying to orderBy some unsupported column beyond the following list, force them orderBy title
			if(_.indexOf(["id", "title", "orderValue"], orderBy.name) === -1){
				orderBy.name = "title";
			}
			// Start sorting renderedData
			renderedSections = _.sortBy(renderedSections, function(sectionObj){
				var orderName = orderBy.name;
				var orderValue;
				// It may happen that user try to sort the data by some column that they haven't defined, then force them orderBy id
				if(!sectionObj[orderBy.name]){
					orderName = "id";	
				}
				// Get the orderValue. If the orderName is one of the label, it acutally need the text inside to be the orderValue. Otherwise, just get the orderValue
				orderValue = sectionObj[orderName];
				// If user try to specify a special criteria array for sorting, then we sort it accords to their order within the criteria array.
				// Otherwise, alphabetical or letter doesn't make a impact on orderValue
				if(orderBy.criteria instanceof Array && !_.isEmpty(orderBy.criteria)){
					orderValue = _.indexOf(orderBy.criteria, orderValue);
				}
				return orderValue;
			});
			// If the user try to order desc, reverse the result.
			// The reason for not using * -1 is for considering order alphabetically for string. Not find a good solution for that yet.
			// Since we are not yet dealing with huge amount of data, reverse is acceptable.
			if(orderBy.order === "desc"){
				renderedSections.reverse();
			}
		}
		return renderedSections;
	}
	// Generate HeaderView	
	function _HeaderViewGenerator(title){
		var view = Ti.UI.createView({
			backgroundColor: "#f90",
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE
		});
		var label = Ti.UI.createLabel({
			text: title,
			left: "15dp",
			height: "20dp",
			font:{
				fontSize: "13dp",
				fontWeight: "bold"
			},
			color:"#fff"
		});
		view.add(label);
		return view;
	};
	
	// Attach defaultValue, searchText and template information
	function _renderData(rawData, template, searchableText, orderBy){
		var renderedData = _.map(rawData, function(data){
			var defaultBindIdValue = {
				idLabel: {text: ""},
				itemDisplay: {left: 0},
				itemCheckMark: {visible: false},
				hasChecked: false,
				draggable: true,
				singletapable: true,
			};
			var defaultProperties = {
				width: Ti.UI.FILL,
				height: "50dp",
			};
			if(OS_IOS){
				defaultProperties.selectionStyle = Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE;
			}
			data = _.extend({}, defaultBindIdValue, data);
			data.properties = _.extend({}, defaultProperties, data.properties);
			data.properties.searchableText = searchableText.join(" ") + " " + data.nameLabel.text;
			data.template = template;
			return data;
		});
		if(orderBy){
			// If user trying to orderBy some unsupported column beyond the following list, force them orderBy nameLabel
			if(_.indexOf(["nameLabel", "subtitleLabel", "statusLabel", "orderValue"], orderBy.name) === -1){
				orderBy.name = "nameLabel";
			}
			// Start sorting renderedData
			renderedData = _.sortBy(renderedData, function(data){
				var orderName = orderBy.name;
				var orderValue;
				// It may happen that user try to sort the data by some column that they haven't defined, then force them orderBy nameLabel
				if(!data[orderBy.name]){
					orderName = "nameLabel";	
				}
				// Get the orderValue. If the orderName is one of the label, it acutally need the text inside to be the orderValue. Otherwise, just get the orderValue
				orderValue = orderName !== "orderValue"? data[orderName]["text"] : data[orderName];
				// If user try to specify a special criteria array for sorting, then we sort it accords to their order within the criteria array.
				// Otherwise, alphabetical or letter doesn't make a impact on orderValue
				if(orderBy.criteria instanceof Array && !_.isEmpty(orderBy.criteria)){
					orderValue = _.indexOf(orderBy.criteria, orderValue);
				}
				return orderValue;
			});
			// If the user try to order desc, reverse the result.
			// The reason for not using * -1 is for considering order alphabetically for string. Not find a good solution for that yet.
			// Since we are not yet dealing with huge amount of data, reverse is acceptable.
			if(orderBy.order === "desc"){
				renderedData.reverse();
			}
		}
		
		return renderedData;
	}
	
	opts.defaultTemplate = opts.defaultTemplate || {};
	var defaultTemplate = parseTemplateOpts(opts.defaultTemplate.itemTemplate, opts.defaultTemplate.eventHandler);
	// Store listview template map used to generate listview
	// By default it contains the defaultTemplate with either baseTemplate or user defined defaultTemplate
	// Other templates is create by section itemTemplate and specified by section id as key
	var listviewTemplates = {
		defaultTemplate: _listItemTemplateGenerator(defaultTemplate.itemTemplate, new EventManager(defaultTemplate.eventHandler))
	};
	// Store selected listItem data of the genericListView, which is not constrained by sections
	var selectedItems = [];  
	// Store section object with section id as key for the map
	var sectionMap = {};
	var listView = null;

	// Generate listview templates -> section
	_.each(sections, function(section){
		var itemTemplate, hasOwnTemplate;
		// Check the completeness and validality of section required field
		if(!_.isString(section.id) || !section.data){
			console.log("Execution Terminated(Invalid section value): Either id or data of the section is invalid, null returned instead");
			return null;
		}
		// Render additional template other than baseTemplate
		if(section.itemTemplate){
			itemTemplate = parseTemplateOpts(section.itemTemplate, section.eventHandler);
			listviewTemplates[section.id] = _listItemTemplateGenerator(itemTemplate.itemTemplate, new EventManager(itemTemplate.eventHandler));
		}
		// Create section with own template/default template
		hasOwnTemplate = typeof listviewTemplates[section.id] !== "undefined";
		sectionMap[section.id] = createSection(section, hasOwnTemplate);
	});
	
	// Generate listview after parsing the template data
	listView = Ti.UI.createListView({
		templates: listviewTemplates,
		defaultItemTemplate: "defaultTemplate",
		keepSectionsInSearch: true
	});
	// Render listView with sections and set searchBar if available
	listView.setSections(_renderSections());
	
	if(hasSearchBar){
		var searchTextField = Ti.UI.createTextField({
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		    color: '#333',
		    height: Ti.UI.FILL,
		    left:5,
		   	right:5,
		    top: 5,
		    bottom: 5,
		    font:{
		    	fontSize:13
		    },
		    hintText: 'Search',
		    clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
		});
		searchTextField.addEventListener("change", function(e){
		    listView.searchText = e.value;
		});
		var searchBar = Ti.UI.createView({
			backgroundColor: "#ccc",
			width: Ti.UI.FILL,
			height: "35dp"
		});
		searchBar.add(searchTextField);
		listView.headerView = searchBar;
	}
	// Deferred the update for the listView until user exit select mode, in order to preserve selection status.
	// The event will be fired every time after window.selectMode changes to false.
	// See update function for details
	listView.addEventListener("exitSelectMode", function(){
		if(listView.cachedSectionData){
			listView.update(listView.cachedSectionData);
			listView.cachedSectionData = null;
		}
	});

	/** 
	 * Update listview with new section data. 
	 * Update will be deferred until user exit select mode and occurs only to the sections whose data have been changed.
	 * If sections contain section that not exist previously, defaultTemplate will be used to create new section and title will be used as section title.
	 * So if you are dealing with listview that section varies, be sure you provide approperiate defaultTemplate and title.
	 * 
	 * @memberOf module:lib/genericListView#
	 * @alias update
	 * 
	 * @param {Array<object>} sections - Sections data for update the listview
  	 * @param {string} sections.id - The unique identifier for each section to retrieve the section object
  	 * @param {string} [sections.title] - The title is used in creation of a new section. If not provided, id will be used instead.
  	 * @param {Array<listItemData>} sections.data - The data source of each section. See {@link module:lib/genericListView~listItemData}
	 *
	 */
	listView.update = function(sections){
		if(window.selectMode){
			listView.cachedSectionData = sections;
		}
		else{
			// Convert the sections from array to hash table for better accessibility
			var sectionData = {};
			_.each(sections, function(section){
				// Check the completeness and validality of section required field
				if(!_.isString(section.id) || !section.data){
					console.log("Execution Terminated(Invalid section value): Either id or data of the section is invalid, null returned instead");
					return;
				}
				sectionData[section.id] = {
					id: section.id,
					title: section.title || section.id,
					data: section.data
				};
			});
			// Update each section os the sectionMap
			_.each(sectionMap, function(sectionObj, id){
				if(sectionData[id]){
					//The section is still valid, check if there is update to its data
					if(!_.isEqual(sectionObj.rawData, sectionData[id].data)){
						sectionObj.rawData = sectionData[id].data;
						sectionObj.renderedData = _renderData(sectionObj.rawData, sectionObj.template, [sectionObj.title], sectionObj.orderBy);
						if(!sectionObj.collapsed){
							sectionObj.setItems(sectionObj.renderedData);
						}
					}
					delete sectionData[id];
				}
				else{
					// The section is no longer valid, remove it from sectionMap
					delete sectionMap[id];
				}
			});
			// If sectionData is not empty, then we need to create new section with default template
			_.each(sectionData, function(section){
				sectionMap[section.id] = createSection(section, false);
			});
			listView.setSections(_renderSections());
		}
	};
	return listView;
}

module.exports = GenericListView;