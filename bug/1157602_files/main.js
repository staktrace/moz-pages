AUI().ready("liferay-hudcrumbs","liferay-navigation-interaction","liferay-sign-in-modal",function(b){var a=b.one("#navigation");if(a){a.plug(Liferay.NavigationInteraction)}var d=b.one("#breadcrumbs");if(d){d.plug(b.Hudcrumbs)}var c=b.one("li.sign-in a");if(c&&c.getData("redirect")!=="true"){c.plug(Liferay.SignInModal)}});AUI().use("aui-viewport");