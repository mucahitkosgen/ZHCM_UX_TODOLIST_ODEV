sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/DisplayListItem",
	"sap/ui/model/json/JSONModel"
], function(Controller, DisplayListItem, JSONModel) {
	"use strict";
	return Controller.extend("todolist.controller.TodoList", {
		onInit: function() {
			this._InitialView();
		},
		onPressAddTask: function(oEvent) {
			if (!this._oCreateDialog) {
				this._oCreateDialog = sap.ui.xmlfragment("todolist.fragment.CreateTodo", this);
				this.getView().addDependent(this._oCreateDialog);
			} else {
				this._oCreateDialog.close();
			}
			this._oCreateDialog.open();
		},
		onCancel: function() {
			if (this._oCreateDialog) {
				this._oCreateDialog.close();
			}
		},
		onSave: function() {
			var oModel = this.getView().getModel('todoListModel');
			var List = oModel.getProperty("/TodoList");
			var count = List.length;
			oModel.setProperty("/aTodo/Id", count + 1);
			var oData = oModel.getProperty("/aTodo");
			List.push(oData);
			oModel.setProperty("/aTodo", {
				Id: null,
				Todo: null,
				TodoDate: new Date(),
				CompletionDate: null
			});
			this._oCreateDialog.close();
		},
		_InitialView: function() {
			var oViewModel = new JSONModel({
				aTodo: {
					Id: null,
					Todo: null,
					TodoDate: new Date(),
					CompletionDate: null
				},
				TodoList: []
			});
			this.getView().setModel(oViewModel, "todoListModel");
		},
		onDone: function(oEvent) {
			var oObject = oEvent.getSource().getBindingContext('todoListModel').getObject();
			oObject.CompletionDate = new Date();
			this.byId("listTodo").getModel("todoListModel").refresh(true);
		},
		onDelete: function(oEvent) {
			var pPath = oEvent.getSource().getBindingContext('todoListModel').getPath();
			var sId = pPath.split("/");
			this.getView().byId("listTodo");
			var oModel = this.getView().getModel("todoListModel");
			var oData = oModel.oData.TodoList;
			var removed = oData.splice(sId[2], 1);
			this.byId("listTodo").getModel("todoListModel").refresh(true);
		}
	});
});