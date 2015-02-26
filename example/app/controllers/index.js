//sample for building a generic listview
var GenericListView = require('/genericListView');

var sections = [
	{
		id: "test1",
		title: "test section 1",
		itemTemplate:{
			display: "oneColumn",
			swipable: true,
			hasCheckbox: false
		},
		data: [
			{
				idLabel: {text: 1},
				nameLabel:{text:"I am test label"}
			},
			{
				idLabel: {text: 2},
				nameLabel:{text:"I am another test label"}
			}
		],
		eventHandler:{
			onSingletap: function(id){
				console.log("item " + id + " got singletapped!");
			},
			onEditClick: function(id){
				console.log("item " + id + " edit button clicked!");
			},
			onDeleteClick: function(id){
				console.log("item " + id + " delete button clicked!");
			},
		}
	},
	{
		id: "test2",
		title: "test section 2",
		itemTemplate:{
			display: "twoColumnsWithSubtitle",
			swipable: true,
			editable: false,
			hasCheckbox: true
		},
		data: [
			{
				idLabel: {text: 1},
				nameLabel:{text:"I am test label in section 2"},
				subtitleLabel:{text: "I am the subtitle"}
				
			},
			{
				idLabel: {text: 2},
				nameLabel:{text:"I am test label in section 2"},
				subtitleLabel:{text: "I am the subtitle"}
			}
		],
		eventHandler:{
			onSingletap: "apply to checkbox",
			actionsOnMultipleItems:[
				{
					title: "delete items",
					button: Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.TRASH }),
					fn: function(){console.log("delete the items");}
				}
			]
		}
	}
];

var opts = {
	window: $.win,
	sections: sections
};


var listView = new GenericListView(opts);

$.container.add(listView);


if(OS_IOS){
	$.index.open();
}
if(OS_ANDROID){
	$.win.open();
}
